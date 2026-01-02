import { apiClient } from './client';
import {
  CompanyPostsResponse,
  CreateCompanyPostRequest,
  CreateCompanyPostResponse,
  CompanyPostDetailResponse,
  UpdateCompanyPostRequest,
  UpdateCompanyPostResponse,
  DeleteCompanyPostResponse,
} from './types';

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
  // page를 skip으로 변환 (API는 skip을 사용)
  const skip = (page - 1) * limit;
  const url = `${API_BASE_URL}/posts/company/list?skip=${skip}&limit=${limit}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const res = await fetch(url, {
      cache: 'no-store', // 개발 중에는 캐시 비활성화
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[Server] Failed to fetch company posts:', {
        status: res.status,
        statusText: res.statusText,
        errorText,
        url,
      });
      return { company_posts: [], total: 0, page: 1, limit, total_pages: 0 };
    }

    const data = await res.json();
    // API 응답을 클라이언트 형식으로 변환
    return {
      ...data,
      page,
      total_pages: Math.ceil(data.total / limit),
    };
  } catch (error) {
    console.error('[Server] Error fetching company posts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      url,
    });
    return { company_posts: [], total: 0, page: 1, limit, total_pages: 0 };
  }
}

export const postsApi = {
  // 공개 API: 인증 없이 공고 목록 조회 (메인 페이지용)
  async getPublicCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    const page = params?.page || DEFAULT_PAGE;
    const limit = params?.limit || DEFAULT_LIMIT;
    // page를 skip으로 변환
    const skip = (page - 1) * limit;

    const queryParams = new URLSearchParams();
    queryParams.append('skip', skip.toString());
    queryParams.append('limit', limit.toString());

    const url = `/posts/company/list?${queryParams.toString()}`;

    const data = await apiClient.get<CompanyPostsResponse>(url, {
      skipAuth: true,
    });

    // API 응답을 클라이언트 형식으로 변환
    return {
      ...data,
      page,
      total_pages: Math.ceil(data.total / limit),
    };
  },

  // 인증 필요: 내 회사의 공고 목록만 조회 (기업 전용)
  async getMyCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    const page = params?.page || DEFAULT_PAGE;
    const limit = params?.limit || DEFAULT_LIMIT;
    // page를 skip으로 변환
    const skip = (page - 1) * limit;

    const queryParams = new URLSearchParams();
    queryParams.append('skip', skip.toString());
    queryParams.append('limit', limit.toString());

    const url = `/posts/company/list?${queryParams.toString()}`;

    const data = await apiClient.get<CompanyPostsResponse>(url);

    // API 응답을 클라이언트 형식으로 변환
    return {
      ...data,
      page,
      total_pages: Math.ceil(data.total / limit),
    };
  },

  // 공개 API: 공고 목록 조회 (deprecated - getPublicCompanyPosts 사용 권장)
  async getCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    return this.getPublicCompanyPosts(params);
  },

  async getCompanyPostById(companyPostId: number): Promise<CompanyPostDetailResponse> {
    return apiClient.get<CompanyPostDetailResponse>(
      `/posts/company/${companyPostId}`,
      {
        skipAuth: true,
      }
    );
  },

  async createCompanyPost(
    data: CreateCompanyPostRequest
  ): Promise<CreateCompanyPostResponse> {
    return apiClient.post<CreateCompanyPostResponse>(
      '/posts/company',
      data
    );
  },

  async updateCompanyPost(
    companyPostId: number,
    data: UpdateCompanyPostRequest
  ): Promise<UpdateCompanyPostResponse> {
    return apiClient.put<UpdateCompanyPostResponse>(
      `/posts/company/${companyPostId}`,
      data
    );
  },

  async deleteCompanyPost(companyPostId: number): Promise<DeleteCompanyPostResponse> {
    return apiClient.delete<DeleteCompanyPostResponse>(
      `/posts/company/${companyPostId}`
    );
  },
};
