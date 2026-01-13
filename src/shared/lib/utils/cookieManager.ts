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

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Cookie 삭제 (Public Cookie 전용)
 */
function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export const cookieManager = {
  /**
   * userType 읽기 (Public Cookie)
   *
   * @returns 'user' | 'company' | 'admin' | null
   *
   * @example
   * const userType = cookieManager.getUserType()
   * if (userType === 'company') {
   *   // 기업 전용 UI 표시
   * }
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
    return !!cookieManager.getUserType();
  },

  /**
   * 로그아웃 시 클라이언트 쿠키 정리
   *
   * 주의: HttpOnly 쿠키는 백엔드의 /logout 엔드포인트에서 삭제
   * 여기서는 Public Cookie만 정리
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
