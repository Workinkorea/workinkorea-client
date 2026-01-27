/**
 * Next.js 16 App Router 최적화 Fetch Client
 *
 * 주요 특징:
 * 1. HttpOnly Cookie 자동 전송 (credentials: 'include')
 * 2. Next.js 캐싱 통합 (revalidate, cache, tags)
 * 3. 401 에러 시 자동 Token Refresh
 * 4. Server/Client Components 모두 지원
 */

export const API_BASE_URL = "";

// 서버 전용 URL (SSR/SSG에서 사용)
export const SERVER_API_URL =
  process.env.API_URL || "http://workinkorea-server:8000";

export interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  next?: NextFetchRequestConfig;
}

export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Fetch API Wrapper with HttpOnly Cookie Support
 *
 * @example
 * // Client Component
 * const data = await fetchAPI<Job[]>('/api/jobs')
 *
 * @example
 * // Server Component with caching
 * const data = await fetchAPI<Job[]>('/api/jobs', {
 *   next: { revalidate: 3600, tags: ['jobs'] }
 * })
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { skipAuth, next, ...fetchOptions } = options || {};

  // 서버 vs 클라이언트 환경 감지
  const isServer = typeof window === 'undefined';
  const baseURL = isServer ? SERVER_API_URL : API_BASE_URL;

  const config: RequestInit = {
    ...fetchOptions,
    credentials: 'include', // HttpOnly Cookie 자동 전송
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    // Next.js 캐싱 옵션 (Server Components에서만 유효)
    ...(next && { next }),
  };

  try {
    // 디버깅: 요청 정보 로깅
    if (process.env.NODE_ENV === 'development' && !isServer) {
      console.log('[fetchAPI] Request:', {
        url: `${baseURL}${endpoint}`,
        method: config.method || 'GET',
        credentials: config.credentials,
        hasAuthCookie: document.cookie.includes('access_token'),
        cookies: document.cookie,
      });
    }

    const response = await fetch(`${baseURL}${endpoint}`, config);

    // 디버깅: 응답 정보 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('[fetchAPI] Response:', {
        url: `${baseURL}${endpoint}`,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    // 401 Unauthorized - Token Refresh 시도
    if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
      const refreshed = await refreshToken(isServer);

      if (refreshed) {
        // Retry original request
        const retryResponse = await fetch(`${baseURL}${endpoint}`, config);

        if (!retryResponse.ok) {
          throw new FetchError('Retry failed after token refresh', retryResponse.status);
        }

        return retryResponse.json() as Promise<T>;
      }

      // Refresh 실패 시 로그아웃 처리
      if (!isServer) {
        handleAuthFailure();
      }
      throw new FetchError('Unauthorized - Token refresh failed', 401);
    }

    // 403 Forbidden - 권한 없음
    if (response.status === 403) {
      // 403 응답 본문 읽기
      const errorBody = await response.text().catch(() => '');

      if (process.env.NODE_ENV === 'development') {
        console.error('[fetchAPI] 403 Forbidden:', {
          endpoint,
          errorBody,
          contentType: response.headers.get('content-type'),
          cookies: !isServer ? document.cookie : 'server-side',
        });
      }

      // 403은 "권한 없음"이므로 자동 로그아웃하지 않음
      // 각 페이지에서 에러를 받아서 적절히 처리
      let errorData;
      try {
        errorData = JSON.parse(errorBody);
      } catch {
        errorData = { detail: errorBody || 'Forbidden' };
      }

      throw new FetchError(
        errorData.detail || errorData.message || 'Forbidden',
        403,
        errorData
      );
    }

    // 기타 HTTP 에러
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FetchError(
        errorData.message || response.statusText,
        response.status,
        errorData
      );
    }

    // 204 No Content 처리
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }

    // Network errors
    console.error('[fetchAPI] Network error:', error);
    throw new FetchError('Network request failed', 0, error);
  }
}

/**
 * Token Refresh (HttpOnly Cookie 기반)
 * - 백엔드가 자동으로 새로운 Cookie를 Set-Cookie 헤더로 전송
 * - 브라우저가 자동으로 새 쿠키를 저장
 */
async function refreshToken(isServer: boolean): Promise<boolean> {
  try {
    const baseURL = isServer ? SERVER_API_URL : API_BASE_URL;

    const response = await fetch(`${baseURL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // refreshToken 쿠키 자동 전송
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('[fetchAPI] Token refreshed successfully');
      return true;
    }

    console.error('[fetchAPI] Token refresh failed:', response.status);
    return false;
  } catch (error) {
    console.error('[fetchAPI] Token refresh error:', error);
    return false;
  }
}

/**
 * 인증 실패 시 로그아웃 처리
 * - Client-side only
 */
function handleAuthFailure(): void {
  if (typeof window === 'undefined') return;

  // userType 쿠키에서 사용자 타입 확인
  const userType = getUserTypeFromCookie();

  const loginPath =
    userType === 'company' ? '/company-login' :
      userType === 'admin' ? '/admin/login' :
        '/login';

  console.warn('[fetchAPI] Authentication failed. Redirecting to login...', {
    userType,
    loginPath,
  });

  // 쿠키 삭제는 백엔드의 /logout 엔드포인트에서 처리
  window.location.replace(loginPath);
}

/**
 * Cookie에서 userType 읽기 (Client-side only)
 */
function getUserTypeFromCookie(): 'user' | 'company' | 'admin' | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const userTypeCookie = cookies.find(c => c.trim().startsWith('userType='));

  if (!userTypeCookie) return null;

  const value = userTypeCookie.split('=')[1];
  return value as 'user' | 'company' | 'admin' | null;
}

/**
 * Custom Error Class for Fetch Errors
 */
export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Convenience methods (Optional)
 */
export const fetchClient = {
  get<T>(endpoint: string, options?: FetchOptions) {
    return fetchAPI<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions) {
    return fetchAPI<T>(endpoint, { ...options, method: 'DELETE' });
  },

  patch<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return fetchAPI<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
