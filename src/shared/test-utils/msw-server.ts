import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll } from 'vitest';

/**
 * Shared MSW server for component/integration tests.
 *
 * Usage: each test file that needs MSW should call `useMswServer()` at the
 * top level of its describe block (or module scope). This opts the file in
 * to global.fetch replacement, which conflicts with tests that manually
 * mock `global.fetch` — so MSW is NOT started automatically for every test.
 */
export const server = setupServer();

export function useMswServer() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
