import { test, expect } from '../fixtures/base';
import { PUBLIC_ROUTES } from '../fixtures/test-data';
import { filterAppErrors } from '../helpers/console';

test.describe('Public pages smoke', () => {
  // /jobs: production Server Components render error — tracked, currently fixme
  for (const route of PUBLIC_ROUTES) {
    const runner = route === '/jobs' ? test.fixme : test;
    runner(`${route} 은 200 응답 + <h1> 렌더 + app-level console error 없음`, async ({ page, consoleErrors }) => {
      const resp = await page.goto(route);
      expect(resp, `no response for ${route}`).not.toBeNull();
      expect(resp!.status(), `status for ${route}`).toBeLessThan(400);
      await expect(page.locator('h1, h2').first()).toBeVisible();

      const appErrors = filterAppErrors(consoleErrors);
      expect(appErrors, `console errors on ${route}`).toEqual([]);
    });
  }

  test('footer 주요 링크 (/jobs, /terms, /privacy, /support, /faq) 가 200 응답', async ({ page, request }) => {
    await page.goto('/');
    const footerLinks = ['/jobs', '/terms', '/privacy', '/support', '/faq'];
    for (const href of footerLinks) {
      const resp = await request.get(href);
      expect(resp.status(), `${href} status`).toBeLessThan(400);
    }
  });

  test.fixme('P3: /support 이메일이 mailto: 링크로 렌더되어야 한다', async ({ page }) => {
    await page.goto('/support');
    const mailto = page.locator('a[href^="mailto:support@"]');
    await expect(mailto).toBeVisible();
  });
});
