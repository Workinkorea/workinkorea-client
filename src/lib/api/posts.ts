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

export const postsApi = {
  // 공개 API: 인증 없이 공고 목록 조회 (메인 페이지용)
  async getPublicCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/api/posts/company/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return apiClient.get<CompanyPostsResponse>(url, {
      skipAuth: true,
    });
  },

  // 인증 필요: 내 회사의 공고 목록만 조회 (기업 전용)
  async getMyCompanyPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<CompanyPostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/api/posts/company${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return apiClient.get<CompanyPostsResponse>(url);
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
      `/api/posts/company/${companyPostId}`,
      {
        skipAuth: true,
      }
    );
  },

  async createCompanyPost(
    data: CreateCompanyPostRequest
  ): Promise<CreateCompanyPostResponse> {
    return apiClient.post<CreateCompanyPostResponse>(
      '/api/posts/company',
      data
    );
  },

  async updateCompanyPost(
    companyPostId: number,
    data: UpdateCompanyPostRequest
  ): Promise<UpdateCompanyPostResponse> {
    return apiClient.put<UpdateCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`,
      data
    );
  },

  async deleteCompanyPost(companyPostId: number): Promise<DeleteCompanyPostResponse> {
    return apiClient.delete<DeleteCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`
    );
  },
};
