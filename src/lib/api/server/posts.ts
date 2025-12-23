import { CompanyPostsResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

/**
 * 서버 컴포넌트에서 사용하는 공고 목록 조회 함수
 * fetch API를 사용하여 직접 호출
 */
export async function getCompanyPosts(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<CompanyPostsResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const res = await fetch(`${API_BASE_URL}/api/posts/company/list?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('Failed to fetch company posts:', {
        status: res.status,
        statusText: res.statusText,
        url: `${API_BASE_URL}/api/posts/company/list?page=${page}&limit=${limit}`,
      });
      return { company_posts: [], total: 0, page: 1, limit, total_pages: 0 };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching company posts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      url: `${API_BASE_URL}/api/posts/company/list?page=${page}&limit=${limit}`,
    });
    return { company_posts: [], total: 0, page: 1, limit, total_pages: 0 };
  }
}
