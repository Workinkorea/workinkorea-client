import { test, expect } from '../fixtures/base';

test.describe('i18n language toggle', () => {
  test('초기 진입 시 <html lang="ko">', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });

  test.fixme('P2: EN 토글 클릭 시 <html lang="en"> 으로 바뀐다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^EN$/ }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test.fixme('P2: EN 토글 후 <title> 이 영어로 바뀐다', async ({ page }) => {
    await page.goto('/');
    const koTitle = await page.title();
    await page.getByRole('button', { name: /^EN$/ }).click();
    await page.reload();
    const enTitle = await page.title();
    expect(enTitle).not.toBe(koTitle);
    expect(enTitle.toLowerCase()).toMatch(/[a-z]/);
  });
});
