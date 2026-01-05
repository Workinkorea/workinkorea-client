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
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  token_type?: 'access' | 'access_company' | 'admin_access';
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
  phone_type: 'MOBILE' | 'LANDLINE';  // 전화번호 타입 (휴대전화/일반전화)
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
  industry_type: string;
  employee_count: number;
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  address: string;
  website_url: string;
  email: string;
  country_id: number;
  position_id: number;
}

export interface CompanyProfileRequest {
  industry_type: string;
  employee_count: number;
  establishment_date: string;
  company_type: string;
  insurance: string;
  phone_number: string;
  phone_type: 'MOBILE' | 'LANDLINE';  // 전화번호 타입 (휴대전화/일반전화)
  address: string;
  website_url: string;
  email: string;
  country_id: number;
  position_id: number;
  company_number?: string;  // 사업자등록번호 (선택)
  representative_name?: string;  // 대표자명 (선택)
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

export interface UpdateCompanyPostRequest {
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