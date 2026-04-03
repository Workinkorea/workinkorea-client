// ============================================================
// API Types — 실제 FastAPI 서버 Pydantic 모델 기반 (자동 생성)
// 서버 코드: /Users/apple/Documents/GitHub/workinkorea-server-dev
// ============================================================

// ─────────────────────────────────────────
// 공통
// ─────────────────────────────────────────

export interface ApiErrorResponse {
  error: string;
}

// ─────────────────────────────────────────
// Auth
// ─────────────────────────────────────────

/** POST /api/auth/signup */
export interface SignupRequest {
  email: string;
  name: string;
  /** ISO date string "YYYY-MM-DD" */
  birth_date: string;
  country_code: string;
}

/** POST /api/auth/company/signup */
export interface CompanySignupRequest {
  company_number: string;
  company_name: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface CompanySignupResponse {
  url: string;
}

/**
 * POST /api/auth/company/login
 * 서버는 OAuth2PasswordRequestForm을 사용하므로
 * Content-Type: application/x-www-form-urlencoded 필요
 * username 필드가 email 역할을 함
 */
export interface CompanyLoginRequest {
  username: string;
  password: string;
}

export interface CompanyLoginResponse {
  url: string;
}

/** DELETE /api/auth/logout */
export interface LogoutResponse {
  message: string;
}

/** POST /api/auth/refresh */
export interface RefreshTokenResponse {
  success: boolean;
  user_type: 'user' | 'company' | 'admin';
}

/** POST /api/auth/email/certify */
export interface EmailCertifyRequest {
  email: string;
}

export interface EmailCertifyResponse {
  message: string;
}

/** POST /api/auth/email/certify/verify */
export interface EmailCertifyVerifyRequest {
  email: string;
  code: string;
}

export interface EmailCertifyVerifyResponse {
  message: string;
}

// ─────────────────────────────────────────
// Profile — GET/PATCH /api/me
// ─────────────────────────────────────────

export interface LanguageSkill {
  language_type?: string;
  level?: string;
}

export interface ProfileResponse {
  profile_image_url?: string | null;
  location?: string | null;
  introduction?: string | null;
  address?: string | null;
  position_id?: number | null;
  career?: string | null;
  job_status?: string | null;
  portfolio_url?: string | null;
  language_skills?: LanguageSkill[] | null;
  /** ISO date string "YYYY-MM-DD" */
  birth_date: string;
  name: string;
  country_id: number;
  /** ISO datetime string */
  created_at: string;
}

/** PATCH /api/me — 미포함 필드는 기존 값 유지 */
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

// ─────────────────────────────────────────
// Contact — GET/PATCH /api/contact
// ─────────────────────────────────────────

export interface ContactResponse {
  user_id: number;
  phone_number?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
}

/** PATCH /api/contact */
export interface ContactUpdateRequest {
  phone_number?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

// ─────────────────────────────────────────
// Account Config — GET/PATCH /api/account-config
// ─────────────────────────────────────────

export interface AccountConfigResponse {
  user_id: number;
  sns_message_notice: boolean;
  email_notice: boolean;
}

/** PATCH /api/account-config */
export interface AccountConfigUpdateRequest {
  sns_message_notice?: boolean;
  email_notice?: boolean;
}

// ─────────────────────────────────────────
// Company Profile — GET/POST/PUT /api/company-profile
// ─────────────────────────────────────────

export interface CompanyProfileResponse {
  company_id: number;
  industry_type: string;
  employee_count: number;
  /** ISO date string "YYYY-MM-DD" */
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  address: string;
  website_url: string;
  email: string;
}

/** POST/PUT /api/company-profile */
export interface CompanyProfileRequest {
  industry_type: string;
  employee_count: number;
  /** ISO date string "YYYY-MM-DD" */
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  address: string;
  website_url: string;
  email: string;
}

// ─────────────────────────────────────────
// Company Posts — /api/posts/company
// ─────────────────────────────────────────

export interface CompanyPost {
  id: number;
  company_id: number;
  title: string;
  content: string;
  work_experience: string;
  position_id: number;
  education: string;
  language: string;
  employment_type: string;
  work_location: string;
  working_hours: number;
  salary: number;
  /** ISO datetime string */
  start_date: string;
  /** ISO datetime string */
  end_date: string;
}

/**
 * GET /api/posts/company/list 응답
 * skip, limit 쿼리 파라미터 지원
 */
export interface CompanyPostListResponse {
  company_posts: CompanyPost[];
  pagination: {
    skip: number;
    limit: number;
    count: number;
  };
}

/**
 * GET /api/posts/company 응답 (회사 인증 필요)
 */
export interface MyCompanyPostsResponse {
  company_posts: CompanyPost[];
}

/** POST/PUT /api/posts/company — 모든 필드 필수 */
export interface CompanyPostRequest {
  title: string;
  content: string;
  work_experience: string;
  position_id: number;
  education: string;
  language: string;
  employment_type: string;
  work_location: string;
  working_hours: number;
  salary: number;
  /** ISO datetime string */
  start_date: string;
  /** ISO datetime string */
  end_date: string;
}

// ─────────────────────────────────────────
// Resume — /api/posts/resume
// ─────────────────────────────────────────

export interface ResumeListItem {
  id: number;
  title: string;
  /** ISO datetime string */
  created_at: string;
  /** ISO datetime string */
  updated_at: string;
}

export interface School {
  school_name: string;
  major_name: string;
  /** ISO datetime string */
  start_date: string;
  /** ISO datetime string */
  end_date?: string | null;
  is_graduated: boolean;
}

export interface CareerHistory {
  company_name: string;
  /** ISO datetime string */
  start_date: string;
  /** ISO datetime string */
  end_date?: string | null;
  is_working: boolean;
  department?: string | null;
  position_title?: string | null;
  main_role?: string | null;
}

export interface Introduction {
  title: string;
  content?: string | null;
}

export interface License {
  license_name?: string | null;
  license_agency?: string | null;
  /** ISO datetime string */
  license_date?: string | null;
}

export interface ResumeDetail {
  id: number;
  user_id: number;
  title: string;
  profile_url?: string | null;
  language_skills?: LanguageSkill[] | null;
  schools?: School[] | null;
  career_history?: CareerHistory[] | null;
  introduction?: Introduction[] | null;
  licenses?: License[] | null;
}

/** GET /api/posts/resume/list/me */
export interface ResumeListResponse {
  resume_list: ResumeListItem[];
}

/** GET /api/posts/resume/{id} */
export interface ResumeDetailResponse {
  resume: ResumeDetail;
}

/** POST/PUT /api/posts/resume */
export interface ResumeRequest {
  title: string;
  profile_url?: string;
  language_skills?: LanguageSkill[];
  schools?: School[];
  career_history?: CareerHistory[];
  introduction?: Introduction[];
  licenses?: License[];
}

/** POST/PUT /api/posts/resume 응답 */
export interface ResumeUpsertResponse {
  resume_id: number;
}

// ─────────────────────────────────────────
// Diagnosis — /api/diagnosis
// ─────────────────────────────────────────

/** POST /api/diagnosis/answer */
export interface DiagnosisAnswerRequest {
  total_score: number;
  q1_answer?: string;
  q2_answer?: string;
  q3_answer?: string;
  q4_answer?: string;
  q5_answer?: string;
  q6_answer?: string;
  q7_answer?: string;
  q8_answer?: string;
  q9_answer?: string;
  q10_answer?: string;
  q11_answer?: string;
  q12_answer?: string;
  q13_answer?: string;
  q14_answer?: string;
  q15_answer?: string;
}

/** GET /api/diagnosis/answer/{id} */
export interface DiagnosisAnswerResponse {
  id: number;
  total_score: number;
  q1_answer?: string;
  q2_answer?: string;
  q3_answer?: string;
  q4_answer?: string;
  q5_answer?: string;
  q6_answer?: string;
  q7_answer?: string;
  q8_answer?: string;
  q9_answer?: string;
  q10_answer?: string;
  q11_answer?: string;
  q12_answer?: string;
  q13_answer?: string;
  q14_answer?: string;
  q15_answer?: string;
}

// ─────────────────────────────────────────
// Admin — /api/admin (Admin 토큰 필요)
// ─────────────────────────────────────────

export interface AdminUser {
  id: number;
  email: string;
  passport_certi: boolean;
}

/** PUT /api/admin/users/{id} */
export interface UpdateAdminUserRequest {
  passport_certi?: boolean;
}

export interface AdminCompany {
  id: number;
  company_number: string;
  company_name: string;
}

/** PUT /api/admin/companies/{id} */
export interface UpdateAdminCompanyRequest {
  company_name: string;
}

export interface AdminPost {
  id: number;
  company_id: number;
  title: string;
  content: string;
  work_experience: string;
  position_id: number;
  education: string;
  language: string;
  employment_type: string;
  work_location: string;
  working_hours: number;
  salary: number;
  /** ISO datetime string */
  start_date: string;
  /** ISO datetime string */
  end_date: string;
}

/** PUT /api/admin/posts/{id} — 모든 필드 필수 */
export interface UpdateAdminPostRequest {
  title: string;
  content: string;
  work_experience: string;
  position_id: number;
  education: string;
  language: string;
  employment_type: string;
  work_location: string;
  working_hours: number;
  salary: number;
  start_date: string;
  end_date: string;
}

/** POST /api/admin/notices/ */
export interface AdminNoticeCreateRequest {
  title: string;
  content: string;
  is_active?: boolean;
}

/** PATCH /api/admin/notices/{id} */
export interface AdminNoticeUpdateRequest {
  title?: string;
  content?: string;
  is_active?: boolean;
}

export interface AdminNotice {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  /** ISO datetime string */
  created_at: string;
  /** ISO datetime string */
  updated_at: string;
  author_id?: number | null;
}

// ─────────────────────────────────────────
// MinIO 파일 업로드 — /api/minio
// ─────────────────────────────────────────

/**
 * POST /api/minio/company/file
 * POST /api/minio/user/file
 */
export interface MinioFileRequest {
  file_type: string;
  file_name: string;
  content_type: string;
  /** 최대 파일 크기 (MB) */
  max_size: number;
}

export interface MinioFileResponse {
  url: string;
  key: string;
  content_type: string;
  form_data: Record<string, string>;
  expires: string;
}

// ─────────────────────────────────────────
// Position (공통 참조용)
// ─────────────────────────────────────────

export interface Position {
  id: number;
  name: string;
  level: number;
  parent_id?: number | null;
  code?: string | null;
}

// ─────────────────────────────────────────
// 레거시 / 하위 호환 타입 (점진적 제거 예정)
// ─────────────────────────────────────────

/** @deprecated CompanyPostRequest 로 대체 */
export type CreateCompanyPostRequest = CompanyPostRequest;

/** @deprecated CompanyPost 로 대체 */
export type CreateCompanyPostResponse = CompanyPost;

/** @deprecated CompanyPost 로 대체 */
export type CompanyPostDetailResponse = CompanyPost;

/** @deprecated CompanyPostRequest 로 대체 */
export type UpdateCompanyPostRequest = CompanyPostRequest;

/** @deprecated CompanyPost 로 대체 */
export type UpdateCompanyPostResponse = CompanyPost;

export interface DeleteCompanyPostResponse {
  message: string;
}

/** @deprecated ResumeRequest 로 대체 */
export type CreateResumeRequest = ResumeRequest;

/** @deprecated ResumeRequest 로 대체 */
export type UpdateResumeRequest = Partial<ResumeRequest>;

// ─────────────────────────────────────────
// Admin Events (서버 미구현 — 클라이언트 UI 전용)
// ─────────────────────────────────────────

export type EventType = 'notice' | 'event' | 'promotion';
export type EventTarget = 'all' | 'user' | 'company';
export type EventStatus = 'active' | 'inactive';

export interface AdminEvent {
  id: number;
  title: string;
  type: EventType;
  target: EventTarget;
  status: EventStatus;
  start_date: string;
  end_date: string;
  content: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminEventRequest {
  title: string;
  type: EventType;
  target: EventTarget;
  status: EventStatus;
  start_date: string;
  end_date: string;
  content: string;
  banner_url?: string;
}

export interface UpdateAdminEventRequest {
  title?: string;
  type?: EventType;
  target?: EventTarget;
  status?: EventStatus;
  start_date?: string;
  end_date?: string;
  content?: string;
  banner_url?: string;
}

// ─────────────────────────────────────────
// Business Verification (국세청 API 연동용)
// ─────────────────────────────────────────

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
