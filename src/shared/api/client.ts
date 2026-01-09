import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { tokenManager } from "@/shared/lib/utils/tokenManager";

export interface ApiRequestOptions extends AxiosRequestConfig {
  // 커스텀 플래그: 이 옵션이 true면 Authorization 토큰을 붙이지 않음
  skipAuth?: boolean;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * TokenService: 토큰 관리 및 갱신을 담당하는 클래스
 *
 * 주요 기능:
 * 1. Promise 재사용 패턴 - 동시 다발적인 토큰 갱신 요청을 하나의 Promise로 통합
 * 2. Proactive Token Refresh - 토큰 만료 1분 전에 미리 갱신 (401 방지)
 * 3. 캡슐화 - 전역 변수 대신 클래스 내부 상태 관리
 */
class TokenService {
  // 현재 진행 중인 토큰 갱신 Promise (재사용 패턴)
  private refreshPromise: Promise<string> | null = null;

  /**
   * 유효한 토큰을 반환합니다 (Proactive Refresh)
   * - 토큰이 1분 이내에 만료될 예정이면 자동으로 갱신
   * - 여러 요청이 동시에 들어와도 하나의 갱신 요청만 실행
   */
  async getValidToken(): Promise<string | null> {
    const token = tokenManager.getToken();

    if (!token) {
      return null;
    }

    // 토큰이 1분 이내에 만료될 예정이면 미리 갱신 (Proactive)
    if (tokenManager.isTokenExpiringSoon(1)) {
      try {
        return await this.refresh();
      } catch (error) {
        console.error("[TokenService] Proactive refresh failed:", error);
        // Proactive refresh 실패 시 기존 토큰 사용 (아직 유효할 수 있음)
        return token;
      }
    }

    return token;
  }

  /**
   * 토큰을 갱신합니다 (Promise 재사용 패턴)
   * - 이미 갱신 중이면 기존 Promise 반환
   * - 새로운 갱신이면 새 Promise 생성 및 저장
   */
  async refresh(): Promise<string> {
    // 이미 갱신 중이면 같은 Promise 반환 (Queue 배열 대신)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 새로운 갱신 Promise 생성
    this.refreshPromise = this.performRefresh()
      .finally(() => {
        // 완료 후 Promise 초기화 (다음 갱신을 위해)
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /**
   * 실제 토큰 갱신 로직
   */
  private async performRefresh(): Promise<string> {
    const currentToken = tokenManager.getToken();

    if (!currentToken) {
      console.error("[TokenService] No token found for refresh");
      throw new Error("No token for refresh");
    }

    const userType = tokenManager.getUserTypeWithFallback();

    if (!userType || (userType !== 'user' && userType !== 'company' && userType !== 'admin')) {
      console.error("[TokenService] Cannot determine user type from stored token_type or JWT");
      throw new Error("Invalid token: cannot determine user type");
    }

    const endpoint =
      userType === "company" ? "/api/auth/company/refresh" :
        userType === "admin" ? "/api/auth/admin/refresh" :
          "/api/auth/refresh";

    try {
      const response = await api.post(
        endpoint,
        {},
        { skipAuth: true, withCredentials: true } as ApiRequestOptions
      );

      const newToken =
        response.data.accessToken ||
        response.data.access_token ||
        response.data.token;

      if (!newToken) {
        console.error("[TokenService] Refresh response missing token");
        throw new Error("Missing token during refresh");
      }

      const rememberMe = tokenManager.isTokenInLocalStorage();
      const newTokenType = response.data.token_type;

      // 새 토큰과 token_type 저장
      tokenManager.setToken(newToken, rememberMe, newTokenType);
      return newToken;
    } catch (err) {
      console.error(`[TokenService] Refresh failed for ${userType} token:`, err);

      // 토큰 제거
      tokenManager.removeToken();

      // 로그인 페이지로 리다이렉트
      if (typeof window !== "undefined") {
        const loginPath =
          userType === "company" ? "/company-login" :
            userType === "admin" ? "/admin/login" :
              "/login";

        console.warn('[Auth] Session expired. Redirecting to login...', {
          userType,
          loginPath,
          error: err
        });

        window.location.replace(loginPath);
      }
      throw err;
    }
  }
}

// TokenService 인스턴스 생성
const tokenService = new TokenService();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor: Proactive Token Refresh
// 요청 전에 토큰을 미리 검증하고 필요시 갱신
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (config.skipAuth) return config;

    // Proactive Token Refresh: 만료 임박 시 미리 갱신
    const token = await tokenService.getValidToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response Interceptor: 401 에러 시 토큰 갱신 (Fallback)
// Proactive refresh가 실패했거나 토큰이 예상보다 빨리 만료된 경우를 대비
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If request was canceled or no config, just reject
    if (!originalConfig) {
      return Promise.reject(error);
    }

    // If refresh endpoint itself failed → don't retry, just fail
    if (
      originalConfig.url?.includes("/api/auth/refresh") ||
      originalConfig.url?.includes("/api/auth/company/refresh") ||
      originalConfig.url?.includes("/api/auth/admin/refresh")
    ) {
      console.error("[apiClient] Refresh endpoint failed, not retrying");
      return Promise.reject(error);
    }

    // Handle 401 errors with automatic token refresh
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // Promise 재사용 패턴: 동시 다발적인 401 요청도 하나의 갱신으로 처리
        const token = await tokenService.refresh();

        // Retry original request with new token
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return api(originalConfig);
      } catch (err) {
        // 갱신 실패 시 에러 전파 (TokenService에서 이미 로그아웃 처리됨)
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get<T>(endpoint: string, options?: ApiRequestOptions) {
    return api.get<T>(endpoint, options).then((res) => res.data);
  },
  post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return api.post<T>(endpoint, data, options).then((res) => res.data);
  },
  put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return api.put<T>(endpoint, data, options).then((res) => res.data);
  },
  delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return api.delete<T>(endpoint, options).then((res) => res.data);
  },
};