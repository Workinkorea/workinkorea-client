/**
 * Authentication API Types
 *
 * Types for login, signup, token management, and verification.
 */

import { UserInfo } from './common.types';

// ============================================================================
// Email Verification
// ============================================================================

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Individual User Authentication
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  token_type?: 'access' | 'access_company' | 'admin_access';
  user?: {
    id: string;
    email: string;
  };
}

export interface SignupRequest {
  email: string;
  name: string;
  birth_date: string;
  country_code: string;
}

// ============================================================================
// Company Authentication
// ============================================================================

export interface CompanyLoginRequest {
  username: string;
  password: string;
}

export interface CompanyLoginResponse {
  url: string;
  access_token?: string;
  token_type?: 'access' | 'access_company' | 'admin_access';
}

export interface CompanySignupRequest {
  company_number: string;
  company_name: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface CompanySignupResponse {
  success: boolean;
  message?: string;
}

// ============================================================================
// Business Verification (National Tax Service)
// ============================================================================

export interface BusinessVerificationRequest {
  b_no: string[];
}

export interface BusinessVerificationData {
  b_no: string;
  b_stt: string;
  b_stt_cd: string;
  tax_type: string;
  tax_type_cd: string;
  end_dt: string;
  utcc_yn: string;
  tax_type_change_dt: string;
  invoice_apply_dt: string;
  rbf_tax_type: string;
  rbf_tax_type_cd: string;
}

export interface BusinessVerificationResponse {
  status_code: string;
  match_cnt: number;
  request_cnt: number;
  data: BusinessVerificationData[];
}

// ============================================================================
// Token Management
// ============================================================================

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  token_type?: 'access' | 'access_company' | 'admin_access';
}

export interface GetUserInfoResponse {
  success: boolean;
  user: UserInfo;
}
