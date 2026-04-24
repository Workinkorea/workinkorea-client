import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const BASE_URL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';
const RUN_USER_E2E = process.env.RUN_USER_E2E === '1';
const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: __dirname,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 2 : undefined,
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: path.resolve(__dirname, 'global-setup.ts'),

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'anonymous',
      testDir: path.resolve(__dirname, 'anonymous'),
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'company',
      testDir: path.resolve(__dirname, 'company'),
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/company.json'),
      },
    },
    {
      name: 'user',
      testDir: path.resolve(__dirname, 'user'),
      testIgnore: RUN_USER_E2E ? [] : [/.*/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/user.json'),
      },
    },
  ],
});
