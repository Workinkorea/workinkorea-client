import { test, expect } from '../fixtures/base';
import { SAMPLE_USER_RESUME_ID } from '../fixtures/test-data';

test.describe('User resume (requires storageState)', () => {
  test('/user/resume 에 등록된 이력서 카드가 있다', async ({ page }) => {
    await page.goto('/user/resume');
    await expect(page.locator('main').first()).toContainText(/이력서|Resume/i);
  });

  test(`/user/resume/edit/${SAMPLE_USER_RESUME_ID} 에 title pre-fill 이 있다 (P1 감시)`, async ({ page }) => {
    await page.goto(`/user/resume/edit/${SAMPLE_USER_RESUME_ID}`);
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toHaveValue(/.+/, { timeout: 15_000 });
  });
});
