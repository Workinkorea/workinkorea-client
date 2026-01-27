import { fetchClient, fetchAPI, API_BASE_URL, SERVER_API_URL } from '@/shared/api/fetchClient';
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
import { UserInfo } from '@/shared/types/common.types';

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
   * 일반 사용자 로그인 (Google OAuth)
   *
   * 서버는 일반 사용자에게 Google OAuth만 제공합니다.
   * Google 로그인은 window.location.href로 직접 이동합니다.
   *
   * @deprecated 일반 사용자는 이메일/비밀번호 로그인을 지원하지 않습니다.
   * 대신 `${API_BASE_URL}/api/auth/login/google`로 리다이렉트하세요.
   */

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
   * 서버 응답 형식:
   * - 200: { "url": "/company" } (성공)
   * - 401: { "url": "/company-login" } (인증 실패)
   * - 500: { "url": "/company-login" } (서버 오류)
   *
   * 모든 상태 코드에서 JSON 응답을 받아 url을 추출합니다.
   *
   * OAuth2PasswordRequestForm 형식:
   * - Content-Type: application/x-www-form-urlencoded
   * - body: username=...&password=...
   */
  async companyLogin(data: CompanyLoginRequest): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const isServer = typeof window === 'undefined';
    const baseURL = isServer ? SERVER_API_URL : API_BASE_URL;
    const requestUrl = `${baseURL}/api/auth/company/login`;

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    const responseData = await response.json() as CompanyLoginResponse;

    if (responseData && responseData.url) {
      return responseData.url;
    }

    throw new Error('로그인 응답에 url이 없습니다.');
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
    return fetchClient.post<BusinessVerificationResponse>(
      '/api/verify-business',
      { businessNumber }
    );
  },
  /**
   * 사용자 프로필 조회 (인증 상태 확인용)
   * 
   * HttpOnly Cookie(access_token)가 유효한지 확인하고
   * 유저 정보를 반환합니다.
   */
  async getProfile(): Promise<UserInfo> {
    return fetchClient.get<UserInfo>('/api/me');
  },
};