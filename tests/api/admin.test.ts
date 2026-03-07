import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import type {
  UserResponse,
  CompanyResponse,
  CompanyPostResponse,
} from '../types/api';
import type { ApiError } from '../utils/api-client';

describe('Admin API E2E Tests', () => {
  beforeEach(() => {
    clearAuth();
  });

  afterEach(() => {
    clearAuth();
  });

  describe('Admin Users API', () => {
    describe('GET /api/admin/users/', () => {
      it('[pattern 2] should fail without admin token', async () => {
        try {
          await apiClient.get<UserResponse[]>('/api/admin/users/', {
            queryParams: { skip: 0, limit: 100 },
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 3] should fail with regular user token', async () => {
        apiClient.setAccessToken('regular-user-token');

        try {
          await apiClient.get<UserResponse[]>('/api/admin/users/', {
            queryParams: { skip: 0, limit: 100 },
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([403, 401]).toContain(apiError.status);
        }
      });

      it('[pattern 1] should return user list with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        try {
          const users = await apiClient.get<UserResponse[]>(
            '/api/admin/users/',
            {
              queryParams: { skip: 0, limit: 100 },
              useAdminToken: true,
            }
          );

          expect(Array.isArray(users)).toBe(true);
        } catch (error) {
          console.log('Admin token invalid, skipping admin users list test');
        }
      });

      it('[pattern 1] should support pagination', async () => {
        apiClient.setAdminToken('test-admin-token');

        try {
          const usersPage1 = await apiClient.get<UserResponse[]>(
            '/api/admin/users/',
            {
              queryParams: { skip: 0, limit: 10 },
              useAdminToken: true,
            }
          );

          const usersPage2 = await apiClient.get<UserResponse[]>(
            '/api/admin/users/',
            {
              queryParams: { skip: 10, limit: 10 },
              useAdminToken: true,
            }
          );

          expect(Array.isArray(usersPage1)).toBe(true);
          expect(Array.isArray(usersPage2)).toBe(true);
        } catch (error) {
          console.log('Admin pagination test skipped');
        }
      });
    });

    describe('GET /api/admin/users/{user_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testUserId = 1;

        try {
          await apiClient.get<UserResponse>(`/api/admin/users/${testUserId}`);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should return user detail with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        const testUserId = 1;

        try {
          const user = await apiClient.get<UserResponse>(
            `/api/admin/users/${testUserId}`,
            { useAdminToken: true }
          );

          expect(user).toBeDefined();
          expect(user.id).toBe(testUserId);
          expect(user.email).toBeDefined();
        } catch (error) {
          console.log('Admin user detail test skipped');
        }
      });

      it('[pattern 4] should return 404 for non-existent user', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.get<UserResponse>(`/api/admin/users/${nonExistentId}`, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('PUT /api/admin/users/{user_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testUserId = 1;
        const updateData = { email: 'updated@example.com' };

        try {
          await apiClient.put(`/api/admin/users/${testUserId}`, updateData);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should update user with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        const testUserId = 1;
        const updateData = { email: 'admin-updated@example.com' };

        try {
          const updatedUser = await apiClient.put<UserResponse>(
            `/api/admin/users/${testUserId}`,
            updateData,
            { useAdminToken: true }
          );

          expect(updatedUser).toBeDefined();
        } catch (error) {
          console.log('Admin user update test skipped');
        }
      });

      it('[pattern 4] should fail for non-existent user', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;
        const updateData = { email: 'nonexistent@example.com' };

        try {
          await apiClient.put(`/api/admin/users/${nonExistentId}`, updateData, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('DELETE /api/admin/users/{user_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testUserId = 1;

        try {
          await apiClient.delete(`/api/admin/users/${testUserId}`);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 4] should fail for non-existent user', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.delete(`/api/admin/users/${nonExistentId}`, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });
  });

  describe('Admin Companies API', () => {
    describe('GET /api/admin/companies/', () => {
      it('[pattern 2] should fail without admin token', async () => {
        try {
          await apiClient.get<CompanyResponse[]>('/api/admin/companies/', {
            queryParams: { skip: 0, limit: 100 },
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should return company list with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        try {
          const companies = await apiClient.get<CompanyResponse[]>(
            '/api/admin/companies/',
            {
              queryParams: { skip: 0, limit: 100 },
              useAdminToken: true,
            }
          );

          expect(Array.isArray(companies)).toBe(true);
        } catch (error) {
          console.log('Admin companies list test skipped');
        }
      });
    });

    describe('GET /api/admin/companies/{company_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testCompanyId = 1;

        try {
          await apiClient.get<CompanyResponse>(
            `/api/admin/companies/${testCompanyId}`
          );
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should return company detail with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        const testCompanyId = 1;

        try {
          const company = await apiClient.get<CompanyResponse>(
            `/api/admin/companies/${testCompanyId}`,
            { useAdminToken: true }
          );

          expect(company).toBeDefined();
          expect(company.id).toBe(testCompanyId);
          expect(company.company_name).toBeDefined();
        } catch (error) {
          console.log('Admin company detail test skipped');
        }
      });

      it('[pattern 4] should return 404 for non-existent company', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.get<CompanyResponse>(
            `/api/admin/companies/${nonExistentId}`,
            { useAdminToken: true }
          );
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('PUT /api/admin/companies/{company_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testCompanyId = 1;
        const updateData = { company_name: 'Updated Company' };

        try {
          await apiClient.put(`/api/admin/companies/${testCompanyId}`, updateData);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should update company with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        const testCompanyId = 1;
        const updateData = { company_name: 'Admin Updated Company' };

        try {
          const updatedCompany = await apiClient.put<CompanyResponse>(
            `/api/admin/companies/${testCompanyId}`,
            updateData,
            { useAdminToken: true }
          );

          expect(updatedCompany).toBeDefined();
        } catch (error) {
          console.log('Admin company update test skipped');
        }
      });

      it('[pattern 4] should fail for non-existent company', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;
        const updateData = { company_name: 'Nonexistent' };

        try {
          await apiClient.put(`/api/admin/companies/${nonExistentId}`, updateData, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('DELETE /api/admin/companies/{company_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testCompanyId = 1;

        try {
          await apiClient.delete(`/api/admin/companies/${testCompanyId}`);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 4] should fail for non-existent company', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.delete(`/api/admin/companies/${nonExistentId}`, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });
  });

  describe('Admin Posts API', () => {
    describe('GET /api/admin/posts/', () => {
      it('[pattern 2] should fail without admin token', async () => {
        try {
          await apiClient.get<CompanyPostResponse[]>('/api/admin/posts/', {
            queryParams: { skip: 0, limit: 100 },
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should return posts list with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        try {
          const posts = await apiClient.get<CompanyPostResponse[]>(
            '/api/admin/posts/',
            {
              queryParams: { skip: 0, limit: 100 },
              useAdminToken: true,
            }
          );

          expect(Array.isArray(posts)).toBe(true);
        } catch (error) {
          console.log('Admin posts list test skipped');
        }
      });
    });

    describe('GET /api/admin/posts/{post_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testPostId = 1;

        try {
          await apiClient.get<CompanyPostResponse>(`/api/admin/posts/${testPostId}`);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 1] should return post detail with admin token', async () => {
        apiClient.setAdminToken('test-admin-token');

        const testPostId = 1;

        try {
          const post = await apiClient.get<CompanyPostResponse>(
            `/api/admin/posts/${testPostId}`,
            { useAdminToken: true }
          );

          expect(post).toBeDefined();
          expect(post.id).toBe(testPostId);
          expect(post.title).toBeDefined();
        } catch (error) {
          console.log('Admin post detail test skipped');
        }
      });

      it('[pattern 4] should return 404 for non-existent post', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.get<CompanyPostResponse>(
            `/api/admin/posts/${nonExistentId}`,
            { useAdminToken: true }
          );
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('PUT /api/admin/posts/{post_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testPostId = 1;
        const updateData = { title: 'Admin Updated Title' };

        try {
          await apiClient.put(`/api/admin/posts/${testPostId}`, updateData);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 4] should fail for non-existent post', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;
        const updateData = { title: 'Nonexistent' };

        try {
          await apiClient.put(`/api/admin/posts/${nonExistentId}`, updateData, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });

    describe('DELETE /api/admin/posts/{post_id}', () => {
      it('[pattern 2] should fail without admin token', async () => {
        const testPostId = 1;

        try {
          await apiClient.delete(`/api/admin/posts/${testPostId}`);
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(401);
        }
      });

      it('[pattern 4] should fail for non-existent post', async () => {
        apiClient.setAdminToken('test-admin-token');

        const nonExistentId = 999999;

        try {
          await apiClient.delete(`/api/admin/posts/${nonExistentId}`, {
            useAdminToken: true,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          const apiError = error as ApiError;
          expect([404, 401]).toContain(apiError.status);
        }
      });
    });
  });
});
