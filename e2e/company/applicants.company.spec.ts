import { test, expect } from '../fixtures/base';

test.describe('Company applicants (P1 placeholder)', () => {
  test('/company/applicants 는 "기능 준비 중" placeholder 를 표시한다', async ({ page }) => {
    await page.goto('/company/applicants');
    await expect(page.getByText(/준비 중|Coming soon/i).first()).toBeVisible();
  });
});
