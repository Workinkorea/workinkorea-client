import { test, expect } from '../fixtures/base';

test.describe('Google OAuth redirect', () => {
  test('/login 의 "Google로 시작하기" 클릭 시 accounts.google.com 로 올바른 파라미터로 이동한다', async ({ page }) => {
    let capturedUrl: string | null = null;

    // Register BEFORE click so we catch the very first request to accounts.google.com.
    // The OAuth consent URL has path `/o/oauth2/` and the query params we want to verify.
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('accounts.google.com') && url.includes('client_id') && !capturedUrl) {
        capturedUrl = url;
      }
    });

    await page.goto('/login');
    const button = page
      .getByRole('button', { name: /Google/i })
      .or(page.getByRole('link', { name: /Google/i }))
      .first();
    await button.click();

    // Wait for the OAuth request to happen. Use waitForRequest as a secondary guard,
    // in case the event listener missed it (it shouldn't, but belt-and-braces).
    try {
      const req = await page.waitForRequest(
        (r) => {
          const u = r.url();
          return u.includes('accounts.google.com') && u.includes('client_id');
        },
        { timeout: 10_000 },
      );
      if (!capturedUrl) capturedUrl = req.url();
    } catch {
      // fall through — assertion below will report NULL
    }

    expect(capturedUrl, 'accounts.google.com URL 이 캡처되어야 한다').not.toBeNull();
    const u = new URL(capturedUrl!);
    expect(u.hostname).toBe('accounts.google.com');
    expect(u.searchParams.get('client_id'), 'client_id').toBeTruthy();
    const redirectUri = u.searchParams.get('redirect_uri');
    expect(redirectUri, 'redirect_uri').toContain('workinkorea');
    const scope = u.searchParams.get('scope') ?? '';
    expect(scope, 'scope 에 email 과 profile 포함').toMatch(/email/);
    expect(scope).toMatch(/profile/);
  });
});
