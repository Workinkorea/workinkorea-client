// Root-level re-export so `playwright test` (without -c) finds the real config.
// The real config lives at e2e/playwright.config.ts.
export { default } from './e2e/playwright.config';
