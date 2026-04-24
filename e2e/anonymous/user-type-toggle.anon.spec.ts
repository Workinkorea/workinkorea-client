import { test, expect } from '../fixtures/base';

test.describe('UserTypeToggle (header)', () => {
  test('헤더에 개인/기업 토글 버튼이 존재한다', async ({ page }) => {
    await page.goto('/');
    const personalBtn = page.getByRole('button', { name: /개인/ }).first();
    const companyBtn = page.getByRole('button', { name: /기업/ }).first();
    await expect(personalBtn).toBeVisible();
    await expect(companyBtn).toBeVisible();
  });

  test.fixme('P2: "기업" 클릭 시 userTypeClient 쿠키가 company 로 변경된다', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^기업$/ }).first().click();
    await page.waitForTimeout(500);
    const cookies = await context.cookies();
    const c = cookies.find(c => c.name === 'userTypeClient');
    expect(c?.value).toBe('company');
  });

  test.fixme('P2: "기업" 클릭 시 히어로 문구가 기업 메시지로 전환된다', async ({ page }) => {
    await page.goto('/');
    const beforeText = await page.locator('main').first().innerText();
    await page.getByRole('button', { name: /^기업$/ }).first().click();
    await page.waitForTimeout(500);
    const afterText = await page.locator('main').first().innerText();
    expect(afterText).not.toBe(beforeText);
  });
});
