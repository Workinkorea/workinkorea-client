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

const isRefreshing = {
  user: false,
  company: false,
};

type RefreshSubscriber = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const refreshSubscribers: {
  user: RefreshSubscriber[],
  company: RefreshSubscriber[],
} = {
  user: [],
  company: [],
};

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { skipAuth, tokenType = 'user', ...fetchOptions } = options;

    const accessToken = tokenManager.getToken(tokenType);

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
        if (isRefreshEndpoint) {
          const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
          // refresh 실패 시 토큰 제거 및 로그인 페이지로 리다이렉트
          tokenManager.removeToken(tokenType);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiError(
            errorData.error || 'Unauthorized',
            response.status,
            errorData
          );
        }

        if (isRefreshing[tokenType]) {
          return new Promise<T>((resolve, reject) => {
            subscribeTokenRefresh(tokenType, {
              resolve: async (newToken: string) => {
                try {
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

                  if (!retryResponse.ok) {
                    throw new Error(`API Error: ${retryResponse.status}`);
                  }

                  const data = await retryResponse.json();
                  resolve(data);
                } catch (error) {
                  reject(error);
                }
              },
              reject,
            });
          });
        }

        isRefreshing[tokenType] = true;

        try {
          const newAccessToken = await refreshAccessToken(tokenType);
          // 원래 토큰이 localStorage에 있었는지 확인하여 같은 곳에 저장
          const rememberMe = tokenManager.isTokenInLocalStorage(tokenType);
          tokenManager.setToken(newAccessToken, tokenType, rememberMe);
          isRefreshing[tokenType] = false;
          onTokenRefreshed(tokenType, newAccessToken);

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

          if (!retryResponse.ok) {
            throw new Error(`API Error: ${retryResponse.status}`);
          }

          return retryResponse.json();
        } catch (error) {
          isRefreshing[tokenType] = false;
          onTokenRefreshFailed(tokenType, error);
          refreshSubscribers[tokenType] = [];
          tokenManager.removeToken(tokenType);

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

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

const subscribeTokenRefresh = (tokenType: 'user' | 'company', subscriber: RefreshSubscriber) => {
  refreshSubscribers[tokenType].push(subscriber);
};

const onTokenRefreshed = (tokenType: 'user' | 'company', token: string) => {
  refreshSubscribers[tokenType].forEach((subscriber) => subscriber.resolve(token));
  refreshSubscribers[tokenType] = [];
};

const onTokenRefreshFailed = (tokenType: 'user' | 'company', error: unknown) => {
  refreshSubscribers[tokenType].forEach((subscriber) => subscriber.reject(error));
  refreshSubscribers[tokenType] = [];
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