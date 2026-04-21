import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchAPI, fetchClient, FetchError, API_BASE_URL, SERVER_API_URL, __resetRefreshState } from '../fetchClient';
import { tokenStore } from '../tokenStore';

/**
 * Helper to create mock fetch responses
 */
function mockFetchResponse(status: number, body: unknown, ok?: boolean) {
  const isOk = ok ?? (status >= 200 && status < 300);
  return {
    ok: isOk,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    tokenStore.clear();
    __resetRefreshState();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('success cases', () => {
    it('should return parsed JSON on 200 response', async () => {
      const mockData = { id: 1, name: 'test' };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      const result = await fetchAPI<typeof mockData>('/api/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledOnce();
    });

    it('should return undefined on 204 No Content', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(204, null) as unknown as Response
      );

      const result = await fetchAPI('/api/test');

      expect(result).toBeUndefined();
    });

    it('should use relative URL on client side', async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test');

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0];
      expect(callUrl).toBe('/api/test');
    });

    it('should include Authorization header when token exists', async () => {
      tokenStore.set('test-token-123');
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.headers).toHaveProperty('Authorization', 'Bearer test-token-123');
    });

    it('should not include Authorization header when no token exists', async () => {
      tokenStore.clear();
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      const authHeader = (callConfig.headers as Record<string, string>)?.Authorization;
      expect(authHeader).toBeUndefined();
    });

    it('should include credentials in request', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.credentials).toBe('include');
    });

    it('should set Content-Type to application/json', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect((callConfig.headers as Record<string, string>)?.['Content-Type']).toBe('application/json');
    });
  });

  describe('401 Unauthorized - refresh token flow', () => {
    it('should refresh token and retry on 401', async () => {
      const retryData = { id: 2 };
      const refreshResponse = { access_token: 'new-token' };

      // First call: 401
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );
      // Second call: refresh endpoint returns new token
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, refreshResponse) as unknown as Response
      );
      // Third call: retry with new token succeeds
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, retryData) as unknown as Response
      );

      const result = await fetchAPI<typeof retryData>('/api/test');

      expect(result).toEqual(retryData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should use new token in retry request after refresh', async () => {
      const retryData = { id: 2 };
      const refreshResponse = { access_token: 'new-token' };

      tokenStore.set('old-token');

      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, refreshResponse) as unknown as Response
      );
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, retryData) as unknown as Response
      );

      await fetchAPI<typeof retryData>('/api/test');

      // Check the third call (retry) has new token
      const retryCallConfig = vi.mocked(global.fetch).mock.calls[2][1] as RequestInit;
      expect((retryCallConfig.headers as Record<string, string>)?.Authorization).toBe('Bearer new-token');
    });

    it('should throw FetchError when refresh fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(400, { detail: 'Refresh failed' }) as unknown as Response
      );

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(401);
      }
    });

    it('should not refresh when skipAuth is true', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );

      await expect(fetchAPI('/api/test', { skipAuth: true })).rejects.toThrow(FetchError);

      // Should only call fetch once (no refresh attempt)
      expect(global.fetch).toHaveBeenCalledOnce();
    });

    it('should not refresh when endpoint is /auth/refresh', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );

      await expect(fetchAPI('/api/auth/refresh', {})).rejects.toThrow(FetchError);

      // Should only call fetch once (no recursive refresh)
      expect(global.fetch).toHaveBeenCalledOnce();
    });

    it('should share a single refresh request across concurrent 401s (single-flight)', async () => {
      const refreshResponse = { access_token: 'new-token' };
      const retryData = { ok: true };

      // Two concurrent requests both 401, then share one refresh, then each retries
      vi.mocked(global.fetch).mockImplementation((input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
        if (url.includes('/auth/refresh')) {
          return Promise.resolve(mockFetchResponse(200, refreshResponse) as unknown as Response);
        }
        // alternating 401 → then retry 200. Use call count to determine phase.
        const callCount = vi.mocked(global.fetch).mock.calls.length;
        // first two calls are the initial 401s
        if (callCount <= 2) {
          return Promise.resolve(mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response);
        }
        return Promise.resolve(mockFetchResponse(200, retryData) as unknown as Response);
      });

      const [a, b] = await Promise.all([
        fetchAPI<typeof retryData>('/api/a'),
        fetchAPI<typeof retryData>('/api/b'),
      ]);

      expect(a).toEqual(retryData);
      expect(b).toEqual(retryData);

      // refresh should be called exactly once, not twice
      const refreshCalls = vi.mocked(global.fetch).mock.calls.filter(([input]) => {
        const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
        return url.includes('/auth/refresh');
      });
      expect(refreshCalls.length).toBe(1);
    });

    it('should stop refreshing after 3 consecutive failures', async () => {
      // Every fetch returns 401, every refresh returns 400
      vi.mocked(global.fetch).mockImplementation((input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
        if (url.includes('/auth/refresh')) {
          return Promise.resolve(mockFetchResponse(400, { detail: 'Refresh failed' }) as unknown as Response);
        }
        return Promise.resolve(mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response);
      });

      // Make 5 sequential requests; each should fail without exceeding 3 refresh attempts total
      for (let i = 0; i < 5; i++) {
        await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
      }

      const refreshCalls = vi.mocked(global.fetch).mock.calls.filter(([input]) => {
        const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
        return url.includes('/auth/refresh');
      });
      expect(refreshCalls.length).toBeLessThanOrEqual(3);
    }, 10_000);

    it('should throw FetchError when retry fails after successful refresh', async () => {
      const refreshResponse = { access_token: 'new-token' };

      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(401, { detail: 'Unauthorized' }) as unknown as Response
      );
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, refreshResponse) as unknown as Response
      );
      // Retry fails with 500
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(500, { message: 'Server error' }) as unknown as Response
      );

      await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('403 Forbidden', () => {
    it('should throw FetchError with detail from response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(403, { detail: 'Access denied' }, false) as unknown as Response
      );

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(403);
        expect((error as FetchError).message).toBe('Access denied');
      }
    });

    it('should handle 403 with message field', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(403, { message: 'Permission denied' }, false) as unknown as Response
      );

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(403);
        expect((error as FetchError).message).toBe('Permission denied');
      }
    });

    it('should handle 403 with non-JSON response body', async () => {
      const mockResponse = mockFetchResponse(403, 'Forbidden', false);
      mockResponse.text = vi.fn().mockResolvedValue('Forbidden');
      mockResponse.json = vi.fn().mockRejectedValue(new Error('Not JSON'));
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as unknown as Response);

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(403);
      }
    });
  });

  describe('5xx Server Errors', () => {
    it('should throw FetchError on 500', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(500, { message: 'Internal error' }, false) as unknown as Response
      );

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(500);
        expect((error as FetchError).message).toBe('Internal error');
      }
    });

    it('should throw FetchError on 502', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(502, { error: 'Bad Gateway' }, false) as unknown as Response
      );

      try {
        await fetchAPI('/api/test');
        expect.fail('Should have thrown FetchError');
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        expect((error as FetchError).status).toBe(502);
      }
    });

    it('should use error from response body', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(500, { error: 'Database connection failed' }, false) as unknown as Response
      );

      await expect(fetchAPI('/api/test')).rejects.toThrow('Database connection failed');
    });

    it('should fallback to statusText when no error message', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({}),
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as unknown as Response);

      await expect(fetchAPI('/api/test')).rejects.toThrow('Internal Server Error');
    });
  });

  describe('network errors', () => {
    it('should catch fetch() network error and throw FetchError', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
      await expect(fetchAPI('/api/test')).rejects.toMatchObject({
        status: 0,
        message: 'Network request failed',
      });
    });

    it('should preserve original error in FetchError data', async () => {
      const originalError = new Error('Connection timeout');
      vi.mocked(global.fetch).mockRejectedValueOnce(originalError);

      await expect(fetchAPI('/api/test')).rejects.toMatchObject({
        status: 0,
        data: originalError,
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      vi.mocked(global.fetch).mockRejectedValueOnce(timeoutError);

      await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
    });
  });

  describe('request options', () => {
    it('should accept custom headers', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test', {
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect((callConfig.headers as Record<string, string>)?.['X-Custom-Header']).toBe('custom-value');
    });

    it('should preserve existing headers when adding custom ones', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test', {
        headers: { 'X-Custom': 'value' },
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect((callConfig.headers as Record<string, string>)?.['Content-Type']).toBe('application/json');
      expect((callConfig.headers as Record<string, string>)?.['X-Custom']).toBe('value');
    });

    it('should accept Next.js fetch cache options (ISR)', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test', {
        next: { revalidate: 3600, tags: ['jobs'] },
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as any;
      expect(callConfig.next).toEqual({ revalidate: 3600, tags: ['jobs'] });
    });

    it('should pass through standard RequestInit options', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test', {
        method: 'GET',
        cache: 'no-store',
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.cache).toBe('no-store');
    });
  });

  describe('request body handling', () => {
    it('should serialize object body as JSON', async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      const body = { name: 'John', age: 30 };
      await fetchAPI('/api/test', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBe(JSON.stringify(body));
    });

    it('should handle undefined body', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchAPI('/api/test', { method: 'GET' });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBeUndefined();
    });
  });

  describe('error handling edge cases', () => {
    it('should handle response.json() rejection gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as unknown as Response);

      await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
    });

    it('should handle empty response body', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({}),
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as unknown as Response);

      await expect(fetchAPI('/api/test')).rejects.toThrow(FetchError);
    });

    it('should handle FetchError instances and rethrow', async () => {
      const fetchError = new FetchError('Already a FetchError', 400);
      vi.mocked(global.fetch).mockRejectedValueOnce(fetchError);

      await expect(fetchAPI('/api/test')).rejects.toThrow(fetchError);
    });
  });
});

