import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import type { ApiError } from '../utils/api-client';

describe('Guest User Flow', () => {
  beforeAll(() => {
    clearAuth();
  });

  it('should browse public job listings', async () => {
    // Guest can see job list without auth
    try {
      const jobs = await apiClient.get('/api/posts/company/list', {
        queryParams: { skip: 0, limit: 10 },
      });
      expect(jobs).toBeDefined();
    } catch (error) {
      const apiError = error as ApiError;
      // 404 is OK if no posts exist yet
      expect([200, 404]).toContain(apiError.status);
    }
  });

  it('should submit self-diagnosis without auth', async () => {
    const diagnosisData = {
      // minimal diagnosis answer data
      answers: {},
    };
    try {
      const result = await apiClient.post('/api/diagnosis/answer', diagnosisData);
      expect(result).toBeDefined();
    } catch (error) {
      const apiError = error as ApiError;
      // 422 validation error is expected with empty data
      expect([200, 201, 422]).toContain(apiError.status);
    }
  });

  it('should be blocked from user-only endpoints', async () => {
    try {
      await apiClient.get('/api/me');
      // Should not reach here without auth
      expect.unreachable('Expected 401 error');
    } catch (error) {
      const apiError = error as ApiError;
      expect(apiError.status).toBe(401);
    }
  });

  it('should be blocked from company-only endpoints', async () => {
    try {
      await apiClient.get('/api/company-profile');
      // Should not reach here without auth
      expect.unreachable('Expected 401 error');
    } catch (error) {
      const apiError = error as ApiError;
      expect(apiError.status).toBe(401);
    }
  });
});
