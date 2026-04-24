import { test, expect } from '../fixtures/base';
import { PROTECTED_USER_ROUTES, PROTECTED_COMPANY_ROUTES } from '../fixtures/test-data';

test.describe('Protected route guards', () => {
  test.describe('user routes', () => {
    for (const route of PROTECTED_USER_ROUTES) {
      test(`${route} 비로그인 접근 시 /login-select 로 리다이렉트`, async ({ page }) => {
        await page.goto(route);
        await page.waitForURL(/\/login-select/, { timeout: 10_000 });
        expect(page.url()).toContain('/login-select');
        const u = new URL(page.url());
        expect(u.searchParams.get('callbackUrl'), `callbackUrl for ${route}`).toBeTruthy();
      });
    }
  });

  test.describe('company routes', () => {
    for (const route of PROTECTED_COMPANY_ROUTES) {
      test(`${route} 비로그인 접근 시 /login-select 또는 /company-login 으로 리다이렉트`, async ({ page }) => {
        await page.goto(route);
        await page.waitForURL(/\/(login-select|company-login)/, { timeout: 10_000 });
        expect(page.url()).toMatch(/\/(login-select|company-login)/);
      });
    }
  });

  test('P1: 만료된 userTypeClient=company 쿠키가 있어도 /signup-select 진입이 허용된다', async ({ context, page }) => {
    const url = new URL(process.env.E2E_BASE_URL ?? 'https://workinkorea.net');
    await context.addCookies([{
      name: 'userTypeClient',
      value: 'company',
      domain: url.hostname,
      path: '/',
      httpOnly: false,
      secure: url.protocol === 'https:',
      sameSite: 'Lax',
    }]);

    await page.goto('/signup-select');
    expect(page.url()).toContain('/signup-select');
    await expect(page.getByRole('heading', { name: /회원가입|가입/ }).first()).toBeVisible();
  });
});
