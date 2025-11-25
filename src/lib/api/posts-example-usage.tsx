/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Example usage for Company Posts API
 *
 * This file demonstrates how to use the postsApi to:
 * - Fetch company posts list (GET /api/posts/company)
 * - Fetch single company post by ID (GET /api/posts/company/{id})
 * - Create company posts (POST /api/posts/company)
 * - Update company posts (PUT /api/posts/company/{id})
 * - Delete company posts (DELETE /api/posts/company/{id})
 *
 * IMPORTANT: This API uses the company access token (companyAccessToken)
 * Make sure the company user is logged in before calling this API
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetServerSidePropsContext } from 'next';
import { postsApi } from './posts';
import { ApiError } from './client';
import {
  CompanyPost,
  CreateCompanyPostRequest,
  CompanyPostDetailResponse,
  UpdateCompanyPostRequest,
  CompanyPostsResponse,
} from './types';
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

export async function getServerSideProps(_context: GetServerSidePropsContext) {
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
  } catch (_error) {
    return <div>공고를 불러올 수 없습니다.</div>;
  }
}

// ============================================================================
// Example 7: Fetching a single company post by ID
// ============================================================================

export function CompanyPostDetailComponent({ postId }: { postId: number }) {
  const [post, setPost] = React.useState<CompanyPostDetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPostDetail() {
      // Check if company token exists before making the request
      if (!tokenManager.isTokenValid('company')) {
        setError('기업 로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const data = await postsApi.getCompanyPostById(postId);
        setPost(data);
      } catch (err) {
        if (err instanceof ApiError) {
          // Handle specific error cases based on the API spec
          if (err.status === 401) {
            // Not authenticated - redirect to login
            setError('인증이 필요합니다.');
            window.location.href = '/login';
          } else if (err.status === 400) {
            // Company post not found
            setError(err.data.error || '공고를 찾을 수 없습니다.');
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

    loadPostDetail();
  }, [postId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!post) {
    return <div>공고를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <dl>
        <dt>회사 ID:</dt>
        <dd>{post.company_id}</dd>
        <dt>경력:</dt>
        <dd>{post.work_experience}</dd>
        <dt>포지션 ID:</dt>
        <dd>{post.position_id}</dd>
        <dt>학력:</dt>
        <dd>{post.education}</dd>
        <dt>언어:</dt>
        <dd>{post.language}</dd>
        <dt>고용 형태:</dt>
        <dd>{post.employment_type}</dd>
        <dt>근무 지역:</dt>
        <dd>{post.work_location}</dd>
        <dt>근무 시간:</dt>
        <dd>{post.working_hours}시간</dd>
        <dt>급여:</dt>
        <dd>{post.salary.toLocaleString()}원</dd>
        <dt>공고 기간:</dt>
        <dd>
          {new Date(post.start_date).toLocaleDateString()} ~{' '}
          {new Date(post.end_date).toLocaleDateString()}
        </dd>
      </dl>
    </div>
  );
}

// ============================================================================
// Example 8: Using React Query for single post (Recommended)
// ============================================================================

export function useCompanyPostDetail(postId: number) {
  return useQuery({
    queryKey: ['companyPost', postId],
    queryFn: () => postsApi.getCompanyPostById(postId),
    retry: (failureCount, error) => {
      // Don't retry on 401 (authentication errors) or 400 (not found)
      if (error instanceof ApiError && (error.status === 401 || error.status === 400)) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    enabled: !!postId, // Only run query if postId is provided
  });
}

// Usage in component with React Query
export function CompanyPostDetailWithReactQuery({ postId }: { postId: number }) {
  const { data: post, isLoading, error } = useCompanyPostDetail(postId);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return <div>로그인이 필요합니다.</div>;
      }
      if (error.status === 400) {
        return <div>공고를 찾을 수 없습니다.</div>;
      }
      return <div>오류: {error.data.error}</div>;
    }
    return <div>요청 중 오류가 발생했습니다.</div>;
  }

  return (
    <article>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
      <div>
        <strong>급여:</strong> {post?.salary.toLocaleString()}원
      </div>
      <div>
        <strong>근무지:</strong> {post?.work_location}
      </div>
    </article>
  );
}

// ============================================================================
// Example 9: Utility function with error handling
// ============================================================================

export async function fetchCompanyPostDetailWithErrorHandling(postId: number) {
  try {
    // Validate token before making request
    if (!tokenManager.isTokenValid('company')) {
      return {
        success: false,
        data: null,
        error: '기업 인증이 필요합니다. 다시 로그인해주세요.',
        status: 401,
      };
    }

    const response = await postsApi.getCompanyPostById(postId);

    return {
      success: true,
      data: response,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      switch (error.status) {
        case 400:
          errorMessage = error.data.error === 'Company post not found'
            ? '공고를 찾을 수 없습니다.'
            : error.data.error || '잘못된 요청입니다.';
          break;
        case 401:
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          // Auto-redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 500:
          errorMessage = error.data.error || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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
// Example 10: Creating a company post with form submission
// ============================================================================

export function CreateCompanyPostForm() {
  const [formData, setFormData] = React.useState<CreateCompanyPostRequest>({
    title: '',
    content: '',
    work_experience: '',
    position_id: '',
    education: '',
    language: '',
    employment_type: '',
    work_location: '',
    working_hours: 0,
    salary: 0,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if company token exists before making the request
    if (!tokenManager.isTokenValid('company')) {
      setError('기업 로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await postsApi.createCompanyPost(formData);
      console.log('Created post:', response);
      setSuccess(true);
      // Reset form or redirect to posts list
      // window.location.href = '/company/posts';
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific error cases based on the API spec
        if (err.status === 400) {
          // Bad request - check specific error messages
          if (err.data.error === 'Position not found') {
            setError('포지션을 찾을 수 없습니다. 올바른 포지션을 선택해주세요.');
          } else if (err.data.error === 'failed to create company profile') {
            setError('기업 공고 생성에 실패했습니다.');
          } else {
            setError(err.data.error || '잘못된 요청입니다.');
          }
        } else if (err.status === 401) {
          // Not authenticated
          setError('인증이 필요합니다. 다시 로그인해주세요.');
          window.location.href = '/login';
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>새 공고 등록</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>공고가 성공적으로 등록되었습니다!</div>}

      <input
        type="text"
        placeholder="공고 제목"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <textarea
        placeholder="공고 내용"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
      />

      {/* Add more fields as needed */}

      <button type="submit" disabled={loading}>
        {loading ? '등록 중...' : '공고 등록'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 8: Using React Query mutation for creating posts (Recommended)
// ============================================================================

export function useCreateCompanyPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyPostRequest) => postsApi.createCompanyPost(data),
    onSuccess: () => {
      // Invalidate and refetch company posts after creating a new one
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error('Failed to create post:', error.data.error, error.status);
      }
    },
  });
}

// Usage in component with React Query mutation
export function CreatePostWithReactQuery() {
  const createPost = useCreateCompanyPost();

  const _handleCreatePost = async (formData: CreateCompanyPostRequest) => {
    try {
      if (!tokenManager.isTokenValid('company')) {
        alert('기업 로그인이 필요합니다.');
        return;
      }

      const response = await createPost.mutateAsync(formData);
      console.log('Post created successfully:', response);
      alert('공고가 성공적으로 등록되었습니다!');
    } catch (error) {
      // Error is already handled in mutation's onError
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h2>새 공고 등록</h2>
      {createPost.isPending && <div>등록 중...</div>}
      {createPost.isError && (
        <div style={{ color: 'red' }}>
          {createPost.error instanceof ApiError
            ? createPost.error.data.error
            : '공고 등록에 실패했습니다.'}
        </div>
      )}
      {createPost.isSuccess && (
        <div style={{ color: 'green' }}>공고가 성공적으로 등록되었습니다!</div>
      )}
      {/* Form implementation here */}
    </div>
  );
}

// ============================================================================
// Example 9: Complete utility function with proper error handling
// ============================================================================

export async function createCompanyPostWithErrorHandling(
  postData: CreateCompanyPostRequest
) {
  try {
    // Validate token before making request
    if (!tokenManager.isTokenValid('company')) {
      return {
        success: false,
        data: null,
        error: '기업 인증이 필요합니다. 다시 로그인해주세요.',
        status: 401,
      };
    }

    const response = await postsApi.createCompanyPost(postData);

    return {
      success: true,
      data: response,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      switch (error.status) {
        case 400:
          if (error.data.error === 'Position not found') {
            errorMessage = '포지션을 찾을 수 없습니다. 올바른 포지션을 선택해주세요.';
          } else if (error.data.error === 'failed to create company profile') {
            errorMessage = '기업 공고 생성에 실패했습니다.';
          } else {
            errorMessage = error.data.error || '잘못된 요청입니다.';
          }
          break;
        case 401:
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          // Auto-redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 500:
          errorMessage = error.data.error || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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
// Example 10: Sample data for testing
// ============================================================================

export const sampleCreatePostData: CreateCompanyPostRequest = {
  title: '프론트엔드 개발자 모집',
  content: 'React 및 TypeScript 경험이 있는 개발자를 찾습니다.',
  work_experience: '3년 이상',
  position_id: '1',
  education: '학사 이상',
  language: '한국어, 영어',
  employment_type: '정규직',
  work_location: '서울시 강남구',
  working_hours: 40,
  salary: 50000000,
  start_date: '2025-11-17T00:00:00.000Z',
  end_date: '2025-12-31T23:59:59.999Z',
};

// Quick test function
export async function testCreateCompanyPost() {
  console.log('Testing createCompanyPost API...');
  const result = await createCompanyPostWithErrorHandling(sampleCreatePostData);

  if (result.success) {
    console.log('✅ Success! Created post:', result.data);
  } else {
    console.error('❌ Error:', result.error, `(Status: ${result.status})`);
  }

  return result;
}

// ============================================================================
// Example 14: Updating a company post with form submission
// ============================================================================

export function UpdateCompanyPostForm({ postId }: { postId: number }) {
  const [formData, setFormData] = React.useState<UpdateCompanyPostRequest>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if company token exists before making the request
    if (!tokenManager.isTokenValid('company')) {
      setError('기업 로그인이 필요합니다.');
      return;
    }

    // Check if there are any changes to submit
    if (Object.keys(formData).length === 0) {
      setError('변경할 내용이 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await postsApi.updateCompanyPost(postId, formData);
      console.log('Updated post:', response);
      setSuccess(true);
      // Redirect to post detail page or refresh
      // window.location.href = `/company/posts/${postId}`;
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific error cases based on the API spec
        if (err.status === 400) {
          // Bad request - check specific error messages
          if (err.data.error === 'Company not found') {
            setError('기업 정보를 찾을 수 없습니다.');
          } else if (err.data.error === 'Position not found') {
            setError('포지션을 찾을 수 없습니다. 올바른 포지션을 선택해주세요.');
          } else if (err.data.error === 'Company post is the same') {
            setError('변경된 내용이 없습니다.');
          } else if (err.data.error === 'Failed to update company post') {
            setError('기업 공고 업데이트에 실패했습니다.');
          } else {
            setError(err.data.error || '잘못된 요청입니다.');
          }
        } else if (err.status === 401) {
          // Not authenticated
          setError('인증이 필요합니다. 다시 로그인해주세요.');
          window.location.href = '/login';
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>공고 수정</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>공고가 성공적으로 수정되었습니다!</div>}

      <input
        type="text"
        placeholder="공고 제목"
        value={formData.title ?? ''}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <textarea
        placeholder="공고 내용"
        value={formData.content ?? ''}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />

      <input
        type="number"
        placeholder="급여"
        value={formData.salary ?? ''}
        onChange={(e) =>
          setFormData({ ...formData, salary: parseInt(e.target.value) })
        }
      />

      {/* Add more fields as needed */}

      <button type="submit" disabled={loading}>
        {loading ? '수정 중...' : '공고 수정'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 15: Using React Query mutation for updating posts (Recommended)
// ============================================================================

export function useUpdateCompanyPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: UpdateCompanyPostRequest;
    }) => postsApi.updateCompanyPost(postId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch company posts list
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      // Update the specific post in cache
      queryClient.invalidateQueries({ queryKey: ['companyPost', variables.postId] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error('Failed to update post:', error.data.error, error.status);
      }
    },
  });
}

// Usage in component with React Query mutation
export function UpdatePostWithReactQuery({ postId }: { postId: number }) {
  const updatePost = useUpdateCompanyPost();

  const _handleUpdatePost = async (formData: UpdateCompanyPostRequest) => {
    try {
      if (!tokenManager.isTokenValid('company')) {
        alert('기업 로그인이 필요합니다.');
        return;
      }

      const response = await updatePost.mutateAsync({ postId, data: formData });
      console.log('Post updated successfully:', response);
      alert('공고가 성공적으로 수정되었습니다!');
    } catch (error) {
      // Error is already handled in mutation's onError
      console.error('Error updating post:', error);
    }
  };

  return (
    <div>
      <h2>공고 수정</h2>
      {updatePost.isPending && <div>수정 중...</div>}
      {updatePost.isError && (
        <div style={{ color: 'red' }}>
          {updatePost.error instanceof ApiError
            ? updatePost.error.data.error
            : '공고 수정에 실패했습니다.'}
        </div>
      )}
      {updatePost.isSuccess && (
        <div style={{ color: 'green' }}>공고가 성공적으로 수정되었습니다!</div>
      )}
      {/* Form implementation here */}
    </div>
  );
}

// ============================================================================
// Example 16: Complete utility function for updating with error handling
// ============================================================================

export async function updateCompanyPostWithErrorHandling(
  postId: number,
  postData: UpdateCompanyPostRequest
) {
  try {
    // Validate token before making request
    if (!tokenManager.isTokenValid('company')) {
      return {
        success: false,
        data: null,
        error: '기업 인증이 필요합니다. 다시 로그인해주세요.',
        status: 401,
      };
    }

    // Check if there are any updates
    if (Object.keys(postData).length === 0) {
      return {
        success: false,
        data: null,
        error: '변경할 내용이 없습니다.',
        status: 400,
      };
    }

    const response = await postsApi.updateCompanyPost(postId, postData);

    return {
      success: true,
      data: response,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      switch (error.status) {
        case 400:
          if (error.data.error === 'Company not found') {
            errorMessage = '기업 정보를 찾을 수 없습니다.';
          } else if (error.data.error === 'Position not found') {
            errorMessage = '포지션을 찾을 수 없습니다. 올바른 포지션을 선택해주세요.';
          } else if (error.data.error === 'Company post is the same') {
            errorMessage = '변경된 내용이 없습니다.';
          } else if (error.data.error === 'Failed to update company post') {
            errorMessage = '기업 공고 업데이트에 실패했습니다.';
          } else {
            errorMessage = error.data.error || '잘못된 요청입니다.';
          }
          break;
        case 401:
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          // Auto-redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 500:
          errorMessage = error.data.error || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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
// Example 17: Sample data for testing updates
// ============================================================================

export const sampleUpdatePostData: UpdateCompanyPostRequest = {
  title: '프론트엔드 개발자 모집 (수정)',
  salary: 55000000,
  work_location: '서울시 서초구',
};

// Quick test function
export async function testUpdateCompanyPost(postId: number) {
  console.log(`Testing updateCompanyPost API for post ID ${postId}...`);
  const result = await updateCompanyPostWithErrorHandling(postId, sampleUpdatePostData);

  if (result.success) {
    console.log('✅ Success! Updated post:', result.data);
  } else {
    console.error('❌ Error:', result.error, `(Status: ${result.status})`);
  }

  return result;
}

// ============================================================================
// Example 18: Partial update pattern
// ============================================================================

export async function updatePostTitle(postId: number, newTitle: string) {
  return postsApi.updateCompanyPost(postId, { title: newTitle });
}

export async function updatePostSalary(postId: number, newSalary: number) {
  return postsApi.updateCompanyPost(postId, { salary: newSalary });
}

export async function updatePostDates(
  postId: number,
  startDate: string,
  endDate: string
) {
  return postsApi.updateCompanyPost(postId, {
    start_date: startDate,
    end_date: endDate,
  });
}

// ============================================================================
// Example 19: Deleting a company post with confirmation
// ============================================================================

export function DeleteCompanyPostButton({ postId }: { postId: number }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    // Confirm before deleting
    if (!window.confirm('정말 이 공고를 삭제하시겠습니까?')) {
      return;
    }

    // Check if company token exists before making the request
    if (!tokenManager.isTokenValid('company')) {
      setError('기업 로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await postsApi.deleteCompanyPost(postId);
      console.log('Deleted post:', response.message);
      alert(response.message);
      // Redirect to posts list or refresh
      window.location.href = '/company/posts';
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific error cases based on the API spec
        if (err.status === 400) {
          // Bad request - check specific error messages
          if (err.data.error === 'Company not found') {
            setError('기업 정보를 찾을 수 없습니다.');
          } else if (err.data.error === 'Failed to delete company post') {
            setError('기업 공고 삭제에 실패했습니다.');
          } else {
            setError(err.data.error || '잘못된 요청입니다.');
          }
        } else if (err.status === 401) {
          // Not authenticated
          setError('인증이 필요합니다. 다시 로그인해주세요.');
          window.location.href = '/login';
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
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        {loading ? '삭제 중...' : '공고 삭제'}
      </button>
    </div>
  );
}

// ============================================================================
// Example 20: Using React Query mutation for deleting posts (Recommended)
// ============================================================================

export function useDeleteCompanyPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postsApi.deleteCompanyPost(postId),
    onSuccess: () => {
      // Invalidate and refetch company posts list after deletion
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error('Failed to delete post:', error.data.error, error.status);
      }
    },
  });
}

// Usage in component with React Query mutation
export function DeletePostWithReactQuery({ postId }: { postId: number }) {
  const deletePost = useDeleteCompanyPost();

  const handleDeletePost = async () => {
    if (!window.confirm('정말 이 공고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      if (!tokenManager.isTokenValid('company')) {
        alert('기업 로그인이 필요합니다.');
        return;
      }

      const response = await deletePost.mutateAsync(postId);
      console.log('Post deleted successfully:', response.message);
      alert('공고가 성공적으로 삭제되었습니다!');
      // Redirect to posts list
      window.location.href = '/company/posts';
    } catch (error) {
      // Error is already handled in mutation's onError
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      {deletePost.isPending && <div>삭제 중...</div>}
      {deletePost.isError && (
        <div style={{ color: 'red' }}>
          {deletePost.error instanceof ApiError
            ? deletePost.error.data.error
            : '공고 삭제에 실패했습니다.'}
        </div>
      )}
      <button
        onClick={handleDeletePost}
        disabled={deletePost.isPending}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        {deletePost.isPending ? '삭제 중...' : '공고 삭제'}
      </button>
    </div>
  );
}

// ============================================================================
// Example 21: Complete utility function for deleting with error handling
// ============================================================================

export async function deleteCompanyPostWithErrorHandling(postId: number) {
  try {
    // Validate token before making request
    if (!tokenManager.isTokenValid('company')) {
      return {
        success: false,
        message: null,
        error: '기업 인증이 필요합니다. 다시 로그인해주세요.',
        status: 401,
      };
    }

    const response = await postsApi.deleteCompanyPost(postId);

    return {
      success: true,
      message: response.message,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      switch (error.status) {
        case 400:
          if (error.data.error === 'Company not found') {
            errorMessage = '기업 정보를 찾을 수 없습니다.';
          } else if (error.data.error === 'Failed to delete company post') {
            errorMessage = '기업 공고 삭제에 실패했습니다.';
          } else {
            errorMessage = error.data.error || '잘못된 요청입니다.';
          }
          break;
        case 401:
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          // Auto-redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 500:
          errorMessage = error.data.error || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
      }

      return {
        success: false,
        message: null,
        error: errorMessage,
        status: error.status,
      };
    }

    return {
      success: false,
      message: null,
      error: '요청 처리 중 오류가 발생했습니다.',
      status: 0,
    };
  }
}

// ============================================================================
// Example 22: Quick test function for delete
// ============================================================================

export async function testDeleteCompanyPost(postId: number) {
  console.log(`Testing deleteCompanyPost API for post ID ${postId}...`);
  const result = await deleteCompanyPostWithErrorHandling(postId);

  if (result.success) {
    console.log('✅ Success!', result.message);
  } else {
    console.error('❌ Error:', result.error, `(Status: ${result.status})`);
  }

  return result;
}

// ============================================================================
// Example 23: Batch delete with confirmation
// ============================================================================

export async function deleteMultipleCompanyPosts(postIds: number[]) {
  const results = {
    success: [] as number[],
    failed: [] as { postId: number; error: string }[],
  };

  for (const postId of postIds) {
    const result = await deleteCompanyPostWithErrorHandling(postId);
    if (result.success) {
      results.success.push(postId);
    } else {
      results.failed.push({ postId, error: result.error || 'Unknown error' });
    }
  }

  return results;
}

// Usage example
export async function handleBatchDelete(selectedPostIds: number[]) {
  if (selectedPostIds.length === 0) {
    alert('삭제할 공고를 선택해주세요.');
    return;
  }

  const confirmMessage = `${selectedPostIds.length}개의 공고를 삭제하시겠습니까?`;
  if (!window.confirm(confirmMessage)) {
    return;
  }

  const results = await deleteMultipleCompanyPosts(selectedPostIds);

  if (results.failed.length === 0) {
    alert(`${results.success.length}개의 공고가 성공적으로 삭제되었습니다.`);
  } else {
    alert(
      `${results.success.length}개 성공, ${results.failed.length}개 실패\n실패한 공고: ${results.failed.map((f) => f.postId).join(', ')}`
    );
  }

  // Refresh the page or update the list
  window.location.reload();
}
