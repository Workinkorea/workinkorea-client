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
  username: string;
  password: string;
}

export interface CompanyLoginResponse {
  url: string; // 리다이렉트 URL (user_id, company_id, token 포함)
  // token은 accessToken이며, refreshToken은 httpOnly 쿠키로 관리됨
}

export interface ProfileResponse {
  profile_image_url: string;
  location: string;
  introduction: string;
  position_id: number;
  job_status: string;
  portfolio_url: string;
  birth_date: string;
  name: string;
  country_id: number;
}

export interface ProfileUpdateRequest {
  profile_image_url?: string;
  location?: string;
  introduction?: string;
  position_id?: number;
  job_status?: string;
  portfolio_url?: string;
  birth_date?: string;
  name?: string;
  country_id?: number;
}

export interface CompanyProfileResponse {
  company_id: number;
  industry_type: string;
  employee_count: number;
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: number;
  address: string;
  website_url: string;
  email: string;
}

export interface ApiErrorResponse {
  error: string;
}