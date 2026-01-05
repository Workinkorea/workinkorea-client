/**
 * Generic API Response Types
 *
 * Provides type-safe wrappers for all API responses
 */

import { TokenType } from './enums';

/**
 * Generic API Response
 * Use this for all API responses to ensure consistency
 *
 * @template T - The type of data returned in the response
 *
 * @example
 * type LoginResponse = ApiResponse<{
 *   token: string;
 *   user: UserInfo;
 * }>;
 */
export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * API Response with data
 */
export interface ApiDataResponse<T> extends ApiResponse<T> {
  data: T; // data is required for data responses
}

/**
 * Paginated API Response
 * Use this for paginated list endpoints
 *
 * @template T - The type of items in the list
 *
 * @example
 * type PostsResponse = ApiPaginatedResponse<CompanyPost>;
 */
export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  field?: string; // Field name for validation errors
  errors?: Record<string, string[]> | Record<string, string>; // Validation errors
}

/**
 * API Success Response (no data)
 */
export interface ApiSuccessResponse {
  success: true;
  message: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  token_type?: TokenType;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Upload Response
 */
export interface UploadResponse {
  success: boolean;
  file_url?: string;
  file_name?: string;
  message?: string;
}

/**
 * Presigned Upload Response
 */
export interface PresignedUploadResponse {
  url: string;
  fields: Record<string, string>;
  object_name: string;
  expires: string;
}

/**
 * Helper type to extract data from ApiResponse
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Helper type to make API response nullable
 */
export type NullableApiResponse<T> = ApiResponse<T | null>;
