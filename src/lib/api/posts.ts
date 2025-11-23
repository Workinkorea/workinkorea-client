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
  async getPublicCompanyPosts(): Promise<CompanyPostsResponse> {
    return apiClient.get<CompanyPostsResponse>('/api/posts/company', {
      skipAuth: true,
    });
  },

  // 인증 필요: 기업 회원 전용 공고 목록 조회
  async getCompanyPosts(): Promise<CompanyPostsResponse> {
    return apiClient.get<CompanyPostsResponse>('/api/posts/company', {
      tokenType: 'company',
    });
  },

  async getCompanyPostById(companyPostId: number): Promise<CompanyPostDetailResponse> {
    return apiClient.get<CompanyPostDetailResponse>(
      `/api/posts/company/${companyPostId}`,
      {
        tokenType: 'company',
      }
    );
  },

  async createCompanyPost(
    data: CreateCompanyPostRequest
  ): Promise<CreateCompanyPostResponse> {
    return apiClient.post<CreateCompanyPostResponse>(
      '/api/posts/company',
      data,
      {
        tokenType: 'company',
      }
    );
  },

  async updateCompanyPost(
    companyPostId: number,
    data: UpdateCompanyPostRequest
  ): Promise<UpdateCompanyPostResponse> {
    return apiClient.put<UpdateCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`,
      data,
      {
        tokenType: 'company',
      }
    );
  },

  async deleteCompanyPost(companyPostId: number): Promise<DeleteCompanyPostResponse> {
    return apiClient.delete<DeleteCompanyPostResponse>(
      `/api/posts/company/${companyPostId}`,
      {
        tokenType: 'company',
      }
    );
  },
};
