import { apiClient } from './client';
import { CompanyPostsResponse } from './types';

export const postsApi = {
  async getCompanyPosts(): Promise<CompanyPostsResponse> {
    return apiClient.get<CompanyPostsResponse>('/api/posts/company', {
      tokenType: 'company',
    });
  },
};
