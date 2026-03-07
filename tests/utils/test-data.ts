import type {
  SignupRequest,
  CompanySignupRequest,
  CompanyLoginRequest,
  EmailCertifyRequest,
  EmailCertifyVerifyRequest,
  UpdateProfileRequest,
  UpdateContactRequest,
  UpdateAccountConfigRequest,
  CompanyProfileRequest,
  CompanyPostRequest,
  ResumeRequest,
  DiagnosisAnswerRequest,
  MinioFileRequest,
  LanguageSkillsDTO,
} from '../types/api';

/**
 * 랜덤 문자열 생성
 */
function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * 랜덤 숫자 생성
 */
function randomNumber(min = 1, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 현재 날짜 ISO 형식 반환
 */
function getISODate(daysOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
}

/**
 * YYYY-MM-DD 형식 날짜 반환
 */
function getDateString(daysOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

/**
 * 테스트용 일반 사용자 생성 데이터
 */
export function createTestUser(
  overrides?: Partial<SignupRequest>
): SignupRequest {
  const uniqueId = randomString(6);
  return {
    email: `test-user-${uniqueId}@example.com`,
    password: 'TestPassword123!',
    name: `Test User ${uniqueId}`,
    birth_date: '1990-01-01',
    country_code: 'KR',
    ...overrides,
  };
}

/**
 * 테스트용 기업 회원 생성 데이터
 */
export function createTestCompany(
  overrides?: Partial<CompanySignupRequest>
): CompanySignupRequest {
  const uniqueId = randomString(6);
  const companyNumber = `${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(10000, 99999)}`;

  return {
    company_number: companyNumber,
    company_name: `Test Company ${uniqueId}`,
    email: `test-company-${uniqueId}@example.com`,
    password: 'CompanyPassword123!',
    name: `Company Admin ${uniqueId}`,
    phone: '010-1234-5678',
    ...overrides,
  };
}

/**
 * 테스트용 기업 로그인 데이터
 */
export function createCompanyLoginData(
  overrides?: Partial<CompanyLoginRequest>
): CompanyLoginRequest {
  return {
    username: 'test-company@example.com',
    password: 'CompanyPassword123!',
    ...overrides,
  };
}

/**
 * 테스트용 이메일 인증 요청 데이터
 */
export function createEmailCertifyRequest(
  overrides?: Partial<EmailCertifyRequest>
): EmailCertifyRequest {
  return {
    email: `test-${randomString()}@example.com`,
    ...overrides,
  };
}

/**
 * 테스트용 이메일 인증 확인 데이터
 */
export function createEmailVerifyRequest(
  overrides?: Partial<EmailCertifyVerifyRequest>
): EmailCertifyVerifyRequest {
  return {
    email: 'test@example.com',
    code: '123456',
    ...overrides,
  };
}

/**
 * 테스트용 프로필 업데이트 데이터
 */
export function createProfileUpdateData(
  overrides?: Partial<UpdateProfileRequest>
): UpdateProfileRequest {
  return {
    location: 'Seoul, South Korea',
    introduction: 'Test introduction',
    address: '123 Test Street, Seoul',
    position_id: 1,
    career: '2 years',
    job_status: 'Looking for job',
    portfolio_url: 'https://portfolio.example.com',
    language_skills: [
      { language_type: 'English', level: 'Advanced' },
      { language_type: 'Korean', level: 'Intermediate' },
    ],
    ...overrides,
  };
}

/**
 * 테스트용 연락처 업데이트 데이터
 */
export function createContactUpdateData(
  overrides?: Partial<UpdateContactRequest>
): UpdateContactRequest {
  return {
    phone_number: '010-9876-5432',
    github_url: 'https://github.com/testuser',
    linkedin_url: 'https://linkedin.com/in/testuser',
    website_url: 'https://testuser.com',
    ...overrides,
  };
}

/**
 * 테스트용 계정 설정 업데이트 데이터
 */
export function createAccountConfigUpdateData(
  overrides?: Partial<UpdateAccountConfigRequest>
): UpdateAccountConfigRequest {
  return {
    sns_message_notice: true,
    email_notice: true,
    ...overrides,
  };
}

/**
 * 테스트용 기업 프로필 생성 데이터
 */
export function createCompanyProfileData(
  overrides?: Partial<CompanyProfileRequest>
): CompanyProfileRequest {
  return {
    industry_type: 'IT',
    employee_count: 50,
    establishment_date: '2020-01-01',
    company_type: 'Private',
    insurance: 'Yes',
    phone_number: '02-1234-5678',
    address: '123 Business Street, Seoul',
    website_url: 'https://testcompany.com',
    email: 'contact@testcompany.com',
    ...overrides,
  };
}

/**
 * 테스트용 채용공고 생성 데이터
 */
export function createCompanyPostData(
  overrides?: Partial<CompanyPostRequest>
): CompanyPostRequest {
  return {
    title: `Test Job Posting ${randomString(4)}`,
    content: 'This is a test job posting content with detailed description.',
    work_experience: 'Entry Level',
    position_id: 1,
    education: "Bachelor's Degree",
    language: 'English, Korean',
    employment_type: 'Full-time',
    work_location: 'Seoul',
    working_hours: 40,
    salary: 35000000,
    start_date: getISODate(),
    end_date: getISODate(30),
    ...overrides,
  };
}

/**
 * 테스트용 이력서 생성 데이터
 */
export function createResumeData(
  overrides?: Partial<ResumeRequest>
): ResumeRequest {
  return {
    title: `Test Resume ${randomString(4)}`,
    profile_url: 'https://example.com/profile.jpg',
    language_skills: [
      { language_type: 'English', level: 'Advanced' },
      { language_type: 'Korean', level: 'Intermediate' },
    ],
    schools: [
      {
        school_name: 'Test University',
        major_name: 'Computer Science',
        start_date: getISODate(-1460),
        end_date: getISODate(-100),
        is_graduated: true,
      },
    ],
    career_history: [
      {
        company_name: 'Test Corp',
        start_date: getISODate(-730),
        end_date: getISODate(-365),
        is_working: false,
        department: 'Engineering',
        position_title: 'Software Engineer',
        main_role: 'Backend Development',
      },
    ],
    introduction: [
      {
        title: 'About Me',
        content: 'I am a passionate software engineer.',
      },
    ],
    licenses: [
      {
        license_name: 'AWS Certified Developer',
        license_agency: 'Amazon',
        license_date: getISODate(-365),
      },
    ],
    ...overrides,
  };
}

/**
 * 테스트용 진단 답변 데이터
 */
export function createDiagnosisAnswerData(
  overrides?: Partial<DiagnosisAnswerRequest>
): DiagnosisAnswerRequest {
  return {
    total_score: 75,
    q1_answer: 'Answer 1',
    q2_answer: 'Answer 2',
    q3_answer: 'Answer 3',
    q4_answer: 'Answer 4',
    q5_answer: 'Answer 5',
    q6_answer: 'Answer 6',
    q7_answer: 'Answer 7',
    q8_answer: 'Answer 8',
    q9_answer: 'Answer 9',
    q10_answer: 'Answer 10',
    q11_answer: 'Answer 11',
    q12_answer: 'Answer 12',
    q13_answer: 'Answer 13',
    q14_answer: 'Answer 14',
    q15_answer: 'Answer 15',
    ...overrides,
  };
}

/**
 * 테스트용 Minio 파일 업로드 요청 데이터
 */
export function createMinioFileRequest(
  overrides?: Partial<MinioFileRequest>
): MinioFileRequest {
  return {
    file_type: 'profile_image',
    file_name: `test-${randomString()}.jpg`,
    content_type: 'image/jpeg',
    max_size: 5242880, // 5MB
    ...overrides,
  };
}
