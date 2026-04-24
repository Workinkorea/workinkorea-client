import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/fetchClient', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api/fetchClient')>(
    '@/shared/api/fetchClient',
  );
  return {
    ...actual,
    fetchAPI: vi.fn(),
  };
});

import { fetchAPI, FetchError } from '@/shared/api/fetchClient';
import { getCompanyPosts } from '@/features/jobs/api/postsApi';

const mockedFetchAPI = vi.mocked(fetchAPI);

describe('getCompanyPosts — graceful degradation (prod SSR fallback)', () => {
  beforeEach(() => {
    mockedFetchAPI.mockReset();
  });

  it('정상 응답을 받으면 posts 를 반환한다', async () => {
    mockedFetchAPI.mockResolvedValueOnce({
      company_posts: [
        { id: 1, title: 't1', salary: 3000 },
      ],
      pagination: { skip: 0, limit: 12, count: 1 },
    });

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toHaveLength(1);
    expect(res.company_posts[0].id).toBe(1);
  });

  it('404 FetchError 는 빈 결과를 반환한다 (기존 동작)', async () => {
    mockedFetchAPI.mockRejectedValueOnce(new FetchError('Not Found', 404));

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toEqual([]);
    expect(res.total).toBe(0);
  });

  it('네트워크 에러(status 0) 는 SSR 실패 → 빈 결과 반환 (클라이언트 훅이 재시도)', async () => {
    mockedFetchAPI.mockRejectedValueOnce(new FetchError('Network request failed', 0));

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toEqual([]);
    expect(res.total).toBe(0);
  });

  it('5xx FetchError 는 SSR 실패 → 빈 결과 반환', async () => {
    mockedFetchAPI.mockRejectedValueOnce(new FetchError('Bad Gateway', 502));

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toEqual([]);
    expect(res.total).toBe(0);
  });

  it('401 FetchError 도 SSR 실패 → 빈 결과 반환 (공개 엔드포인트라 익명 호출이 401 받으면 설정 오류)', async () => {
    mockedFetchAPI.mockRejectedValueOnce(new FetchError('Unauthorized', 401));

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toEqual([]);
  });

  it('일반 Error (FetchError 가 아닌 예외) 도 빈 결과 반환', async () => {
    mockedFetchAPI.mockRejectedValueOnce(new TypeError('fetch failed'));

    const res = await getCompanyPosts(1);

    expect(res.company_posts).toEqual([]);
  });
});
