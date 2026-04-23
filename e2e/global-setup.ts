import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const email = process.env.E2E_COMPANY_EMAIL ?? 'test@test.com';
  const password = process.env.E2E_COMPANY_PASSWORD;
  const baseURL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';
  const authDir = path.resolve(__dirname, '.auth');
  const statePath = path.join(authDir, 'company.json');

  fs.mkdirSync(authDir, { recursive: true });

  if (!password) {
    console.warn('[global-setup] E2E_COMPANY_PASSWORD 미설정 → company 프로젝트가 skip 됩니다. company 스펙은 company.json 없음으로 실행되지 않습니다.');
    // Write empty storageState so Playwright doesn't error when loading the project,
    // but company tests will fail on first auth-required action (expected when running without creds).
    // The controller's Task 11 note: actual skip is managed by E2E_COMPANY_PASSWORD absence at run time.
    if (!fs.existsSync(statePath)) {
      fs.writeFileSync(statePath, JSON.stringify({ cookies: [], origins: [] }), 'utf8');
    }
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    await page.goto('/company-login', { waitUntil: 'domcontentloaded' });
    // Same selector pattern as auth-entry spec (handles label-vs-placeholder ambiguity)
    const emailInput = page.getByRole('textbox', { name: /이메일/i }).first();
    const passwordInput = page.getByLabel(/비밀번호/i).first();
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await page.getByRole('button', { name: /로그인/i }).first().click();
    await page.waitForURL(/\/company(\/|$|\?)/, { timeout: 15_000 });
    await context.storageState({ path: statePath });
    console.log(`[global-setup] company storageState 저장됨: ${statePath}`);
  } catch (err) {
    console.error('[global-setup] 기업 로그인 실패:', err);
    // Write empty storageState so Playwright config doesn't error; downstream tests will fail clearly.
    if (!fs.existsSync(statePath)) {
      fs.writeFileSync(statePath, JSON.stringify({ cookies: [], origins: [] }), 'utf8');
    }
  } finally {
    await browser.close();
  }
}
