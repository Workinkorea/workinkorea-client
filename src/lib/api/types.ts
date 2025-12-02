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
}

export interface ProfileResponse {
  profile_image_url: string;
  location: string;
  introduction: string;
  address: string;
  position_id: number;
  job_status: string;
  portfolio_url: string;
  birth_date: string;
  name: string;
  country_id: number;
}

export interface ProfileUpdateRequest {
  profile_image_url: string;
  location: string;
  introduction: string;
  address: string;
  position_id: number;
  job_status: string;
  portfolio_url: string;
  country_id: number;
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
  user_id: number;
  sns_message_notice: boolean;
  email_notice: boolean;
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

export interface CompanyProfileRequest {
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

// Resume API types
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
  language_type: string;
  level: string;
}

export interface School {
  school_name: string;
  major_name: string;
  start_date: string;
  end_date: string;
  is_graduated: boolean;
}

export interface CareerHistory {
  company_name: string;
  start_date: string;
  end_date: string;
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

export interface ResumeDetailResponse {
  resume: ResumeDetail;
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

export interface CreateResumeResponse {
  resume_id: number;
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

export interface UpdateResumeResponse {
  resume_id: number;
}

export interface DeleteResumeResponse {
  message: string;
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