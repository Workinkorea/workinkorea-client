import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { tokenManager } from "../utils/tokenManager";

export interface ApiRequestOptions extends AxiosRequestConfig {
  // 커스텀 플래그: 이 옵션이 true면 Authorization 토큰을 붙이지 않음
  skipAuth?: boolean;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let isRefreshing = false;
let refreshQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  refreshQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  refreshQueue = [];
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 3000,
});

// Get token (단일 토큰 사용)
function getToken(): string | null {
  return tokenManager.getToken();
}

// Automatically attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (config.skipAuth) return config;

    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Refresh token
async function refreshToken(): Promise<string> {
  // 현재 토큰 가져오기
  const currentToken = getToken();

  if (!currentToken) {
    console.error("[apiClient] No token found for refresh");
    throw new Error("No token for refresh");
  }

  // JWT에서 사용자 타입 추출
  const userType = tokenManager.getUserType();

  if (!userType) {
    console.error("[apiClient] Cannot determine user type from token");
    throw new Error("Invalid token: cannot determine user type");
  }

  const endpoint =
    userType === "company" ? "/api/auth/company/refresh" : "/api/auth/refresh";

  console.log(`[apiClient] Starting refresh for ${userType} token`);

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
      console.error("[apiClient] Refresh response missing token");
      throw new Error("Missing token during refresh");
    }

    const rememberMe = tokenManager.isTokenInLocalStorage();
    tokenManager.setToken(newToken, rememberMe);

    console.log(`[apiClient] Refresh successful for ${userType} token`);
    return newToken;
  } catch (err) {
    console.error(`[apiClient] Refresh failed for ${userType} token:`, err);

    // 토큰 제거
    tokenManager.removeToken();

    // 로그인 페이지로 리다이렉트
    if (typeof window !== "undefined") {
      const loginPath = userType === "company" ? "/company-login" : "/login";
      console.log(`[apiClient] Redirecting to ${loginPath}`);
      window.location.href = loginPath;
    }
    throw err;
  }
}

// Intercept 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If refresh endpoint itself failed → don't retry, just fail
    // (refreshToken() already handles logout and redirect)
    if (
      originalConfig?.url?.includes("/auth/refresh") ||
      originalConfig?.url?.includes("/auth/company/refresh")
    ) {
      console.error("[apiClient] Refresh endpoint failed, not retrying");
      return Promise.reject(error);
    }

    // Handle 401 errors with automatic token refresh
    if (error.response?.status === 401 && !originalConfig._retry) {
      console.log(
        `[apiClient] 401 error on ${originalConfig?.url}, attempting refresh`
      );
      originalConfig._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log("[apiClient] Refresh in progress, queueing request");
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            reject,
          });
        });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const token = await refreshToken();
        processQueue(null, token);
        isRefreshing = false;

        // Retry original request with new token
        originalConfig.headers.Authorization = `Bearer ${token}`;
        console.log(`[apiClient] Retrying ${originalConfig?.url} with new token`);
        return api(originalConfig);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

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

// 디버깅용: 현재 refresh 중인지 확인
export const isRefreshingToken = () => isRefreshing;