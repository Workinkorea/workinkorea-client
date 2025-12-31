import { apiClient } from './client';
import type {
  AdminUser,
  AdminCompany,
  AdminPost,
  UpdateAdminUserRequest,
  UpdateAdminCompanyRequest,
  UpdateAdminPostRequest,
} from './types';

export const adminApi = {
  // User management
  async getUsers(): Promise<AdminUser[]> {
    return apiClient.get<AdminUser[]>('/admin/users/');
  },

  async getUserById(userId: number): Promise<AdminUser> {
    return apiClient.get<AdminUser>(`/admin/users/${userId}`);
  },

  async updateUser(userId: number, data: UpdateAdminUserRequest): Promise<void> {
    return apiClient.put<void>(`/admin/users/${userId}`, data);
  },

  async deleteUser(userId: number): Promise<string> {
    return apiClient.delete<string>(`/admin/users/${userId}`);
  },

  // Company management
  async getCompanies(skip: number = 0, limit: number = 10): Promise<AdminCompany[]> {
    return apiClient.get<AdminCompany[]>(`/admin/companies/?skip=${skip}&limit=${limit}`);
  },

  async getCompanyById(companyId: number): Promise<AdminCompany> {
    return apiClient.get<AdminCompany>(`/admin/companies/${companyId}`);
  },

  async updateCompany(companyId: number, data: UpdateAdminCompanyRequest): Promise<AdminCompany> {
    return apiClient.put<AdminCompany>(`/admin/companies/${companyId}`, data);
  },

  async deleteCompany(companyId: number): Promise<string> {
    return apiClient.delete<string>(`/admin/companies/${companyId}`);
  },

  // Job posts management
  async getPosts(skip: number = 0, limit: number = 10): Promise<AdminPost[]> {
    return apiClient.get<AdminPost[]>(`/admin/posts/?skip=${skip}&limit=${limit}`);
  },

  async getPostById(postId: number): Promise<AdminPost> {
    return apiClient.get<AdminPost>(`/admin/posts/${postId}`);
  },

  async updatePost(postId: number, data: UpdateAdminPostRequest): Promise<AdminPost> {
    return apiClient.put<AdminPost>(`/admin/posts/${postId}`, data);
  },

  async deletePost(postId: number): Promise<string> {
    return apiClient.delete<string>(`/admin/posts/${postId}`);
  },
};
