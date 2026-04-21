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
  token_type?: 'access' | 'access_company' | 'admin_access';
  user?: {
    id: string;
    email: string;
  };
}

export interface LogoutResponse {
  success?: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
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

export interface CompanyLoginRequest {
  username: string;
  password: string;
}

export interface CompanyLoginResponse {
  url: string;
  access_token?: string;
  token_type?: 'access' | 'access_company' | 'admin_access';
}

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

export interface CreateProfileRequest {
  name: string;
  birth_date: string;
  country_id: number;
  profile_image_url?: string;
  location?: string;
  introduction?: string;
  address?: string;
  position_id?: number;
  career?: string;
  job_status?: string;
  portfolio_url?: string;
  language_skills?: LanguageSkill[];
}

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

export interface CompanyProfileResponse {
  company_id: number;
  /** 서버가 아직 반환하지 않을 수 있음 (ISSUE-112) */
  company_name?: string;
  industry_type: string;
  employee_count: number;
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  address: string;
  website_url: string;
  email: string;
}

export interface CompanyProfileRequest {
  industry_type: string;
  employee_count: number;
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  address: string;
  website_url: string;
  email: string;
}

export interface ApiErrorResponse {
  error: string;
}

// Resume API types
export interface ResumeDetail {
  id: number;
  user_id: number;
  title: string;
  profile_url: string;
  language_skills: LanguageSkill[];
  schools: School[];
  career_history: CareerHistory[];
  introduction: Introduction[];
  licenses: License[];
}

export interface ResumeListItem {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeListResponse {
  resume_list: ResumeListItem[];
}

export interface LanguageSkill {
  language_type?: string;
  level?: string;
}

export interface School {
  school_name: string;
  major_name: string;
  start_date: string;
  end_date?: string;
  is_graduated: boolean;
}

export interface CareerHistory {
  company_name: string;
  start_date: string;
  end_date?: string;
  is_working: boolean;
  department: string;
  position_title: string;
  main_role: string;
}

export interface Introduction {
  title: string;
  content: string;
}

export interface License {
  license_name: string;
  license_agency: string;
  license_date: string;
}

export interface CreateResumeRequest {
  title: string;
  profile_url?: string;
  language_skills?: LanguageSkill[];
  schools?: School[];
  career_history?: CareerHistory[];
  introduction?: Introduction[];
  licenses?: License[];
}

export interface UpdateResumeRequest {
  title?: string;
  profile_url?: string;
  language_skills?: LanguageSkill[];
  schools?: School[];
  career_history?: CareerHistory[];
  introduction?: Introduction[];
  licenses?: License[];
}

export interface UploadResumeFileResponse {
  resume_id: number;
  file_url: string;
  message: string;
}

export interface UploadResumeImageResponse {
  file_name: string;
}

// Company Post API types
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
  start_date: string;
  end_date: string;
}

export interface CompanyPostsResponse {
  company_posts: CompanyPost[];
  total: number;
  skip?: number; // API에서 사용
  page?: number; // 클라이언트에서 사용
  limit: number;
  count?: number; // API에서 사용 (현재 페이지의 아이템 수)
  total_pages?: number; // 클라이언트에서 사용
}

export interface CreateCompanyPostRequest {
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

export interface CreateCompanyPostResponse {
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
  start_date: string;
  end_date: string;
}

export interface CompanyPostDetailResponse {
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
  start_date: string;
  end_date: string;
}

// 백엔드 PUT /api/posts/company/{id}는 CompanyPostRequest를 사용하며 모든 필드 필수.
export interface UpdateCompanyPostRequest {
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

export interface UpdateCompanyPostResponse {
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
  start_date: string;
  end_date: string;
}

export interface DeleteCompanyPostResponse {
  message: string;
}

// Job Application API types
//
// NOTE (C5 - 미구현 엔드포인트 스키마 초안):
// 아래 요청/응답 타입들은 FastAPI 백엔드 팀이 다음 엔드포인트를 구현할 때
// 프런트와의 계약 초안으로 사용됩니다. 실제 구현 시 필드명을 서버와
// 맞춰 갱신해야 합니다.
//
//   P0:
//     POST /api/applications                         (채용 공고 지원)
//     GET  /api/applications/me                      (내 지원 내역)
//   P1:
//     DELETE /api/applications/{id}                  (지원 취소)
//     GET    /api/posts/company/{id}/applicants      (지원자 목록 — 기업 전용)
//     GET    /api/company/{id}                       (공개 기업 정보)
//   P2:
//     POST   /api/bookmarks                          (북마크 추가)
//     DELETE /api/bookmarks/{id}                     (북마크 삭제)
//     GET    /api/bookmarks/me                       (내 북마크 목록)

export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface ApplyToJobRequest {
  company_post_id: number;
  resume_id?: number;
  cover_letter?: string;
}

export interface ApplyToJobResponse {
  id: number;
  user_id: number;
  company_post_id: number;
  resume_id?: number;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: string;
}

/** GET /api/applications/me — 내가 지원한 공고 목록 */
export interface MyApplicationItem {
  id: number;
  company_post_id: number;
  post_title: string;
  company_id: number;
  company_name?: string;
  resume_id?: number;
  status: ApplicationStatus;
  applied_at: string;
  updated_at?: string;
}

export interface MyApplicationsResponse {
  applications: MyApplicationItem[];
  pagination?: {
    count: number;
    skip: number;
    limit: number;
  };
}

/** DELETE /api/applications/{id} — 지원 취소 */
export interface WithdrawApplicationResponse {
  id: number;
  status: ApplicationStatus;
  message?: string;
}

/** GET /api/posts/company/{id}/applicants — 기업 전용 지원자 목록 */
export interface PostApplicantItem {
  application_id: number;
  user_id: number;
  user_name: string;
  profile_image_url?: string;
  resume_id?: number;
  status: ApplicationStatus;
  applied_at: string;
  cover_letter?: string;
}

export interface PostApplicantsResponse {
  company_post_id: number;
  applicants: PostApplicantItem[];
  pagination?: {
    count: number;
    skip: number;
    limit: number;
  };
}

/** GET /api/company/{id} — 공개 기업 정보 (기업 로그인 불필요) */
export interface PublicCompanyResponse {
  id: number;
  company_name: string;
  logo_url?: string;
  description?: string;
  homepage_url?: string;
  industry?: string;
  address?: string;
  employee_count?: number;
  established_year?: number;
}

// Bookmark API types
export interface CreateBookmarkRequest {
  company_post_id: number;
}

export interface BookmarkResponse {
  id: number;
  user_id: number;
  company_post_id: number;
  created_at: string;
}

export interface MyBookmarksResponse {
  bookmarks: BookmarkResponse[];
  pagination?: {
    count: number;
    skip: number;
    limit: number;
  };
}

export interface DeleteBookmarkResponse {
  id: number;
  message?: string;
}

// User Image Upload API types
export interface UploadUserImageRequest {
  file_name: string;
}

export interface PresignedPostResponse {
  url: string;
  fields: Record<string, string>;
  object_name: string;
  expires: string;
}

export interface UploadUserImageResponse {
  success: boolean;
  message?: string;
  image_url?: string;
}

// Admin API types
export interface AdminUser {
  id: number;
  email: string;
  passport_certi: boolean;
}

export interface AdminCompany {
  id: number;
  company_number: string;
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
  start_date: string;
  end_date: string;
}

export interface UpdateAdminUserRequest {
  passport_certi: boolean;
}

export interface UpdateAdminCompanyRequest {
  company_name: string;
}

export interface UpdateAdminPostRequest {
  title?: string;
  content?: string;
  work_experience?: string;
  position_id?: number;
  education?: string;
  language?: string;
  employment_type?: string;
  work_location?: string;
  working_hours?: number;
  salary?: number;
  start_date?: string;
  end_date?: string;
}

// Diagnosis API types
export interface DiagnosisAnswerRequest {
  total_score: number;
  q1_answer: string;
  q2_answer: string;
  q3_answer: string;
  q4_answer: string;
  q5_answer: string;
  q6_answer: string;
  q7_answer: string;
  q8_answer: string;
  q9_answer: string;
  q10_answer: string;
  q11_answer: string;
  q12_answer: string;
  q13_answer: string;
  q14_answer: string;
  q15_answer: string;
}

export interface DiagnosisAnswerResponse {
  id: number;
  total_score: number;
  q1_answer: string;
  q2_answer: string;
  q3_answer: string;
  q4_answer: string;
  q5_answer: string;
  q6_answer: string;
  q7_answer: string;
  q8_answer: string;
  q9_answer: string;
  q10_answer: string;
  q11_answer: string;
  q12_answer: string;
  q13_answer: string;
  q14_answer: string;
  q15_answer: string;
}

// Event API types
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

// Business Verification API types (National Tax Service)
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