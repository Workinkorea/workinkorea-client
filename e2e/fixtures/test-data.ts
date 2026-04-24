// 프로덕션 read-only 검증에 사용하는 상수. 환경변수로 override 가능.
export const TEST_COMPANY_EMAIL = process.env.E2E_COMPANY_EMAIL ?? 'test@test.com';
export const TEST_COMPANY_PASSWORD = process.env.E2E_COMPANY_PASSWORD ?? '';

export const SAMPLE_COMPANY_POST_ID = Number(process.env.E2E_SAMPLE_POST_ID ?? 15);
export const SAMPLE_USER_RESUME_ID = Number(process.env.E2E_SAMPLE_RESUME_ID ?? 10);

export const PROTECTED_USER_ROUTES = [
  '/user/profile',
  '/user/profile/edit',
  '/user/resume',
  '/user/applications',
  '/user/bookmarks',
  '/user/settings',
] as const;

export const PROTECTED_COMPANY_ROUTES = [
  '/company/jobs',
  '/company/posts/create',
  '/company/profile/edit',
  '/company/applicants',
  '/company/settings',
] as const;

export const PUBLIC_ROUTES = [
  '/',
  '/jobs',
  '/self-diagnosis',
  '/faq',
  '/terms',
  '/privacy',
  '/support',
  '/login-select',
  '/login',
  '/company-login',
  '/signup-select',
  '/company-signup/step1',
] as const;
