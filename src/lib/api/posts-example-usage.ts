/**
 * Example usage for Company Posts API
 *
 * This file demonstrates how to use the postsApi to fetch company posts
 *
 * IMPORTANT: This API uses the company access token (companyAccessToken)
 * Make sure the company user is logged in before calling this API
 */

import { postsApi } from './posts';
import { ApiError } from './client';
import { CompanyPost } from './types';
import { tokenManager } from '../utils/tokenManager';

// ============================================================================
// Example 1: Basic usage in a React component with useState
// ============================================================================

export function CompanyPostsListComponent() {
  const [posts, setPosts] = React.useState<CompanyPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPosts() {
      // Check if company token exists before making the request
      if (!tokenManager.isTokenValid('company')) {
        setError('기업 로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const data = await postsApi.getCompanyPosts();
        setPosts(data.company_posts);
      } catch (err) {
        if (err instanceof ApiError) {
          // Handle specific error cases based on the API spec
          if (err.status === 401) {
            // Not authenticated - redirect to login
            setError('인증이 필요합니다.');
            window.location.href = '/login';
          } else if (err.status === 400) {
            // Bad request - company not found or profile not found
            setError(err.data.error || '기업 정보를 찾을 수 없습니다.');
          } else if (err.status === 500) {
            // Server error
            setError(err.data.error || '서버 오류가 발생했습니다.');
          } else {
            setError('알 수 없는 오류가 발생했습니다.');
          }
        } else {
          setError('요청 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div>
      <h1>기업 공고 목록</h1>
      {posts.length === 0 ? (
        <p>등록된 공고가 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>위치: {post.work_location}</p>
              <p>급여: {post.salary.toLocaleString()}원</p>
              <p>
                공고 기간: {new Date(post.start_date).toLocaleDateString()} ~{' '}
                {new Date(post.end_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// Example 2: Using with React Query (Recommended approach)
// ============================================================================

import { useQuery } from '@tanstack/react-query';

export function useCompanyPosts() {
  return useQuery({
    queryKey: ['companyPosts'],
    queryFn: () => postsApi.getCompanyPosts(),
    retry: (failureCount, error) => {
      // Don't retry on 401 (authentication errors)
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

// Usage in component with React Query
export function CompanyPostsWithReactQuery() {
  const { data, isLoading, error } = useCompanyPosts();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return <div>로그인이 필요합니다.</div>;
      }
      return <div>오류: {error.data.error}</div>;
    }
    return <div>요청 중 오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <h1>기업 공고 목록</h1>
      {data?.company_posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 3: Server-side usage (Next.js server component or API route)
// ============================================================================

export async function getServerSideProps(context: any) {
  try {
    // Note: In server-side, you need to pass the token from cookies
    // This is just a basic example - you'll need to handle auth properly
    const data = await postsApi.getCompanyPosts();

    return {
      props: {
        posts: data.company_posts,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        // Redirect to login if not authenticated
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
    }

    return {
      props: {
        posts: [],
        error: '공고를 불러오는데 실패했습니다.',
      },
    };
  }
}

// ============================================================================
// Example 4: Error handling utility
// ============================================================================

export async function fetchCompanyPostsWithErrorHandling() {
  try {
    const response = await postsApi.getCompanyPosts();
    return {
      success: true,
      data: response.company_posts,
      error: null,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      switch (error.status) {
        case 400:
          errorMessage = error.data.error === 'Company not found'
            ? '기업 정보를 찾을 수 없습니다.'
            : error.data.error === 'company profile not found'
            ? '기업 프로필을 찾을 수 없습니다.'
            : error.data.error;
          break;
        case 401:
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          // Auto-redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
        status: error.status,
      };
    }

    return {
      success: false,
      data: null,
      error: '요청 처리 중 오류가 발생했습니다.',
      status: 0,
    };
  }
}

// ============================================================================
// Example 5: TypeScript type-safe usage
// ============================================================================

import type { CompanyPost, CompanyPostsResponse } from './types';

export async function getActiveCompanyPosts(): Promise<CompanyPost[]> {
  const response: CompanyPostsResponse = await postsApi.getCompanyPosts();
  const now = new Date();

  // Filter only active posts (between start_date and end_date)
  return response.company_posts.filter((post) => {
    const startDate = new Date(post.start_date);
    const endDate = new Date(post.end_date);
    return now >= startDate && now <= endDate;
  });
}

export async function getPostsByPosition(positionId: number): Promise<CompanyPost[]> {
  const response = await postsApi.getCompanyPosts();
  return response.company_posts.filter((post) => post.position_id === positionId);
}

export async function getPostsByLocation(location: string): Promise<CompanyPost[]> {
  const response = await postsApi.getCompanyPosts();
  return response.company_posts.filter((post) =>
    post.work_location.toLowerCase().includes(location.toLowerCase())
  );
}

// ============================================================================
// Example 6: Using in Next.js App Router (Server Component)
// ============================================================================

export async function CompanyPostsServerComponent() {
  try {
    const data = await postsApi.getCompanyPosts();

    return (
      <div>
        <h1>기업 공고 목록</h1>
        {data.company_posts.map((post) => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <dl>
              <dt>경력:</dt>
              <dd>{post.work_experience}</dd>
              <dt>학력:</dt>
              <dd>{post.education}</dd>
              <dt>언어:</dt>
              <dd>{post.language}</dd>
              <dt>고용 형태:</dt>
              <dd>{post.employment_type}</dd>
              <dt>근무 시간:</dt>
              <dd>{post.working_hours}시간</dd>
            </dl>
          </article>
        ))}
      </div>
    );
  } catch (error) {
    return <div>공고를 불러올 수 없습니다.</div>;
  }
}
