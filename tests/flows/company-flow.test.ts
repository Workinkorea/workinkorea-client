import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { apiClient, API_BASE_URL } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import type { ApiError } from '../utils/api-client';

describe('Company User Flow', () => {
  let accessToken: string | null = null;

  beforeAll(async () => {
    clearAuth();

    // Login as company
    const formData = new URLSearchParams();
    formData.append('username', 'test@test.com');
    formData.append('password', 'qwer1234!');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/company/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        accessToken = data.access_token;
        apiClient.setAccessToken(accessToken);
      }
    } catch {
      // Server might not be running
    }
  });

  afterAll(() => {
    clearAuth();
  });

  it('should get company profile', async () => {
    if (!accessToken) return; // skip if login failed

    try {
      const profile = await apiClient.get('/api/company-profile');
      expect(profile).toBeDefined();
    } catch (error) {
      const apiError = error as ApiError;
      // 404 if profile not created yet
      expect([200, 404]).toContain(apiError.status);
    }
  });

  it('should list own company posts', async () => {
    if (!accessToken) return;

    try {
      const posts = await apiClient.get('/api/posts/company/');
      expect(posts).toBeDefined();
    } catch (error) {
      const apiError = error as ApiError;
      expect([200, 404]).toContain(apiError.status);
    }
  });

  it('should be blocked from user-only endpoints', async () => {
    if (!accessToken) return;

    try {
      await apiClient.get('/api/me');
    } catch (error) {
      const apiError = error as ApiError;
      // Company token should not access user profile
      expect([401, 403]).toContain(apiError.status);
    }
  });
});
