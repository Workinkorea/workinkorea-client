import { test, expect } from '../fixtures/base';

test.describe('User profile (requires storageState)', () => {
  test('/user/profile 에 프로필 카드가 렌더된다', async ({ page }) => {
    await page.goto('/user/profile');
    await expect(page.locator('main').first()).toContainText(/프로필|Profile/i);
  });

  test('P2: /user/settings 는 /user/profile/edit 로 리다이렉트된다', async ({ page }) => {
    await page.goto('/user/settings');
    await page.waitForURL(/\/user\/profile\/edit/, { timeout: 10_000 });
    expect(page.url()).toContain('/user/profile/edit');
  });
});