describe('fetchClient methods', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    tokenStore.clear();
    __resetRefreshState();
    global.fetch = vi.fn();
  });

  describe('fetchClient.get()', () => {
    it('should call fetch with GET method', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.get<typeof mockData>('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.method).toBe('GET');
    });

    it('should not include body in GET request', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.get('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBeUndefined();
    });

    it('should accept FetchOptions', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.get('/api/test', {
        next: { revalidate: 3600 },
      });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as any;
      expect(callConfig.next).toEqual({ revalidate: 3600 });
    });
  });

  describe('fetchClient.post()', () => {
    it('should call fetch with POST method', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.post('/api/test', { name: 'test' });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.method).toBe('POST');
    });

    it('should serialize data as JSON in body', async () => {
      const mockData = { id: 1 };
      const postData = { name: 'John', email: 'john@example.com' };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.post('/api/test', postData);

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBe(JSON.stringify(postData));
    });

    it('should handle POST with undefined data', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.post('/api/test');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBeUndefined();
    });

    it('should accept FetchOptions', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.post('/api/test', { name: 'test' }, { skipAuth: true });

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('fetchClient.put()', () => {
    it('should call fetch with PUT method', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.put('/api/test/1', { name: 'updated' });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.method).toBe('PUT');
    });

    it('should serialize data as JSON in body', async () => {
      const mockData = { id: 1 };
      const putData = { name: 'updated name' };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.put('/api/test/1', putData);

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBe(JSON.stringify(putData));
    });
  });

  describe('fetchClient.delete()', () => {
    it('should call fetch with DELETE method', async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.delete('/api/test/1');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.method).toBe('DELETE');
    });

    it('should not include body in DELETE request', async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.delete('/api/test/1');

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBeUndefined();
    });

    it('should handle 204 response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(204, null) as unknown as Response
      );

      const result = await fetchClient.delete('/api/test/1');

      expect(result).toBeUndefined();
    });
  });

  describe('fetchClient.patch()', () => {
    it('should call fetch with PATCH method', async () => {
      const mockData = { id: 1 };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.patch('/api/test/1', { status: 'active' });

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.method).toBe('PATCH');
    });

    it('should serialize data as JSON in body', async () => {
      const mockData = { id: 1 };
      const patchData = { status: 'inactive' };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockFetchResponse(200, mockData) as unknown as Response
      );

      await fetchClient.patch('/api/test/1', patchData);

      const callConfig = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
      expect(callConfig.body).toBe(JSON.stringify(patchData));
    });
  });
});

