import { fetchClient } from '@/shared/api/fetchClient';
import type {
  AdminUser,
  AdminCompany,
  AdminPost,
  UpdateAdminUserRequest,
  UpdateAdminCompanyRequest,
  UpdateAdminPostRequest,
} from '@/shared/types/api';

export const adminApi = {
  // User management
  /**
   * 사용자 목록을 조회합니다. (관리자 전용)
   * @param skip - 건너뛸 레코드 수
   * @param limit - 조회할 최대 레코드 수
   * @returns 사용자 목록
   */
  async getUsers(skip: number = 0, limit: number = 10): Promise<AdminUser[]> {
    return fetchClient.get<AdminUser[]>(`/api/admin/users/?skip=${skip}&limit=${limit}`);
  },

  /**
   * 특정 사용자의 상세 정보를 조회합니다. (관리자 전용)
   * @param userId - 조회할 사용자 ID
   * @returns 사용자 상세 정보
   */
  async getUserById(userId: number): Promise<AdminUser> {
    return fetchClient.get<AdminUser>(`/api/admin/users/${userId}`);
  },

  /**
   * 사용자 정보를 업데이트합니다. (관리자 전용)
   * @param userId - 업데이트할 사용자 ID
   * @param data - 업데이트할 사용자 정보
   */
  async updateUser(userId: number, data: UpdateAdminUserRequest): Promise<void> {
    return fetchClient.put<void>(`/api/admin/users/${userId}`, data);
  },

  /**
   * 사용자를 삭제합니다. (관리자 전용)
   * @param userId - 삭제할 사용자 ID
   * @returns 성공 메시지
   */
  async deleteUser(userId: number): Promise<string> {
    return fetchClient.delete<string>(`/api/admin/users/${userId}`);
  },

  // Company management
  /**
   * 기업 목록을 조회합니다. (관리자 전용)
   * @param skip - 건너뛸 레코드 수
   * @param limit - 조회할 최대 레코드 수
   * @returns 기업 목록
   */
  async getCompanies(skip: number = 0, limit: number = 10): Promise<AdminCompany[]> {
    return fetchClient.get<AdminCompany[]>(`/api/admin/companies/?skip=${skip}&limit=${limit}`);
  },

  /**
   * 특정 기업의 상세 정보를 조회합니다. (관리자 전용)
   * @param companyId - 조회할 기업 ID
   * @returns 기업 상세 정보
   */
  async getCompanyById(companyId: number): Promise<AdminCompany> {
    return fetchClient.get<AdminCompany>(`/api/admin/companies/${companyId}`);
  },

  /**
   * 기업 정보를 업데이트합니다. (관리자 전용)
   * @param companyId - 업데이트할 기업 ID
   * @param data - 업데이트할 기업 정보
   * @returns 업데이트된 기업 정보
   */
  async updateCompany(companyId: number, data: UpdateAdminCompanyRequest): Promise<AdminCompany> {
    return fetchClient.put<AdminCompany>(`/api/admin/companies/${companyId}`, data);
  },

  /**
   * 기업을 삭제합니다. (관리자 전용)
   * @param companyId - 삭제할 기업 ID
   * @returns 성공 메시지
   */
  async deleteCompany(companyId: number): Promise<string> {
    return fetchClient.delete<string>(`/api/admin/companies/${companyId}`);
  },

  // Job posts management
  /**
   * 채용 공고 목록을 조회합니다. (관리자 전용)
   * @param skip - 건너뛸 레코드 수
   * @param limit - 조회할 최대 레코드 수
   * @returns 채용 공고 목록
   */
  async getPosts(skip: number = 0, limit: number = 10): Promise<AdminPost[]> {
    return fetchClient.get<AdminPost[]>(`/api/admin/posts/?skip=${skip}&limit=${limit}`);
  },

  /**
   * 특정 채용 공고의 상세 정보를 조회합니다. (관리자 전용)
   * @param postId - 조회할 채용 공고 ID
   * @returns 채용 공고 상세 정보
   */
  async getPostById(postId: number): Promise<AdminPost> {
    return fetchClient.get<AdminPost>(`/api/admin/posts/${postId}`);
  },

  /**
   * 채용 공고 정보를 업데이트합니다. (관리자 전용)
   * @param postId - 업데이트할 채용 공고 ID
   * @param data - 업데이트할 채용 공고 정보
   * @returns 업데이트된 채용 공고 정보
   */
  async updatePost(postId: number, data: UpdateAdminPostRequest): Promise<AdminPost> {
    return fetchClient.put<AdminPost>(`/api/admin/posts/${postId}`, data);
  },

  /**
   * 채용 공고를 삭제합니다. (관리자 전용)
   * @param postId - 삭제할 채용 공고 ID
   * @returns 성공 메시지
   */
  async deletePost(postId: number): Promise<string> {
    return fetchClient.delete<string>(`/api/admin/posts/${postId}`);
  },
};
