import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export type A11yOptions = {
  rules?: string[];              // 특정 규칙만 검사
  disableRules?: string[];
  include?: string;              // CSS 셀렉터
};

export async function runA11y(page: Page, opts: A11yOptions = {}) {
  let builder = new AxeBuilder({ page });
  if (opts.rules) builder = builder.withRules(opts.rules);
  if (opts.disableRules) builder = builder.disableRules(opts.disableRules);
  if (opts.include) builder = builder.include(opts.include);
  return builder.analyze();
}
