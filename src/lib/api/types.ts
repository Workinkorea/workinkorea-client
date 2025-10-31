export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

export interface GetUserInfoResponse {
  success: boolean;
  user: UserInfo;
}

export interface SignupRequest {
  email: string;
  name: string;
  birth_date: string;
  country_code: string;
}

export interface CompanySignupRequest {
  company_number: number;
  company_name: string;
  email: string;
  password: string;
  name: string;
  phone: number;
}

export interface CompanySignupResponse {
  success: boolean;
  message?: string;
}

export interface CompanyLoginRequest {
  email: string;
  password: string;
}

export interface CompanyLoginResponse {
  url: string; // 리다이렉트 URL (user_id, company_id, token 포함)
  // token은 accessToken이며, refreshToken은 httpOnly 쿠키로 관리됨
}