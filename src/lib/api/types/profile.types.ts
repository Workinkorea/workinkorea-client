/**
 * Profile API Types
 *
 * Types for user profiles, contact information, and account settings.
 */

import { LanguageSkill } from './common.types';

// ============================================================================
// User Profile
// ============================================================================

export interface ProfileResponse {
  user_id: number;
  profile_image_url: string;
  location: string;
  introduction: string;
  address: string;
  position_id: number;
  career: string;
  job_status: string;
  portfolio_url: string;
  language_skills: LanguageSkill[];
  birth_date: string;
  name: string;
  country_id: number;
  created_at: string;
}

export interface ProfileUpdateRequest {
  profile_image_url?: string;
  location?: string;
  introduction?: string;
  address?: string;
  position_id?: number;
  career?: string;
  job_status?: string;
  portfolio_url?: string;
  language_skills?: LanguageSkill[];
  name?: string;
  country_id?: number;
}

// ============================================================================
// Contact Information
// ============================================================================

export interface ContactResponse {
  user_id: number;
  phone_number: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
}

export interface ContactUpdateRequest {
  user_id?: number;
  phone_number?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

// ============================================================================
// Account Configuration
// ============================================================================

export interface AccountConfigResponse {
  user_id: number;
  sns_message_notice: boolean;
  email_notice: boolean;
}

export interface AccountConfigUpdateRequest {
  user_id?: number;
  sns_message_notice?: boolean;
  email_notice?: boolean;
}
