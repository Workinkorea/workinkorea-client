import { test, expect } from '../fixtures/base';

test.describe('Company jobs list', () => {
  test('/company/jobs 에 "채용 공고 관리" 헤딩과 "전체 공고 (N개)" 카운트가 있다', async ({ page }) => {
    await page.goto('/company/jobs');
    await expect(page.getByRole('heading', { name: /채용 공고 관리|공고 관리/ })).toBeVisible();
    await expect(page.getByText(/전체 공고.*\(\d+개\)/)).toBeVisible();
  });

  test('"등록" 링크/버튼이 /company/posts/create 로 연결된다', async ({ page }) => {
    await page.goto('/company/jobs');
    const link = page.getByRole('link', { name: /등록/ }).first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('/company/posts/create');
  });
});
