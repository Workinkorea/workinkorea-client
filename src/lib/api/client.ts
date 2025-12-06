import { tokenManager } from '../utils/tokenManager';
import { ApiErrorResponse } from './types';

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  tokenType?: 'user' | 'company';
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// refresh Promise 캐싱 (race condition으로 인한 무한 루프 방지)
const refreshPromises: {
  user: Promise<string> | null,
  company: Promise<string> | null,
} = {
  user: null,
  company: null,
};

// refresh 후 재시도 중 플래그 (무한 루프 방지)
const isRetryingAfterRefresh: {
  user: boolean,
  company: boolean,
} = {
  user: false,
  company: false,
};

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { skipAuth, tokenType = 'user', ...fetchOptions } = options;

    const accessToken = tokenManager.getToken(tokenType);
    console.log('[DEBUG] Request start:', {
      endpoint,
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
      skipAuth,
      tokenType
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && !skipAuth && { Authorization: `Bearer ${accessToken}` }),
        ...fetchOptions.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
      // credentials는 명시적으로 전달된 값을 우선 사용
      credentials: fetchOptions.credentials || (skipAuth ? 'omit' : 'include'),
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        // refresh 엔드포인트에서 401이 발생하면 무한 루프 방지를 위해 바로 에러 처리
        const isRefreshEndpoint = endpoint.includes('/api/auth/refresh') ||
                                   endpoint.includes('/api/auth/company/refresh');

        console.log('[DEBUG] 401 Error:', {
          endpoint,
          isRefreshEndpoint,
          hasRefreshPromise: !!refreshPromises[tokenType],
          isRetryingAfterRefresh: isRetryingAfterRefresh[tokenType],
          skipAuth,
          tokenType
        });

        if (isRefreshEndpoint) {
          console.error('[ERROR] Refresh API failed (401) - logging out');
          const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
          // refresh 실패 시 토큰 제거 및 로그인 페이지로 리다이렉트
          tokenManager.removeToken(tokenType);
          refreshPromises[tokenType] = null; // Promise 캐시도 초기화
          isRetryingAfterRefresh[tokenType] = false;
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiError(
            errorData.error || 'Unauthorized',
            response.status,
            errorData
          );
        }

        // refresh 후 재시도 중인데 또 401이 발생하면 무한 루프 방지
        if (isRetryingAfterRefresh[tokenType]) {
          console.error('[ERROR] Retry after refresh failed (401) - logging out');
          tokenManager.removeToken(tokenType);
          refreshPromises[tokenType] = null;
          isRetryingAfterRefresh[tokenType] = false;
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiError(
            'Session expired after token refresh',
            response.status,
            { error: 'Session expired' }
          );
        }

        // 이미 refresh 중이면 같은 Promise를 재사용 (무한 루프 방지)
        if (refreshPromises[tokenType]) {
          console.log('[DEBUG] Waiting for existing refresh promise');
          try {
            const newToken = await refreshPromises[tokenType];

            // 재시도 플래그 설정
            isRetryingAfterRefresh[tokenType] = true;

            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), 3000);

            const retryConfig: RequestInit = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              },
              signal: retryController.signal,
            };

            const retryResponse = await fetch(url, retryConfig);
            clearTimeout(retryTimeoutId);

            // 재시도 성공하면 플래그 해제
            isRetryingAfterRefresh[tokenType] = false;

            if (!retryResponse.ok) {
              throw new Error(`API Error: ${retryResponse.status}`);
            }

            return retryResponse.json();
          } catch (error) {
            isRetryingAfterRefresh[tokenType] = false;
            throw error;
          }
        }

        refreshPromises[tokenType] = (async () => {
          try {
            console.log('[DEBUG] Calling refreshAccessToken');
            const newAccessToken = await refreshAccessToken(tokenType);
            console.log('[DEBUG] Got new access token:', {
              tokenPreview: `${newAccessToken.substring(0, 20)}...`,
              length: newAccessToken.length
            });
            // 원래 토큰이 localStorage에 있었는지 확인하여 같은 곳에 저장
            const rememberMe = tokenManager.isTokenInLocalStorage(tokenType);
            console.log('[DEBUG] Saving token:', { tokenType, rememberMe });
            tokenManager.setToken(newAccessToken, tokenType, rememberMe);

            // 저장 확인
            const savedToken = tokenManager.getToken(tokenType);
            console.log('[DEBUG] Token saved successfully:', {
              saved: savedToken === newAccessToken,
              savedTokenPreview: savedToken ? `${savedToken.substring(0, 20)}...` : 'none'
            });

            return newAccessToken;
          } catch (error) {
            console.error('[ERROR] refreshAccessToken failed:', error);
            tokenManager.removeToken(tokenType);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw error;
          } finally {
            // refresh 완료 후 Promise 캐시 초기화
            refreshPromises[tokenType] = null;
          }
        })();

        try {
          const newAccessToken = await refreshPromises[tokenType];

          console.log('[DEBUG] Retrying request with new token:', {
            endpoint,
            newTokenPreview: `${newAccessToken.substring(0, 20)}...`
          });

          // 재시도 플래그 설정
          isRetryingAfterRefresh[tokenType] = true;

          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 3000);

          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
            signal: retryController.signal,
          };

          const retryResponse = await fetch(url, retryConfig);
          clearTimeout(retryTimeoutId);

          console.log('[DEBUG] Retry response:', {
            endpoint,
            status: retryResponse.status
          });

          // 재시도 성공하면 플래그 해제
          isRetryingAfterRefresh[tokenType] = false;

          if (!retryResponse.ok) {
            throw new Error(`API Error: ${retryResponse.status}`);
          }

          return retryResponse.json();
        } catch (error) {
          isRetryingAfterRefresh[tokenType] = false;
          throw error;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(
          errorData.error || `API Error: ${response.status}`,
          response.status,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: API call took longer than 3 seconds');
      }
      throw error;
    }
  },

  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

interface RefreshTokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  message?: string;
}

export const refreshAccessToken = async (tokenType: 'user' | 'company' = 'user'): Promise<string> => {
  try {
    // tokenType에 따라 다른 엔드포인트 사용
    const endpoint = tokenType === 'company'
      ? '/api/auth/company/refresh'
      : '/api/auth/refresh';

    // skipAuth: true로 무한 루프 방지, credentials: 'include'로 refresh token 쿠키 전송
    const data = await apiClient.post<RefreshTokenResponse>(endpoint, undefined, {
      skipAuth: true,
      credentials: 'include'
    });
    const accessToken = data.accessToken || data.access_token || data.token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    return accessToken;
  } catch (error) {
    if (error instanceof ApiError && error.data?.error === 'Refresh token not found') {
      tokenManager.removeToken(tokenType);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw error;
  }
};