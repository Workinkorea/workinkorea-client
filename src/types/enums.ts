/**
 * Shared Enum Types
 *
 * Centralized enum definitions for type safety and consistency
 */

/**
 * Phone Type Enum
 */
export const PhoneType = {
  MOBILE: 'MOBILE',
  LANDLINE: 'LANDLINE',
} as const;

export type PhoneType = typeof PhoneType[keyof typeof PhoneType];

/**
 * Token Type Enum
 */
export const TokenType = {
  ACCESS: 'access',
  ACCESS_COMPANY: 'access_company',
  ADMIN_ACCESS: 'admin_access',
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

/**
 * Job Status Enum
 */
export const JobStatus = {
  LOOKING: 'looking',
  EMPLOYED: 'employed',
  NOT_LOOKING: 'not_looking',
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

/**
 * Career Level Enum
 */
export const CareerLevel = {
  ENTRY: 'entry',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive',
} as const;

export type CareerLevel = typeof CareerLevel[keyof typeof CareerLevel];

/**
 * Employment Type Enum
 */
export const EmploymentType = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern',
  FREELANCE: 'freelance',
} as const;

export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];

/**
 * Company Type Enum
 */
export const CompanyType = {
  CORPORATION: '주식회사',
  LIMITED: '유한회사',
  SOLE_PROPRIETOR: '개인사업자',
  FOREIGN: '외국계기업',
} as const;

export type CompanyType = typeof CompanyType[keyof typeof CompanyType];

/**
 * Language Level Enum
 */
export const LanguageLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  NATIVE: 'native',
} as const;

export type LanguageLevel = typeof LanguageLevel[keyof typeof LanguageLevel];
