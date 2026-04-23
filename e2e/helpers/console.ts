import type { Page, ConsoleMessage } from '@playwright/test';

export type ConsoleError = { type: string; text: string; url: string };

// 페이지 수명동안 console.error + pageerror 를 수집. assert 는 호출측에서.
export function collectConsoleErrors(page: Page): ConsoleError[] {
  const errors: ConsoleError[] = [];
  const onMsg = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push({
        type: 'console',
        text: msg.text(),
        url: msg.location().url,
      });
    }
  };
  const onPageErr = (err: Error) => {
    errors.push({ type: 'pageerror', text: err.message, url: page.url() });
  };
  page.on('console', onMsg);
  page.on('pageerror', onPageErr);
  return errors;
}

// Next.js / 광고 / 브라우저 확장의 노이즈 제거 — 프로젝트 콘텐츠 에러만 남김
export function filterAppErrors(errors: ConsoleError[]): ConsoleError[] {
  const IGNORED_PATTERNS = [
    /Failed to load resource.*favicon/i,
    /ERR_BLOCKED_BY_CLIENT/i,                                  // 광고 차단기
    /Download the React DevTools/i,
    /ReactDOM.hydrate is no longer supported/i,
    /\/api\/auth\/refresh.*(401|Unauthorized)/i,               // 익명 세션 refresh 401 (정상)
    /\/api\/me.*(401|Unauthorized)/i,                          // 익명 세션 /me 401 (정상)
    /Failed to load resource.*status of 401/i,                 // 일반 401 HTTP 에러 (익명 예상)
  ];
  return errors.filter(e => !IGNORED_PATTERNS.some(p => p.test(e.text)));
}
