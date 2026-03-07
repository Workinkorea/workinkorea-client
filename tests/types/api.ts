export interface LanguageSkillsDTO {
  language_type?: string;
  level?: string;
}

export interface SchoolRequest {
  school_name: string;
  major_name: string;
  start_date: string;
  end_date?: string;
  is_graduated: boolean;
}

export interface CareerHistoryRequest {
  company_name: string;
  start_date: string;
  end_date?: string;
  is_working: boolean;
  department?: string;
  position_title?: string;
  main_role?: string;
}

export interface IntroductionRequest {
  title: string;
  content?: string;
}

export interface LicenseRequest {
  license_name?: string;
  license_agency?: string;
  license_date?: string;
}

export interface ProfileResponse {
  profile_image_url?: string;
  location?: string;
  introduction?: string;
  address?: string;
  position_id?: number;
  career?: string;
  job_status?: string;
  portfolio_url?: string;
  language_skills?: LanguageSkillsDTO[];
  birth_date: string;
  name: string;
  country_id: number;
  created_at: string;
}

export interface ContactResponse {
  user_id: number;
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
}

export interface CompanyPostResponse {
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

export interface CompanyResponse {
  id: number;
  company_number: string;
  company_name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  passport_certi: boolean;
}

export interface ResumeResponse {
  id: number;
  user_id: number;
  title: string;
  profile_url: string;
  language_skills?: LanguageSkillsDTO[];
  schools?: SchoolRequest[];
  career_history?: CareerHistoryRequest[];
  introduction?: IntroductionRequest[];
  licenses?: LicenseRequest[];
  created_at: string;
  updated_at: string;
}

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

export interface MinioFileResponse {
  url: string;
  key: string;
  content_type: string;
  form_data: Record<string, unknown>;
  expires: string;
}

// Request Types
export interface SignupRequest {
  email: string;
  password: string;
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

export interface CompanyLoginRequest {
  username: string;
  password: string;
}

export interface EmailCertifyRequest {
  email: string;
}

export interface EmailCertifyVerifyRequest {
  email: string;
  code: string;
}

export interface UpdateProfileRequest {
  profile_image_url?: string;
  location?: string;
  introduction?: string;
  address?: string;
  position_id?: number;
  career?: string;
  job_status?: string;
  portfolio_url?: string;
  language_skills?: LanguageSkillsDTO[];
  name?: string;
  country_id?: number;
}

export interface UpdateContactRequest {
  phone_number?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

export interface UpdateAccountConfigRequest {
  sns_message_notice?: boolean;
  email_notice?: boolean;
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
  start_date: string;
  end_date: string;
}

export interface ResumeRequest {
  title: string;
  profile_url: string;
  language_skills?: LanguageSkillsDTO[];
  schools?: SchoolRequest[];
  career_history?: CareerHistoryRequest[];
  introduction?: IntroductionRequest[];
  licenses?: LicenseRequest[];
}

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

export interface MinioFileRequest {
  file_type: 'profile_image' | 'company_image' | 'company_post' | 'resume_pdf';
  file_name: string;
  content_type: string;
  max_size: number;
}
