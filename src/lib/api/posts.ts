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
