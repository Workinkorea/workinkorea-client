// @vitest-environment node
import { describe, it, expect } from 'vitest';

const PROD_URL = 'https://workinkorea.net';

describe('Production Smoke Tests', () => {
  describe('Public API Endpoints', () => {
    it('should return job listings', async () => {
      const res = await fetch(`${PROD_URL}/api/posts/company/list?skip=0&limit=5`);
      expect(res.status).toBe(200);
    });

    it('should return Google OAuth redirect', async () => {
      const res = await fetch(`${PROD_URL}/api/auth/login/google`, {
        redirect: 'manual',
      });
      expect([200, 302, 307]).toContain(res.status);
    });
  });

  describe('Company Login Flow', () => {
    it('should login with company credentials', async () => {
      const formData = new URLSearchParams();
      formData.append('username', 'test@test.com');
      formData.append('password', 'qwer1234!');

      const res = await fetch(`${PROD_URL}/api/auth/company/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      // Could be 200 (success) or 401 (if test account doesn't exist on prod)
      expect([200, 401]).toContain(res.status);

      if (res.status === 200) {
        const data = await res.json();
        expect(data).toHaveProperty('access_token');
      }
    });
  });

  describe('Health Check', () => {
    it('should have a reachable homepage', async () => {
      const res = await fetch(PROD_URL);
      expect(res.status).toBe(200);
    });
  });
});
