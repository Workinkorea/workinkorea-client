import { setupServer } from 'msw/node';

// 기본 핸들러 없음 — 각 테스트가 server.use(...) 로 주입
export const server = setupServer();
