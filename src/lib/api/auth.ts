import { apiClient, refreshAccessToken } from './client';
import type {
  EmailVerificationResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  GetUserInfoResponse
} from './types';

export const authApi = {
  async sendEmailVerification(email: string[]): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/api/auth/email', { email });
  },

  async verifyEmailCode(email: string, code: string): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/api/auth/email/verify', { email, code });
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', data);
  },

  async logout(): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/api/auth/logout');
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const accessToken = await refreshAccessToken();
    return {
      success: true,
      accessToken
    };
  },

  async getUserInfo(): Promise<GetUserInfoResponse> {
    return apiClient.get<GetUserInfoResponse>('/api/auth/user');
  },
};