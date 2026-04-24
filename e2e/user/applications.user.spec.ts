import { test, expect } from '../fixtures/base';

test.describe('User applications (P1 placeholder)', () => {
  test('/user/applications 는 "기능 준비 중" placeholder 를 표시한다', async ({ page }) => {
    await page.goto('/user/applications');
    await expect(page.getByText(/준비 중|Coming soon/i).first()).toBeVisible();
  });
});
