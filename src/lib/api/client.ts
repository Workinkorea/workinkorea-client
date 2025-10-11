import { tokenManager } from '../utils/tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const refreshAccessToken = async (): Promise<string> => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  const accessToken = data.accessToken || data.access_token || data.token;

  if (!accessToken) {
    throw new Error('No access token received');
  }

  return accessToken;
};

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // 요청 전에 토큰이 곧 만료될지 확인하고 사전에 갱신
    if (tokenManager.isTokenExpiringSoon()) {
      console.log('Token expiring soon, refreshing proactively...');
      try {
        const newAccessToken = await refreshAccessToken();
        tokenManager.setAccessToken(newAccessToken);
      } catch {
        console.log('Proactive refresh failed, will retry on 401');
        // 사전 갱신 실패해도 요청은 계속 진행 (401 백업 로직이 있음)
      }
    }

    const accessToken = tokenManager.getAccessToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: 'include',
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // 401 에러 처리 - 토큰 만료
      if (response.status === 401) {
        // 이미 토큰 갱신 중이면 대기
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

        // 토큰 갱신 시작
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          tokenManager.setAccessToken(newAccessToken);
          isRefreshing = false;
          onTokenRefreshed(newAccessToken);

          // 원래 요청 재시도
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

          // 로그인 페이지로 리다이렉트
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          throw error;
        }
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
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

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};