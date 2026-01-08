/**
 * Common API Types
 *
 * Shared types used across multiple API endpoints.
 * These types are domain-agnostic and reusable.
 */

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
}

/**
 * Language skill information
 * Used in profiles, resumes, and job postings
 */
export interface LanguageSkill {
  language_type?: string;
  level?: string;
}

/**
 * User information (basic identity)
 * Used in auth responses and profile references
 */
export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}
