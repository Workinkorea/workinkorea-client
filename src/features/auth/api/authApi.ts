import { apiClient } from '@/shared/api/client';
import axios from 'axios';
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
  CompanyLoginResponse,
  BusinessVerificationResponse
} from '../types/auth.types';

export const authApi = {
  async sendEmailVerification(email: string): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/auth/email/certify', {email}, { skipAuth: true });
  },

  async verifyEmailCode(email: string, code: string): Promise<EmailVerificationResponse> {
    return apiClient.post<EmailVerificationResponse>('/auth/email/certify/verify', { email, code }, { skipAuth: true });
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data, {
      skipAuth: true,
      withCredentials: true
    });
  },

  async logout(): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/auth/logout');
  },

  async signup(data: SignupRequest) {
    return apiClient.post('/auth/signup', data, { skipAuth: true });
  },

  async companySignup(data: CompanySignupRequest): Promise<CompanySignupResponse> {
    return apiClient.post<CompanySignupResponse>('/auth/company/signup', data, { skipAuth: true });
  },

  async companyLogin(data: CompanyLoginRequest): Promise<CompanyLoginResponse> {
    // OAuth2PasswordRequestForm을 위한 form-urlencoded 형식으로 변환
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return apiClient.post<CompanyLoginResponse>('/auth/company/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
      skipAuth: true,
    });
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {}, {
      skipAuth: true,
      withCredentials: true
    });
  },

  async verifyBusinessNumber(businessNumber: string): Promise<BusinessVerificationResponse> {
    try {
      const response = await axios.post<BusinessVerificationResponse>(
        '/api/verify-business',
        { businessNumber },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Business verification error:', error);
      throw error;
    }
  },
};