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

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

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
      credentials: skipAuth ? 'omit' : 'include',
      signal: controller.signal,
      ...fetchOptions,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        // refresh 엔드포인트에서 401이 발생하면 무한 루프 방지를 위해 바로 에러 처리
        if (endpoint === '/api/auth/refresh') {
          const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
          throw new ApiError(
            errorData.error || 'Unauthorized',
            response.status,
            errorData
          );
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(async (newToken: string) => {
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
            });
          });
        }

        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          tokenManager.setAccessToken(newAccessToken);
          isRefreshing = false;
          onTokenRefreshed(newAccessToken);

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
          isRefreshing = false;
          refreshSubscribers = [];
          tokenManager.removeAccessToken();

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

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

interface RefreshTokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  message?: string;
}

export const refreshAccessToken = async (tokenType: 'user' | 'company' = 'user'): Promise<string> => {
  try {
    // skipAuth: true로 무한 루프 방지, credentials: 'include'로 refresh token 쿠키 전송
    const data = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh', undefined, {
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