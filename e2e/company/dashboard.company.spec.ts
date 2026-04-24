import { test, expect } from '../fixtures/base';

test.describe('Company dashboard', () => {
  test('/company 에 진행 공고 / 전체 공고 KPI 가 렌더된다', async ({ page }) => {
    await page.goto('/company');
    await expect(page.getByText(/진행 공고/)).toBeVisible();
    await expect(page.getByText(/전체 공고/)).toBeVisible();
  });

  test('"새 채용 공고 등록" CTA 가 보이고 /company/posts/create 로 이동한다', async ({ page }) => {
    await page.goto('/company');
    const cta = page.getByRole('link', { name: /새 채용 공고 등록|공고 등록/ }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await page.waitForURL(/\/company\/posts\/create/);
  });
});
