import { test, expect } from '../fixtures/base';
import { SAMPLE_COMPANY_POST_ID } from '../fixtures/test-data';

test.describe('Company post edit pre-fill', () => {
  test(`/company/posts/edit/${SAMPLE_COMPANY_POST_ID} pre-fill 된 title / 근무시간 / 연봉이 있다`, async ({ page }) => {
    await page.goto(`/company/posts/edit/${SAMPLE_COMPANY_POST_ID}`);
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toHaveValue(/.+/, { timeout: 15_000 });

    const numbers = page.locator('input[type="number"]');
    const n = await numbers.count();
    expect(n).toBeGreaterThanOrEqual(1);

    await expect(page.getByRole('button', { name: /수정|Edit/ }).first()).toBeVisible();
  });
});
