import { test, expect } from '../fixtures/base';
import { runA11y } from '../helpers/a11y';

test.describe('Company profile edit', () => {
  test('/company/profile/edit pre-fill 된 이메일/전화번호 필드가 있다', async ({ page }) => {
    await page.goto('/company/profile/edit');
    const email = page.locator('input[type="email"], input[name*="email"]').first();
    const phone = page.locator('input[name*="phone"], input[type="tel"]').first();
    await expect(email).toHaveValue(/.+@.+/, { timeout: 15_000 });
    await expect(phone).toHaveValue(/\d/);
  });

  test('"저장하기" 버튼이 존재한다', async ({ page }) => {
    await page.goto('/company/profile/edit');
    await expect(page.getByRole('button', { name: /저장/ }).first()).toBeVisible();
  });

  test.fixme('P2: 모든 input 에 연결된 <label> 이 있다 (axe label rule)', async ({ page }) => {
    await page.goto('/company/profile/edit');
    const results = await runA11y(page, { rules: ['label'] });
    expect(results.violations.filter(v => v.id === 'label')).toEqual([]);
  });
});
