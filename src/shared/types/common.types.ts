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
  id?: string; // Server definition does not have ID in ProfileResponse, but maybe implicitly handled? Let's check Schema. ProfileResponse has name, email... No email?
  // ProfileResponse: name, birth_date, country_id, created_at, etc.
  // ProfileResponse schema from server analysis DOES NOT have email or id!
  // It has name, profile_image_url, etc.
  // This might be an issue. Let's assume for now we just need it for "truthy" check.
  name?: string;
  profileImage?: string;
  // Adding fields from server schema
  birth_date?: string;
  country_id?: number;
  created_at?: string;
}
