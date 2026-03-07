import { apiClient, API_BASE_URL } from './api-client';
import type { CompanyLoginRequest } from '../types/api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    email: string;
  };
  company?: {
    id: number;
    company_name: string;
  };
}

/**
 * 기업 로그인
 * @param credentials - 기업 로그인 정보 (username, password)
 * @returns Access Token
 */
export async function loginAsCompany(
  credentials: CompanyLoginRequest
): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await apiClient.post<LoginResponse>(
    '/api/auth/company/login',
    formData,
    { isFormData: true }
  );

  const accessToken = response.access_token;
  apiClient.setAccessToken(accessToken);

  return accessToken;
}

/**
 * 관리자 로그인 (Admin API용)
 * @param adminEmail - 관리자 이메일
 * @param adminPassword - 관리자 비밀번호
 * @returns Admin Bearer Token
 */
export async function loginAsAdmin(
  adminEmail: string,
  adminPassword: string
): Promise<string> {
  // Admin API는 별도의 로그인 엔드포인트가 있다고 가정
  // 실제 엔드포인트는 백엔드 명세에 따라 수정 필요
  const formData = new URLSearchParams();
  formData.append('username', adminEmail);
  formData.append('password', adminPassword);

  const response = await apiClient.post<LoginResponse>(
    '/api/admin/login',
    formData,
    { isFormData: true }
  );

  const adminToken = response.access_token;
  apiClient.setAdminToken(adminToken);

  return adminToken;
}

/**
 * Google OAuth 로그인 시작
 * @returns Google OAuth URL
 */
export function getGoogleOAuthUrl(): string {
  return `${API_BASE_URL}/api/auth/login/google`;
}

/**
 * Access Token 갱신
 * @returns 새로운 Access Token
 */
export async function refreshAccessToken(): Promise<string> {
  const response = await apiClient.post<LoginResponse>('/api/auth/refresh');
  const newAccessToken = response.access_token;

  apiClient.setAccessToken(newAccessToken);
  return newAccessToken;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.delete('/api/auth/logout');
  } finally {
    apiClient.clearTokens();
  }
}

/**
 * 인증 상태 초기화 (테스트 간 격리를 위해)
 */
export function clearAuth(): void {
  apiClient.clearTokens();
}

/**
 * 테스트용 임시 토큰 설정
 * @param token - Access Token
 */
export function setTestToken(token: string): void {
  apiClient.setAccessToken(token);
}

/**
 * 테스트용 임시 Admin 토큰 설정
 * @param token - Admin Token
 */
export function setTestAdminToken(token: string): void {
  apiClient.setAdminToken(token);
}
