import { describe, it, expect, beforeEach } from 'vitest';
import { apiClient } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import type { ApiError } from '../utils/api-client';

describe('User Flow (requires user auth)', () => {
  beforeEach(() => {
    clearAuth();
  });

  // No test account available - these tests document expected behavior
  // They will pass when a test user account is created

  it.skip('should get user profile after login', async () => {
    // TODO: Set up user auth token
    const profile = await apiClient.get<{
      name: string;
      birth_date: string;
      country_id: number;
    }>('/api/me');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('birth_date');
    expect(profile).toHaveProperty('country_id');
  });

  it.skip('should create and manage resumes', async () => {
    // TODO: Set up user auth token
    const resume = await apiClient.post<{ id: number }>('/api/posts/resume', {
      title: 'Test Resume',
      profile_url: '',
      language_skills: [],
      schools: [],
      career_history: [],
      introduction: [],
      licenses: [],
    });
    expect(resume).toHaveProperty('id');
  });

  it('should reject unauthenticated access to user endpoints', async () => {
    try {
      await apiClient.get('/api/me');
      expect.unreachable('Expected 401 error');
    } catch (error) {
      const apiError = error as ApiError;
      expect(apiError.status).toBe(401);
    }
  });

  it('should reject unauthenticated resume access', async () => {
    try {
      await apiClient.get('/api/posts/resume/list/me');
      expect.unreachable('Expected 401 error');
    } catch (error) {
      const apiError = error as ApiError;
      expect(apiError.status).toBe(401);
    }
  });
});
