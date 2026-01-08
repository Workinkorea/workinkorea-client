import { cookies } from 'next/headers';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * 서버 컴포넌트에서 사용할 API 클라이언트를 생성합니다.
 * cookies()에서 accessToken을 읽어 Authorization 헤더에 자동으로 추가합니다.
 */
export async function createServerApiClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
      ...(token && { Authorization: `Bearer ${token.value}` }),
    },
  });
}

/**
 * 서버 컴포넌트에서 사용할 admin API
 */
export async function createServerAdminApi() {
  const client = await createServerApiClient();

  return {
    async getUsers(skip: number = 0, limit: number = 10) {
      const response = await client.get(`/api/admin/users/?skip=${skip}&limit=${limit}`);
      return response.data;
    },

    async getCompanies(skip: number = 0, limit: number = 10) {
      const response = await client.get(`/api/admin/companies/?skip=${skip}&limit=${limit}`);
      return response.data;
    },

    async getPosts(skip: number = 0, limit: number = 10) {
      const response = await client.get(`/api/admin/posts/?skip=${skip}&limit=${limit}`);
      return response.data;
    },

    async getProfile() {
      const response = await client.get('/api/users/profile/');
      return response.data;
    },

    async getCompanyPosts(page: number = 1, limit: number = 12) {
      const response = await client.get(`/api/posts/company/?page=${page}&limit=${limit}`);
      return response.data;
    },

    async getPostById(id: string) {
      const response = await client.get(`/api/posts/company/${id}`);
      return response.data;
    },
  };
}
