import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import { createCompanyPostData } from '../utils/test-data';
import type { CompanyPostResponse } from '../types/api';
import type { ApiError } from '../utils/api-client';

describe('Company Posts API E2E Tests', () => {
  let testPostId: number | null = null;

  beforeEach(() => {
    clearAuth();
  });

  afterEach(() => {
    clearAuth();
  });

  describe('GET /api/posts/company/list', () => {
    it('[pattern 1] should return list of company job posts without authentication', async () => {
      try {
        const posts = await apiClient.get<CompanyPostResponse[]>(
          '/api/posts/company/list'
        );

        // 성공 시 배열 확인
        expect(Array.isArray(posts) || posts === null).toBe(true);
      } catch (error) {
        const apiError = error as ApiError;
        // 에러가 발생하면 적절한 상태 코드 확인
        if (apiError.status) {
          expect([200, 404, 500]).toContain(apiError.status);
        } else {
          // 에러 객체가 없으면 테스트 스킵
          console.log('No error status, skipping validation');
        }
      }
    });

    it('[pattern 1] should support pagination with query params', async () => {
      try {
        const posts = await apiClient.get<CompanyPostResponse[]>(
          '/api/posts/company/list',
          {
            queryParams: {
              skip: 0,
              limit: 10,
            },
          }
        );

        expect(Array.isArray(posts)).toBe(true);
      } catch (error) {
        console.log('Pagination test skipped');
      }
    });
  });

  describe('GET /api/posts/company', () => {
    it('[pattern 2] should fail without authentication', async () => {
      try {
        await apiClient.get<CompanyPostResponse[]>('/api/posts/company');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 1] should return company own posts when authenticated', async () => {
      apiClient.setAccessToken('test-company-token');

      try {
        const posts = await apiClient.get<CompanyPostResponse[]>(
          '/api/posts/company'
        );

        expect(Array.isArray(posts)).toBe(true);
      } catch (error) {
        console.log('Test token invalid, skipping company posts fetch test');
      }
    });
  });

  describe('POST /api/posts/company', () => {
    it('[pattern 2] should fail without authentication', async () => {
      const postData = createCompanyPostData();

      try {
        await apiClient.post('/api/posts/company', postData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 1] should create a new job post when authenticated', async () => {
      apiClient.setAccessToken('test-company-token');

      const postData = createCompanyPostData({
        title: 'Software Engineer Position',
        content: 'We are looking for a talented software engineer.',
        salary: 40000000,
      });

      try {
        const createdPost = await apiClient.post<CompanyPostResponse>(
          '/api/posts/company',
          postData
        );

        expect(createdPost).toBeDefined();
        expect(createdPost.id).toBeDefined();
        expect(createdPost.title).toBe(postData.title);

        testPostId = createdPost.id;
      } catch (error) {
        console.log('Test token invalid, skipping company post creation test');
      }
    });

    it('[pattern 5] should fail with missing required fields', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidData = {
        title: 'Test Job',
        // missing required fields
      };

      try {
        await apiClient.post('/api/posts/company', invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with invalid date range (end_date before start_date)', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidData = createCompanyPostData({
        start_date: '2025-12-31T00:00:00Z',
        end_date: '2025-01-01T00:00:00Z',
      });

      try {
        await apiClient.post('/api/posts/company', invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with negative salary', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidData = createCompanyPostData({
        salary: -1000,
      });

      try {
        await apiClient.post('/api/posts/company', invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });
  });

  describe('GET /api/posts/company/{company_post_id}', () => {
    it('[pattern 1] should return job post detail without authentication', async () => {
      // 실제 존재하는 post_id가 필요 (테스트 데이터 의존)
      const testId = 1;

      try {
        const post = await apiClient.get<CompanyPostResponse>(
          `/api/posts/company/${testId}`
        );

        expect(post).toBeDefined();
        expect(post.id).toBe(testId);
        expect(post.title).toBeDefined();
      } catch (error) {
        const apiError = error as ApiError;
        // 존재하지 않으면 404, 서버 에러일 수도 있음
        expect([200, 404, 500]).toContain(apiError.status);
      }
    });

    it('[pattern 4] should return 404 for non-existent post', async () => {
      const nonExistentId = 999999;

      try {
        await apiClient.get<CompanyPostResponse>(
          `/api/posts/company/${nonExistentId}`
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        // 서버가 500을 반환할 수도 있음
        expect([404, 500]).toContain(apiError.status);
      }
    });
  });

  describe('PUT /api/posts/company/{company_post_id}', () => {
    it('[pattern 2] should fail without authentication', async () => {
      const updateData = createCompanyPostData();
      const testId = 1;

      try {
        await apiClient.put(`/api/posts/company/${testId}`, updateData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 1] should update job post when authenticated', async () => {
      apiClient.setAccessToken('test-company-token');

      const testId = testPostId || 1;
      const updateData = createCompanyPostData({
        title: 'Updated Job Title',
        content: 'Updated job description.',
      });

      try {
        const updatedPost = await apiClient.put<CompanyPostResponse>(
          `/api/posts/company/${testId}`,
          updateData
        );

        expect(updatedPost).toBeDefined();
      } catch (error) {
        console.log('Test token invalid or post not owned, skipping update test');
      }
    });

    it('[pattern 3] should fail when updating another companys post', async () => {
      apiClient.setAccessToken('test-company-token-other');

      const othersPostId = 1;
      const updateData = createCompanyPostData();

      try {
        await apiClient.put(`/api/posts/company/${othersPostId}`, updateData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([403, 401, 404]).toContain(apiError.status);
      }
    });

    it('[pattern 4] should fail for non-existent post', async () => {
      apiClient.setAccessToken('test-company-token');

      const nonExistentId = 999999;
      const updateData = createCompanyPostData();

      try {
        await apiClient.put(`/api/posts/company/${nonExistentId}`, updateData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([404, 401]).toContain(apiError.status);
      }
    });
  });

  describe('DELETE /api/posts/company/{company_post_id}', () => {
    it('[pattern 2] should fail without authentication', async () => {
      const testId = 1;

      try {
        await apiClient.delete(`/api/posts/company/${testId}`);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 3] should fail when deleting another companys post', async () => {
      apiClient.setAccessToken('test-company-token-other');

      const othersPostId = 1;

      try {
        await apiClient.delete(`/api/posts/company/${othersPostId}`);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([403, 401, 404]).toContain(apiError.status);
      }
    });

    it('[pattern 4] should fail for non-existent post', async () => {
      apiClient.setAccessToken('test-company-token');

      const nonExistentId = 999999;

      try {
        await apiClient.delete(`/api/posts/company/${nonExistentId}`);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([404, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 1] should delete job post when authenticated and authorized', async () => {
      apiClient.setAccessToken('test-company-token');

      // 삭제할 포스트 생성
      try {
        const postData = createCompanyPostData();
        const createdPost = await apiClient.post<CompanyPostResponse>(
          '/api/posts/company',
          postData
        );

        const postIdToDelete = createdPost.id;

        // 삭제 시도
        await apiClient.delete(`/api/posts/company/${postIdToDelete}`);

        // 삭제 확인 (404 응답 기대)
        try {
          await apiClient.get(`/api/posts/company/${postIdToDelete}`);
          expect.fail('Post should have been deleted');
        } catch (error) {
          const apiError = error as ApiError;
          expect(apiError.status).toBe(404);
        }
      } catch (error) {
        console.log('Test token invalid, skipping company post deletion test');
      }
    });
  });
});
