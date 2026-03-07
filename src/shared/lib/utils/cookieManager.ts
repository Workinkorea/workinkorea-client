/**
 * Cookie Manager (HttpOnly Cookie 환경용)
 *
 * 역할:
 * - accessToken, refreshToken은 HttpOnly Cookie로 브라우저가 자동 관리
 * - userType만 Public Cookie로 클라이언트에서 읽기 (UI 분기용)
 *
 * 마이그레이션 노트:
 * - 기존 tokenManager.ts의 localStorage 로직을 대체
 * - 민감한 토큰은 더 이상 클라이언트에서 접근 불가
 */

export type UserType = 'user' | 'company' | 'admin';

/**
 * Cookie에서 값을 읽는 유틸리티 함수
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const targetCookie = cookies.find(c => c.trim().startsWith(`${name}=`));

  if (!targetCookie) return null;

  return targetCookie.split('=')[1] || null;
}

/**
 * Cookie에 값을 설정하는 유틸리티 함수 (Public Cookie 전용)
 *
 * 주의: HttpOnly 쿠키는 서버에서만 설정 가능
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const domain = window.location.hostname.includes('byeong98.xyz') ? '.byeong98.xyz' : '';
  const domainAttr = domain ? `domain=${domain};` : '';

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;${domainAttr}SameSite=Lax`;
}

/**
 * Cookie 삭제 (Public Cookie 전용)
 */
function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;

  // setCookie와 동일한 domain 설정 (쿠키 삭제를 위해 domain이 일치해야 함)
  const domain = window.location.hostname.includes('byeong98.xyz') ? '.byeong98.xyz' : '';
  const domainAttr = domain ? `domain=${domain};` : '';

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;${domainAttr}`;
}

export const cookieManager = {
  /**
   * userType 읽기 (Public Cookie)
   *
   * @deprecated HttpOnly 쿠키 전환으로 인해 클라이언트에서 읽을 수 없음 (항상 null 반환)
   * 인증 상태 확인은 authApi.getProfile()을 사용하세요.
   *
   * @returns 'user' | 'company' | 'admin' | null
   *
   * @example
   * // Don't use this for auth check
   * // const userType = cookieManager.getUserType() // returns null
   */
  getUserType: (): UserType | null => {
    const value = getCookie('userType');
    if (!value) return null;

    // Validate userType
    if (value === 'user' || value === 'company' || value === 'admin') {
      return value;
    }

    console.warn('[cookieManager] Invalid userType cookie value:', value);
    return null;
  },

  /**
   * userType 설정 (Client-side only)
   *
   * 주의: 백엔드가 이미 Set-Cookie로 전송했다면 불필요함
   * 하지만 legacy 지원을 위해 유지
   */
  setUserType: (userType: UserType): void => {
    setCookie('userType', userType, 7); // 7일 유지
  },

  /**
   * userType 삭제
   */
  removeUserType: (): void => {
    deleteCookie('userType');
  },

  /**
   * 인증 상태 확인
   *
   * 주의: HttpOnly Cookie의 존재 여부는 클라이언트에서 직접 확인 불가
   * 대신 API 요청 시 401 에러로 판단
   */
  hasAuth: (): boolean => {
    // userType이 있다면 로그인 상태로 간주 (완벽하지 않음)
    // HttpOnly 쿠키 환경에서는 항상 false를 반환할 가능성이 높음
    // 정확한 인증 확인은 authApi.getProfile() 사용 권장
    return !!cookieManager.getUserType();
  },

  /**
   * 로그아웃 시 클라이언트 쿠키 정리 (폴백용)
   *
   * 정상 로그아웃 플로우:
   * 1. 백엔드 /api/auth/logout 호출
   * 2. 백엔드가 모든 쿠키 삭제: access_token, refresh_token, userType
   * 3. 클라이언트는 쿠키 삭제 불필요
   *
   * 이 함수는 백엔드 API 호출 실패 시 폴백으로만 사용
   */
  clearAuth: (): void => {
    cookieManager.removeUserType();
  },

  /**
   * 서버 사이드에서 Cookie 읽기 (Server Components용)
   *
   * @example
   * import { cookies } from 'next/headers'
   *
   * export default async function Page() {
   *   const cookieStore = await cookies()
   *   const userType = cookieStore.get('userType')?.value as UserType
   *
   *   return <div>User Type: {userType}</div>
   * }
   */
  // 서버 전용 유틸리티는 Server Components에서 직접 next/headers 사용
};

/**
 * 기존 tokenManager와의 호환성을 위한 Adapter
 *
 * @deprecated 점진적으로 cookieManager로 전환하세요
 */
export const tokenManagerCompat = {
  hasToken: () => cookieManager.hasAuth(),
  getUserType: () => cookieManager.getUserType(),
  removeToken: () => cookieManager.clearAuth(),

  // 더 이상 지원하지 않는 메서드들
  getToken: () => {
    console.warn('[tokenManagerCompat] getToken is deprecated - tokens are now HttpOnly');
    return null;
  },
  setToken: () => {
    console.error('[tokenManagerCompat] setToken is not supported - backend sets cookies');
  },
  isTokenValid: () => {
    console.warn('[tokenManagerCompat] isTokenValid is deprecated - use API 401 errors');
    return false;
  },
};
