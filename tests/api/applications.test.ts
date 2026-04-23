import { describe, it, expect } from 'vitest';
import { apiClient, type ApiError } from '../utils/api-client';

describe('Applications API (미구현 — 구현 시 이 테스트들이 변경되어야 함)', () => {
  it('POST /api/applications 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.post('/api/applications', { post_id: 1, resume_id: 1 });
      expect.unreachable('엔드포인트가 구현되어 실제 응답이 돌아왔다면, 이 테스트를 성공 케이스로 업데이트해야 합니다');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('GET /api/applications/me 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.get('/api/applications/me');
      expect.unreachable('구현 시 배열 응답으로 업데이트 필요');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('DELETE /api/applications/:id 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.delete('/api/applications/1');
      expect.unreachable('구현 시 204 No Content 로 업데이트 필요');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });
});
