/**
 * In-memory access token store
 *
 * access_token은 HttpOnly Cookie가 아닌 응답 body로 반환됨.
 * 메모리에만 저장 (XSS 방어, 페이지 새로고침 시 자동으로 refresh 엔드포인트로 재발급)
 */

let accessToken: string | null = null;

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },

  set(token: string): void {
    accessToken = token;
  },

  clear(): void {
    accessToken = null;
  },
};

/**
 * JWT payload에서 userType 추출
 * - type === 'access' → 'user'
 * - type === 'access_company' → 'company'
 */
export function decodeUserType(token: string): 'user' | 'company' | 'admin' | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.type === 'access_company') return 'company';
    if (payload.type === 'admin_access') return 'admin';
    if (payload.type === 'access') return 'user';
    return null;
  } catch {
    return null;
  }
}
