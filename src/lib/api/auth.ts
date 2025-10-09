import { apiClient } from './client';
import { authClient } from './authClient';
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
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },

  async getUserInfo(): Promise<GetUserInfoResponse> {
    return authClient.get<GetUserInfoResponse>('/auth/user');
  },
};