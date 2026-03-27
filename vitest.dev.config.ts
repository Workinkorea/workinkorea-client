/**
 * Dev Server E2E Test Config
 * node 환경에서 https://dev.workinkorea.net/ 을 대상으로 실행합니다.
 *
 * 실행: npx vitest run --config vitest.dev.config.ts
 */
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/api/dev-server.test.ts'],
    testTimeout: 30000,
    // vitest.setup.ts 제외 (window 의존성)
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
