import { test, expect } from '../fixtures/base';

test.describe('Auth entry pages', () => {
  test('/login-select 에 개인/기업 카드가 있다', async ({ page }) => {
    await page.goto('/login-select');
    await expect(page.getByRole('link', { name: /개인/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /기업/ }).first()).toBeVisible();
  });

  test('/login 에 "Google로 시작하기" 버튼이 있다', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
  });

  test('/company-login 에 이메일/비밀번호 필드가 있다', async ({ page }) => {
    await page.goto('/company-login');
    await expect(page.getByRole('textbox', { name: /이메일/i }).first()).toBeVisible();
    await expect(page.getByLabel(/비밀번호/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인/i }).first()).toBeVisible();
  });

  test.fixme('P3: /company-login main 내부에 회원가입/개인 로그인 링크가 있다', async ({ page }) => {
    await page.goto('/company-login');
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: /회원가입/ })).toBeVisible();
    await expect(main.getByRole('link', { name: /개인 로그인/ })).toBeVisible();
  });

  test('/signup-select 에 개인/기업 가입 카드가 있다', async ({ page }) => {
    await page.goto('/signup-select');
    await expect(page.getByRole('link', { name: /개인/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /기업/ }).first()).toBeVisible();
  });

  test('/company-signup/step1 에 약관 체크박스가 여러 개 있다', async ({ page }) => {
    await page.goto('/company-signup/step1');
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
