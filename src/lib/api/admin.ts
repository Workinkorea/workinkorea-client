import { apiClient } from './client';
import type {
  ProfileResponse,
  ContactResponse,
  CompanyProfileResponse,
  CompanyPost,
  UpdateCompanyPostRequest,
  DeleteCompanyPostResponse,
} from './types';

// Admin-specific types
export interface AdminUser {
  id: number;
  email: string;
  name: string;
  birth_date: string;
  country_code: string;
  created_at: string;
  profile?: ProfileResponse;
  contact?: ContactResponse;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface AdminCompany {
  id: number;
  company_number: string;
  company_name: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  profile?: CompanyProfileResponse;
}

export interface AdminCompaniesResponse {
  companies: AdminCompany[];
  total: number;
}

export interface AdminPostsResponse {
  posts: CompanyPost[];
  total: number;
}

export interface UpdateUserRequest {
  name?: string;
  birth_date?: string;
  country_code?: string;
}

export interface UpdateCompanyRequest {
  company_name?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export const adminApi = {
  // User management
  async getUsers(page: number = 1, limit: number = 10): Promise<AdminUsersResponse> {
    return apiClient.get<AdminUsersResponse>(`/api/admin/users?page=${page}&limit=${limit}`);
  },

  async getUserById(userId: number): Promise<AdminUser> {
    return apiClient.get<AdminUser>(`/api/admin/users/${userId}`);
  },

  async updateUser(userId: number, data: UpdateUserRequest): Promise<AdminUser> {
    return apiClient.put<AdminUser>(`/api/admin/users/${userId}`, data);
  },

  async deleteUser(userId: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/users/${userId}`);
  },

  async createUser(data: {
    email: string;
    name: string;
    birth_date: string;
    country_code: string;
  }): Promise<AdminUser> {
    return apiClient.post<AdminUser>('/api/admin/users', data);
  },

  // Company management
  async getCompanies(page: number = 1, limit: number = 10): Promise<AdminCompaniesResponse> {
    return apiClient.get<AdminCompaniesResponse>(`/api/admin/companies?page=${page}&limit=${limit}`);
  },

  async getCompanyById(companyId: number): Promise<AdminCompany> {
    return apiClient.get<AdminCompany>(`/api/admin/companies/${companyId}`);
  },

  async updateCompany(companyId: number, data: UpdateCompanyRequest): Promise<AdminCompany> {
    return apiClient.put<AdminCompany>(`/api/admin/companies/${companyId}`, data);
  },

  async deleteCompany(companyId: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/companies/${companyId}`);
  },

  async createCompany(data: {
    company_number: string;
    company_name: string;
    email: string;
    name: string;
    phone: string;
  }): Promise<AdminCompany> {
    return apiClient.post<AdminCompany>('/api/admin/companies', data);
  },

  // Job posts management (Read, Update, Delete only - no Create)
  async getPosts(page: number = 1, limit: number = 10): Promise<AdminPostsResponse> {
    return apiClient.get<AdminPostsResponse>(`/api/admin/posts?page=${page}&limit=${limit}`);
  },

  async getPostById(postId: number): Promise<CompanyPost> {
    return apiClient.get<CompanyPost>(`/api/admin/posts/${postId}`);
  },

  async updatePost(postId: number, data: UpdateCompanyPostRequest): Promise<CompanyPost> {
    return apiClient.put<CompanyPost>(`/api/admin/posts/${postId}`, data);
  },

  async deletePost(postId: number): Promise<DeleteCompanyPostResponse> {
    return apiClient.delete<DeleteCompanyPostResponse>(`/api/admin/posts/${postId}`);
  },
};
