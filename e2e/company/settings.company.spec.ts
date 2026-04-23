import { test, expect } from '../fixtures/base';

test.describe('Company settings', () => {
  test('/company/settings 에 "기업 프로필 편집" 활성 링크가 있다', async ({ page }) => {
    await page.goto('/company/settings');
    await expect(page.getByRole('link', { name: /기업 프로필 편집|프로필 편집/ })).toBeVisible();
  });

  test('비밀번호/알림/결제는 "예정" 안내가 있다', async ({ page }) => {
    await page.goto('/company/settings');
    await expect(page.getByText(/예정|Coming/i).first()).toBeVisible();
  });
});