describe('FetchError class', () => {
  it('should be instanceof Error', () => {
    const error = new FetchError('Test error', 400);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct name property', () => {
    const error = new FetchError('Test error', 400);
    expect(error.name).toBe('FetchError');
  });

  it('should have correct message property', () => {
    const error = new FetchError('Test message', 404);
    expect(error.message).toBe('Test message');
  });

  it('should have correct status property', () => {
    const error = new FetchError('Not found', 404);
    expect(error.status).toBe(404);
  });

  it('should store data property', () => {
    const errorData = { detail: 'Resource not found' };
    const error = new FetchError('Error', 404, errorData);
    expect(error.data).toEqual(errorData);
  });

  it('should work without data property', () => {
    const error = new FetchError('Error', 500);
    expect(error.data).toBeUndefined();
  });

  it('should have stack trace', () => {
    const error = new FetchError('Error', 400);
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('FetchError');
  });

  it('should handle various data types', () => {
    const stringError = new FetchError('Error', 400, 'string data');
    expect(stringError.data).toBe('string data');

    const arrayError = new FetchError('Error', 400, ['item1', 'item2']);
    expect(arrayError.data).toEqual(['item1', 'item2']);

    const numberError = new FetchError('Error', 400, 42);
    expect(numberError.data).toBe(42);
  });
});

describe('API_BASE_URL and SERVER_API_URL constants', () => {
  it('API_BASE_URL should be empty string for client-side relative URLs', () => {
    expect(API_BASE_URL).toBe('');
  });

  it('SERVER_API_URL should have a default value', () => {
    expect(SERVER_API_URL).toBeDefined();
    expect(SERVER_API_URL).toContain('http');
  });
});
