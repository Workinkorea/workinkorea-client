import { fetchClient, fetchAPI } from '@/shared/api/fetchClient';
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

/**
 * Authentication API (HttpOnly Cookie 기반)
 *
 * 주요 변경사항:
 * - axios → fetch API로 전환
 * - localStorage 토큰 관리 제거
 * - HttpOnly Cookie 자동 전송 (credentials: 'include')
 * - 백엔드가 Set-Cookie 헤더로 토큰 관리
 */
export const authApi = {
  /**
   * 이메일 인증 코드 전송
   */
  async sendEmailVerification(email: string): Promise<EmailVerificationResponse> {
    return fetchClient.post<EmailVerificationResponse>(
      '/api/auth/email/certify',
      { email },
      { skipAuth: true }
    );
  },

  /**
   * 이메일 인증 코드 확인
   */
  async verifyEmailCode(email: string, code: string): Promise<EmailVerificationResponse> {
    return fetchClient.post<EmailVerificationResponse>(
      '/api/auth/email/certify/verify',
      { email, code },
      { skipAuth: true }
    );
  },

  /**
   * 일반 사용자 로그인
   *
   * HttpOnly Cookie 환경:
   * - 백엔드가 Set-Cookie 헤더로 accessToken, refreshToken 전송
   * - 응답 body의 token은 optional (legacy 지원)
   * - userType 쿠키도 함께 설정됨
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    return fetchClient.post<LoginResponse>(
      '/api/auth/login',
      data,
      { skipAuth: true }
    );
  },

  /**
   * 로그아웃
   *
   * HttpOnly Cookie 삭제:
   * - 백엔드가 Set-Cookie: accessToken=; Max-Age=0 으로 쿠키 삭제
   * - 클라이언트는 cookieManager.clearAuth()로 Public Cookie만 정리
   */
  async logout(): Promise<LogoutResponse> {
    return fetchClient.post<LogoutResponse>('/api/auth/logout');
  },

  /**
   * 일반 사용자 회원가입
   */
  async signup(data: SignupRequest): Promise<{ success: boolean; message?: string }> {
    return fetchClient.post('/api/auth/signup', data, { skipAuth: true });
  },

  /**
   * 기업 회원가입
   */
  async companySignup(data: CompanySignupRequest): Promise<CompanySignupResponse> {
    return fetchClient.post<CompanySignupResponse>(
      '/api/auth/company/signup',
      data,
      { skipAuth: true }
    );
  },

  /**
   * 기업 로그인
   *
   * OAuth2PasswordRequestForm 형식:
   * - Content-Type: application/x-www-form-urlencoded
   * - body: username=...&password=...
   */
  async companyLogin(data: CompanyLoginRequest): Promise<CompanyLoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return fetchAPI<CompanyLoginResponse>('/api/auth/company/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      skipAuth: true,
    });
  },

  /**
   * 토큰 갱신
   *
   * HttpOnly Cookie 환경:
   * - 요청 시 브라우저가 자동으로 refreshToken 쿠키 전송
   * - 응답 시 백엔드가 새로운 accessToken 쿠키 설정
   * - 클라이언트는 쿠키 저장 작업 불필요 (브라우저 자동 처리)
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    return fetchClient.post<RefreshTokenResponse>(
      '/api/auth/refresh',
      {},
      { skipAuth: true }
    );
  },

  /**
   * 사업자 등록번호 검증 (국세청 API)
   */
  async verifyBusinessNumber(businessNumber: string): Promise<BusinessVerificationResponse> {
    try {
      return await fetchClient.post<BusinessVerificationResponse>(
        '/api/auth/verify-business',
        { businessNumber }
      );
    } catch (error) {
      console.error('[authApi] Business verification error:', error);
      throw error;
    }
  },
};