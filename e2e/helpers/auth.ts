import type { Page } from '@playwright/test';
import { TEST_COMPANY_EMAIL, TEST_COMPANY_PASSWORD } from '../fixtures/test-data';

export async function loginAsCompany(page: Page) {
  if (!TEST_COMPANY_PASSWORD) {
    throw new Error('E2E_COMPANY_PASSWORD 환경변수가 비어있습니다.');
  }
  await page.goto('/company-login');
  await page.getByLabel(/이메일/i).fill(TEST_COMPANY_EMAIL);
  await page.getByLabel(/비밀번호/i).fill(TEST_COMPANY_PASSWORD);
  await page.getByRole('button', { name: /로그인/i }).first().click();
  await page.waitForURL(/\/company(\/|$|\?)/, { timeout: 15_000 });
}
