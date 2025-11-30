import { z } from 'zod';

// 기본 프로필 정보 검증 스키마
export const basicProfileSchema = z.object({
  name: z.string()
    .min(2, '이름은 최소 2글자 이상이어야 합니다.')
    .max(50, '이름은 50글자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 사용할 수 있습니다.'),

  profile_image_url: z.union([
    z.string().url('올바른 URL 형식을 입력해주세요.'),
    z.literal('')
  ]).optional(),

  position_id: z.string()
    .min(1, '직책을 선택해주세요.')
    .optional()
    .or(z.literal('')),

  location: z.string()
    .max(100, '위치는 100글자를 초과할 수 없습니다.')
    .optional()
    .or(z.literal('')),

  introduction: z.string()
    .max(500, '소개는 500글자를 초과할 수 없습니다.')
    .optional()
    .or(z.literal('')),

  job_status: z.string()
    .min(1, '직업 상태를 선택해주세요.')
    .optional()
    .or(z.literal('')),

  portfolio_url: z.string()
    .url('올바른 URL 형식을 입력해주세요.')
    .optional()
    .or(z.literal('')),
});

// 연락처 정보 검증 스키마
export const contactInfoSchema = z.object({
  email: z.string()
    .email('올바른 이메일 형식을 입력해주세요.')
    .min(5, '이메일은 최소 5글자 이상이어야 합니다.')
    .max(100, '이메일은 100글자를 초과할 수 없습니다.'),

  github_url: z.string()
    .url('올바른 URL 형식을 입력해주세요.')
    .regex(/^https?:\/\/(www\.)?github\.com\/.*/, 'GitHub URL만 입력 가능합니다.')
    .optional()
    .or(z.literal('')),

  linkedin_url: z.string()
    .url('올바른 URL 형식을 입력해주세요.')
    .regex(/^https?:\/\/(www\.)?linkedin\.com\/.*/, 'LinkedIn URL만 입력 가능합니다.')
    .optional()
    .or(z.literal('')),

  portfolio_url: z.string()
    .url('올바른 URL 형식을 입력해주세요.')
    .optional()
    .or(z.literal('')),
});

// 선호도 및 상태 검증 스키마
export const preferencesSchema = z.object({
  job_status: z.enum(['available', 'busy', 'not-looking'], {
    message: '구직 상태를 선택해주세요.'
  }),

  experience: z.number()
    .min(0, '경력은 0년 이상이어야 합니다.')
    .max(50, '경력은 50년을 초과할 수 없습니다.')
    .int('경력은 정수로 입력해주세요.'),

  completedProjects: z.number()
    .min(0, '완료 프로젝트 수는 0개 이상이어야 합니다.')
    .max(1000, '완료 프로젝트 수는 1000개를 초과할 수 없습니다.')
    .int('완료 프로젝트 수는 정수로 입력해주세요.'),

  preferredSalary: z.object({
    min: z.number()
      .min(0, '최소 희망 연봉은 0 이상이어야 합니다.')
      .max(1000000, '최소 희망 연봉이 너무 높습니다.'),
    max: z.number()
      .min(0, '최대 희망 연봉은 0 이상이어야 합니다.')
      .max(1000000, '최대 희망 연봉이 너무 높습니다.'),
    currency: z.string().min(1, '통화를 선택해주세요.')
  }).optional().refine((salary) => {
    if (!salary) return true;
    return salary.min <= salary.max;
  }, {
    message: '최소 희망 연봉은 최대 희망 연봉보다 작거나 같아야 합니다.',
    path: ['min']
  }),
});

// 스킬 검증 스키마
export const skillSchema = z.object({
  name: z.string()
    .min(1, '스킬 이름을 입력해주세요.')
    .max(50, '스킬 이름은 50글자를 초과할 수 없습니다.'),

  level: z.number()
    .min(1, '스킬 레벨은 최소 1이어야 합니다.')
    .max(100, '스킬 레벨은 최대 100이어야 합니다.')
    .int('스킬 레벨은 정수로 입력해주세요.'),

  category: z.enum(['technical', 'soft', 'language'], {
    message: '스킬 카테고리를 선택해주세요.'
  }),

  description: z.string()
    .max(200, '스킬 설명은 200글자를 초과할 수 없습니다.')
    .optional()
    .or(z.literal('')),
});

// 교육 이력 검증 스키마
export const educationSchema = z.object({
  institution: z.string()
    .min(2, '기관명은 최소 2글자 이상이어야 합니다.')
    .max(100, '기관명은 100글자를 초과할 수 없습니다.'),

  degree: z.string()
    .min(2, '학위명은 최소 2글자 이상이어야 합니다.')
    .max(50, '학위명은 50글자를 초과할 수 없습니다.'),

  field: z.string()
    .min(2, '전공명은 최소 2글자 이상이어야 합니다.')
    .max(100, '전공명은 100글자를 초과할 수 없습니다.'),

  startDate: z.string()
    .regex(/^\d{4}-\d{2}$/, '시작일은 YYYY-MM 형식으로 입력해주세요.'),

  endDate: z.string()
    .regex(/^\d{4}-\d{2}$/, '종료일은 YYYY-MM 형식으로 입력해주세요.')
    .optional()
    .or(z.literal('')),

  current: z.boolean().optional(),
}).refine((education) => {
  if (!education.endDate || education.current) return true;
  return education.startDate <= education.endDate;
}, {
  message: '시작일은 종료일보다 이전이어야 합니다.',
  path: ['endDate']
});

// 언어 능력 검증 스키마
export const languageSchema = z.object({
  name: z.string()
    .min(2, '언어명은 최소 2글자 이상이어야 합니다.')
    .max(30, '언어명은 30글자를 초과할 수 없습니다.'),

  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native'], {
    message: '언어 숙련도를 선택해주세요.'
  }),
});

// 비밀번호 변경 검증 스키마
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, '현재 비밀번호를 입력해주세요.'),

  newPassword: z.string()
    .min(8, '새 비밀번호는 최소 8자 이상이어야 합니다.')
    .max(50, '새 비밀번호는 50자를 초과할 수 없습니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '새 비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),

  confirmPassword: z.string()
    .min(1, '새 비밀번호를 다시 입력해주세요.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword']
});

// 알림 설정 검증 스키마
export const notificationSettingsSchema = z.object({
  contactRequestNotifications: z.boolean(),
  skillEndorsementNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
});

// 계정 설정 검증 스키마
export const accountSettingsSchema = z.object({
  notifications: notificationSettingsSchema,
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'contacts-only'], {
      message: '프로필 공개 범위를 선택해주세요.'
    }),
    searchable: z.boolean(),
    showEmail: z.boolean(),
    showLocation: z.boolean(),
  }),
});

// 타입 추출
export type BasicProfileForm = z.infer<typeof basicProfileSchema>;
export type ContactInfoForm = z.infer<typeof contactInfoSchema>;
export type PreferencesForm = z.infer<typeof preferencesSchema>;
export type SkillForm = z.infer<typeof skillSchema>;
export type EducationForm = z.infer<typeof educationSchema>;
export type LanguageForm = z.infer<typeof languageSchema>;
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;
export type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;
export type AccountSettingsForm = z.infer<typeof accountSettingsSchema>;