import { test as base } from '@playwright/test';
import { collectConsoleErrors, filterAppErrors, type ConsoleError } from '../helpers/console';

type Fixtures = {
  consoleErrors: ConsoleError[];
};

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors = collectConsoleErrors(page);
    await use(errors);
    // 각 테스트 종료 시점에 app-level 에러가 있으면 artifact 로 남기기만 함.
    // strict assertion 은 스펙에서 필요 시 명시적으로 수행.
    const filtered = filterAppErrors(errors);
    if (filtered.length > 0) {
      console.warn(`[consoleErrors] ${filtered.length} app error(s):`, filtered);
    }
  },
});

export { expect } from '@playwright/test';
