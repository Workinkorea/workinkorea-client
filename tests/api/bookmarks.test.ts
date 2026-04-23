import { describe, it, expect } from 'vitest';
import { apiClient, type ApiError } from '../utils/api-client';

describe('Bookmarks API (미구현 — 구현 시 업데이트 필요)', () => {
  it('POST /api/bookmarks 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.post('/api/bookmarks', { post_id: 1 });
      expect.unreachable('엔드포인트 구현 시 이 테스트를 성공 케이스로 전환');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('DELETE /api/bookmarks/:id 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.delete('/api/bookmarks/1');
      expect.unreachable('구현 시 204 No Content');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });
});
