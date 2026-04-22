/**
 * Next.js 16 App Router 최적화 Fetch Client
 *
 * 주요 특징:
 * 1. HttpOnly Cookie 자동 전송 (credentials: 'same-origin')
 * 2. Next.js 캐싱 통합 (revalidate, cache, tags)
 * 3. 401 에러 시 자동 Token Refresh
 * 4. Server/Client Components 모두 지원
 */

import { tokenStore, decodeUserType } from '@/shared/api/tokenStore';

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

  // 클라이언트 환경에서 in-memory access_token 주입
  const token = !isServer ? tokenStore.get() : null;
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const config: RequestInit = {
    credentials: 'same-origin', // 기본값: 동일 origin 쿠키 자동 전송 (ISSUE-107)
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...fetchOptions.headers,
    },
    // Next.js 캐싱 옵션 (Server Components에서만 유효)
    ...(next && { next }),
  };

  try {
    const response = await fetch(`${baseURL}${endpoint}`, config);

    // 401 Unauthorized - Token Refresh 시도
    if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
      const refreshed = await refreshToken(isServer);

      if (refreshed) {
        // Retry original request with updated token
        const newToken = !isServer ? tokenStore.get() : null;
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers as Record<string, string>,
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          },
        };
        const retryResponse = await fetch(`${baseURL}${endpoint}`, retryConfig);

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
      const errorBody = await response.text().catch(() => '');

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
        errorData.error || errorData.message || errorData.detail || response.statusText,
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
    throw new FetchError('Network request failed', 0, error);
  }
}

/**
 * Token Refresh (HttpOnly Cookie 기반)
 * - 백엔드가 자동으로 새로운 Cookie를 Set-Cookie 헤더로 전송
 * - 브라우저가 자동으로 새 쿠키를 저장
 *
 * Single-flight: 동시에 여러 요청이 401을 받아도 refresh는 한 번만 실행됨
 * Retry limit: 연속 3회 실패 시 더 이상 refresh 시도하지 않고 즉시 false 반환
 */
const MAX_CONSECUTIVE_REFRESH_FAILURES = 3;
const REFRESH_BACKOFF_MS = [0, 300, 900, 2700] as const;

let refreshPromise: Promise<boolean> | null = null;
let consecutiveRefreshFailures = 0;

async function refreshToken(isServer: boolean): Promise<boolean> {
  // 이미 진행 중인 refresh가 있으면 그 Promise를 공유 (single-flight)
  if (refreshPromise) {
    return refreshPromise;
  }

  // 연속 실패 한도 도달 → 즉시 실패 반환 (루프 차단)
  if (consecutiveRefreshFailures >= MAX_CONSECUTIVE_REFRESH_FAILURES) {
    return false;
  }

  refreshPromise = (async () => {
    try {
      const backoff = REFRESH_BACKOFF_MS[consecutiveRefreshFailures] ?? 2700;
      if (backoff > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }

      const baseURL = isServer ? SERVER_API_URL : API_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'same-origin', // refreshToken 쿠키 자동 전송 (ISSUE-107)
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (!isServer && data.access_token) {
          tokenStore.set(data.access_token);
        }
        consecutiveRefreshFailures = 0;
        return true;
      }

      consecutiveRefreshFailures++;
      return false;
    } catch {
      consecutiveRefreshFailures++;
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * refresh 상태 초기화 (테스트 전용)
 */
export function __resetRefreshState(): void {
  refreshPromise = null;
  consecutiveRefreshFailures = 0;
}

/**
 * 인증 실패 시 로그아웃 처리
 * - Client-side only
 * - userType 쿠키를 삭제해야 미들웨어 리다이렉트 루프 방지
 */
function handleAuthFailure(): void {
  if (typeof window === 'undefined') return;

  const userType = getUserTypeFromCookie();

  // userType 쿠키 삭제 (미들웨어가 보호 라우트 → 로그인 리다이렉트 루프 방지)
  document.cookie = 'userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
  const hostname = window.location.hostname;
  if (hostname.includes('workinkorea.net')) {
    document.cookie = 'userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.workinkorea.net; SameSite=Lax';
  } else if (hostname.includes('moon-core.com')) {
    document.cookie = 'userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.moon-core.com; SameSite=Lax';
  }

  const loginPath =
    userType === 'company' ? '/company-login' :
      userType === 'admin' ? '/admin/login' :
        '/login';

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

  const value = userTypeCookie.trim().split('=')[1]?.trim();
  if (value === 'user' || value === 'company' || value === 'admin') return value;
  return null;
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
