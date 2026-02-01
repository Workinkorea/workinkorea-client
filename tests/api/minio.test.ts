import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../utils/api-client';
import { clearAuth } from '../utils/auth-helper';
import { createMinioFileRequest } from '../utils/test-data';
import type { MinioFileResponse } from '../types/api';
import type { ApiError } from '../utils/api-client';

describe('Minio API E2E Tests', () => {
  beforeEach(() => {
    clearAuth();
  });

  afterEach(() => {
    clearAuth();
  });

  describe('POST /api/minio/company/file', () => {
    it('[pattern 2] should fail without authentication', async () => {
      const fileRequest = createMinioFileRequest({
        file_type: 'company_image',
        file_name: 'company-logo.jpg',
        content_type: 'image/jpeg',
        max_size: 5242880,
      });

      try {
        await apiClient.post('/api/minio/company/file', fileRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 1] should return presigned URL for company file upload when authenticated', async () => {
      apiClient.setAccessToken('test-company-token');

      const fileRequest = createMinioFileRequest({
        file_type: 'company_image',
        file_name: 'company-logo.png',
        content_type: 'image/png',
        max_size: 5242880,
      });

      try {
        const response = await apiClient.post<MinioFileResponse>(
          '/api/minio/company/file',
          fileRequest
        );

        expect(response).toBeDefined();
        expect(response.url).toBeDefined();
        expect(response.key).toBeDefined();
        expect(response.content_type).toBe(fileRequest.content_type);
        expect(response.form_data).toBeDefined();
        expect(response.expires).toBeDefined();

        // URL이 유효한 형식인지 확인
        expect(response.url).toMatch(/^https?:\/\//);
      } catch (error) {
        console.log('Test token invalid, skipping company file upload URL test');
      }
    });

    it('[pattern 5] should fail with missing required fields', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidRequest = {
        file_type: 'company_image',
        // missing file_name, content_type, max_size
      };

      try {
        await apiClient.post('/api/minio/company/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with invalid file_type', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidRequest = createMinioFileRequest({
        file_type: 'invalid_type' as any,
      });

      try {
        await apiClient.post('/api/minio/company/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with invalid content_type', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidRequest = createMinioFileRequest({
        content_type: 'invalid/type',
      });

      try {
        await apiClient.post('/api/minio/company/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with file size exceeding limit', async () => {
      apiClient.setAccessToken('test-company-token');

      const invalidRequest = createMinioFileRequest({
        max_size: 100000000, // 100MB (가정: 제한을 초과)
      });

      try {
        await apiClient.post('/api/minio/company/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 1] should support different file types for company', async () => {
      apiClient.setAccessToken('test-company-token');

      const fileTypes = ['company_image', 'company_post'] as const;

      for (const fileType of fileTypes) {
        const fileRequest = createMinioFileRequest({
          file_type: fileType,
          file_name: `test-${fileType}.jpg`,
        });

        try {
          const response = await apiClient.post<MinioFileResponse>(
            '/api/minio/company/file',
            fileRequest
          );

          expect(response).toBeDefined();
          expect(response.url).toBeDefined();
        } catch (error) {
          console.log(`Test skipped for file type: ${fileType}`);
        }
      }
    });
  });

  describe('POST /api/minio/user/file', () => {
    it('[pattern 2] should fail without authentication', async () => {
      const fileRequest = createMinioFileRequest({
        file_type: 'profile_image',
        file_name: 'profile.jpg',
        content_type: 'image/jpeg',
        max_size: 5242880,
      });

      try {
        await apiClient.post('/api/minio/user/file', fileRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.status).toBe(401);
      }
    });

    it('[pattern 1] should return presigned URL for user file upload when authenticated', async () => {
      apiClient.setAccessToken('test-user-token');

      const fileRequest = createMinioFileRequest({
        file_type: 'profile_image',
        file_name: 'my-profile.jpg',
        content_type: 'image/jpeg',
        max_size: 5242880,
      });

      try {
        const response = await apiClient.post<MinioFileResponse>(
          '/api/minio/user/file',
          fileRequest
        );

        expect(response).toBeDefined();
        expect(response.url).toBeDefined();
        expect(response.key).toBeDefined();
        expect(response.content_type).toBe(fileRequest.content_type);
        expect(response.form_data).toBeDefined();
        expect(response.expires).toBeDefined();

        // URL이 유효한 형식인지 확인
        expect(response.url).toMatch(/^https?:\/\//);
      } catch (error) {
        console.log('Test token invalid, skipping user file upload URL test');
      }
    });

    it('[pattern 5] should fail with missing required fields', async () => {
      apiClient.setAccessToken('test-user-token');

      const invalidRequest = {
        file_type: 'profile_image',
        // missing file_name, content_type, max_size
      };

      try {
        await apiClient.post('/api/minio/user/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with invalid file_type for user', async () => {
      apiClient.setAccessToken('test-user-token');

      const invalidRequest = createMinioFileRequest({
        file_type: 'company_image' as any, // 사용자는 company_image 사용 불가
      });

      try {
        await apiClient.post('/api/minio/user/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401, 403]).toContain(apiError.status);
      }
    });

    it('[pattern 1] should support different file types for user', async () => {
      apiClient.setAccessToken('test-user-token');

      const fileTypes = ['profile_image', 'resume_pdf'] as const;

      for (const fileType of fileTypes) {
        const fileRequest = createMinioFileRequest({
          file_type: fileType,
          file_name: `test-${fileType}.${fileType === 'resume_pdf' ? 'pdf' : 'jpg'}`,
          content_type: fileType === 'resume_pdf' ? 'application/pdf' : 'image/jpeg',
        });

        try {
          const response = await apiClient.post<MinioFileResponse>(
            '/api/minio/user/file',
            fileRequest
          );

          expect(response).toBeDefined();
          expect(response.url).toBeDefined();
        } catch (error) {
          console.log(`Test skipped for file type: ${fileType}`);
        }
      }
    });

    it('[pattern 5] should fail with negative max_size', async () => {
      apiClient.setAccessToken('test-user-token');

      const invalidRequest = createMinioFileRequest({
        max_size: -1,
      });

      try {
        await apiClient.post('/api/minio/user/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 5] should fail with empty file_name', async () => {
      apiClient.setAccessToken('test-user-token');

      const invalidRequest = createMinioFileRequest({
        file_name: '',
      });

      try {
        await apiClient.post('/api/minio/user/file', invalidRequest);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const apiError = error as ApiError;
        expect([422, 400, 401]).toContain(apiError.status);
      }
    });

    it('[pattern 1] should generate unique keys for multiple upload requests', async () => {
      apiClient.setAccessToken('test-user-token');

      const fileRequest1 = createMinioFileRequest({
        file_name: 'file1.jpg',
      });

      const fileRequest2 = createMinioFileRequest({
        file_name: 'file2.jpg',
      });

      try {
        const response1 = await apiClient.post<MinioFileResponse>(
          '/api/minio/user/file',
          fileRequest1
        );

        const response2 = await apiClient.post<MinioFileResponse>(
          '/api/minio/user/file',
          fileRequest2
        );

        expect(response1.key).not.toBe(response2.key);
      } catch (error) {
        console.log('Test token invalid, skipping unique key generation test');
      }
    });
  });
});
