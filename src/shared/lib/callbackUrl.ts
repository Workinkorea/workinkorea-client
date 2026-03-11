/**
 * OAuth 콜백 후 원래 페이지로 돌아가기 위한 callbackUrl 유틸리티
 *
 * Google OAuth는 외부 도메인을 거치므로 sessionStorage를 사용해
 * callbackUrl을 보존합니다. (같은 탭 내 세션이므로 sessionStorage 유지)
 */
const STORAGE_KEY = 'auth_callback_url';

/**
 * callbackUrl을 sessionStorage에 저장합니다.
 */
export function saveCallbackUrl(url: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, url);
}

/**
 * 저장된 callbackUrl을 읽고 즉시 삭제합니다. (일회성 소비)
 * 저장된 값이 없으면 null을 반환합니다.
 */
export function consumeCallbackUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const url = sessionStorage.getItem(STORAGE_KEY);
  if (url) sessionStorage.removeItem(STORAGE_KEY);
  return url;
}
