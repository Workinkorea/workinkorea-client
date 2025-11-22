import { apiClient, refreshAccessToken } from './client';
import type {
  EmailVerificationResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  SignupRequest,
  CompanySignupRequest,
  CompanySignupResponse,
  CompanyLoginRequest,
  CompanyLoginResponse
} from './types';

export const authApi = {
  async sendEmailVerification(email: string): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/api/auth/email/certify', {email}, { skipAuth: true });
  },

  async verifyEmailCode(email: string, code: string): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/api/auth/email/certify/verify', { email, code }, { skipAuth: true });
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', data, {
      skipAuth: true,
      credentials: 'include'
    });
  },

  async logout(): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/api/auth/logout');
  },

  async signup(data: SignupRequest) {
    return apiClient.post('/api/auth/signup', data, { skipAuth: true });
  },

  async companySignup(data: CompanySignupRequest): Promise<CompanySignupResponse> {
    return apiClient.post<CompanySignupResponse>('/api/auth/company/signup', data, { skipAuth: true });
  },

  async companyLogin(data: CompanyLoginRequest): Promise<CompanyLoginResponse> {
    // OAuth2PasswordRequestForm을 위한 form-urlencoded 형식으로 변환
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return apiClient.request<CompanyLoginResponse>('/api/auth/company/login', {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // httpOnly 쿠키로 refreshToken 받기 위해 필요
      skipAuth: true,
    });
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const accessToken = await refreshAccessToken();
    return {
      success: true,
      accessToken
    };
  },
};