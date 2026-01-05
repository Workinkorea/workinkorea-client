/**
 * API Types Index
 *
 * Central export point for all API types.
 * Gradually migrating types from monolithic ../types.ts into organized files.
 *
 * @example
 * // New imports (use these for new code):
 * import { LoginRequest, ProfileResponse } from '@/lib/api/types';
 *
 * // Old imports (still work, being migrated):
 * import { LoginRequest } from '@/lib/api/types.ts';
 */

// ============================================================================
// Phase 1: Core types (MIGRATED) ✅
// ============================================================================

// Common types (shared across all domains)
export * from './common.types';

// Authentication & authorization
export * from './auth.types';

// User profiles & settings
export * from './profile.types';

// ============================================================================
// Phase 2: Domain types (TODO) 🚧
// ============================================================================

// TODO: Create these files to complete migration:
//
// - company.types.ts
//   - CompanyProfileResponse, CompanyProfileRequest
//   - CompanyPost, CompanyPostsResponse
//   - Create/Update/Delete CompanyPost operations
//
// - resume.types.ts
//   - ResumeDetail, ResumeListItem, ResumeListResponse
//   - School, CareerHistory, Introduction, License
//   - Create/Update Resume operations
//
// - admin.types.ts
//   - AdminUser, AdminCompany, AdminPost
//   - Update operations for admin entities
//
// - diagnosis.types.ts
//   - DiagnosisAnswerRequest, DiagnosisAnswerResponse
//
// - minio.types.ts
//   - UploadUserImageRequest, PresignedPostResponse
//   - File upload operations

// ============================================================================
// Temporary: Re-export remaining types from old file
// ============================================================================
//
// These types are still in the monolithic ../types.ts file.
// As we create the files above, remove the corresponding exports from types.ts
// and import them from the new files instead.

export type {
  // Company types (to be moved to company.types.ts)
  CompanyProfileResponse,
  CompanyProfileRequest,
  CompanyPost,
  CompanyPostsResponse,
  CreateCompanyPostRequest,
  CreateCompanyPostResponse,
  CompanyPostDetailResponse,
  UpdateCompanyPostRequest,
  UpdateCompanyPostResponse,
  DeleteCompanyPostResponse,

  // Resume types (to be moved to resume.types.ts)
  ResumeDetail,
  ResumeListItem,
  ResumeListResponse,
  School,
  CareerHistory,
  Introduction,
  License,
  CreateResumeRequest,
  UpdateResumeRequest,
  UploadResumeFileResponse,
  UploadResumeImageResponse,

  // Admin types (to be moved to admin.types.ts)
  AdminUser,
  AdminCompany,
  AdminPost,
  UpdateAdminUserRequest,
  UpdateAdminCompanyRequest,
  UpdateAdminPostRequest,

  // Diagnosis types (to be moved to diagnosis.types.ts)
  DiagnosisAnswerRequest,
  DiagnosisAnswerResponse,

  // Minio types (to be moved to minio.types.ts)
  UploadUserImageRequest,
  PresignedPostResponse,
  UploadUserImageResponse,
} from '../types';

// ============================================================================
// Migration Guide
// ============================================================================
//
// 1. Create new type file (e.g., company.types.ts)
// 2. Move relevant types from ../types.ts to new file
// 3. Add proper JSDoc comments and organization
// 4. Import and re-export from this index.ts
// 5. Remove from ../types.ts
// 6. Update the "Temporary" section above
//
// See auth.types.ts and profile.types.ts for examples of good organization!
