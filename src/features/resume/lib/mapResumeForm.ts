import type {
  ResumeDetail,
  CreateResumeRequest,
  UpdateResumeRequest,
  ProfileResponse,
  ContactResponse,
} from '@/shared/types/api';

// ── Form type (snake_case, matches API contract) ──────────────────────

export type ResumeFormData = {
  title: string;
  profile_url?: string;
  language_skills: Array<{
    language_type: string;
    level: string;
  }>;
  schools: Array<{
    school_name: string;
    major_name: string;
    start_date: string;
    end_date?: string;
    is_graduated: boolean;
  }>;
  career_history: Array<{
    company_name: string;
    start_date: string;
    end_date?: string;
    is_working: boolean;
    department: string;
    position_title: string;
    main_role: string;
  }>;
  introduction: Array<{
    title: string;
    content: string;
  }>;
  licenses: Array<{
    license_name: string;
    license_agency: string;
    license_date: string;
  }>;
};

// ── Helpers ───────────────────────────────────────────────────────────

/** ISO datetime → YYYY-MM-DD (input[type=date] 용) */
function formatDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

const EMPTY_LANGUAGE = { language_type: '', level: '' };
const EMPTY_SCHOOL = {
  school_name: '',
  major_name: '',
  start_date: '',
  end_date: undefined as string | undefined,
  is_graduated: false,
};
const EMPTY_CAREER = {
  company_name: '',
  start_date: '',
  end_date: undefined as string | undefined,
  is_working: false,
  department: '',
  position_title: '',
  main_role: '',
};
const EMPTY_INTRO = { title: '', content: '' };
const EMPTY_LICENSE = { license_name: '', license_agency: '', license_date: '' };

// ── API Response → Form ──────────────────────────────────────────────

export interface MapToFormOptions {
  profile?: ProfileResponse | null;
  contact?: ContactResponse | null;
}

/**
 * ResumeDetail (API 응답) → ResumeFormData (react-hook-form 값).
 * 모든 필드에 안전한 기본값을 보장하여 빈 폼 렌더를 방지한다.
 */
export function mapResumeResponseToForm(
  dto: ResumeDetail,
  options?: MapToFormOptions,
): ResumeFormData {
  const { profile, contact } = options ?? {};

  const languageSkills =
    dto.language_skills?.length
      ? dto.language_skills.map((l) => ({
          language_type: l.language_type ?? '',
          level: l.level ?? '',
        }))
      : [{ ...EMPTY_LANGUAGE }];

  const schools =
    dto.schools?.length
      ? dto.schools.map((s) => ({
          school_name: s.school_name ?? '',
          major_name: s.major_name ?? '',
          start_date: formatDateForInput(s.start_date),
          end_date: formatDateForInput(s.end_date) || undefined,
          is_graduated: s.is_graduated ?? false,
        }))
      : [{ ...EMPTY_SCHOOL }];

  const careerHistory =
    dto.career_history?.length
      ? dto.career_history.map((c) => ({
          company_name: c.company_name ?? '',
          start_date: formatDateForInput(c.start_date),
          end_date: formatDateForInput(c.end_date) || undefined,
          is_working: c.is_working ?? false,
          department: c.department ?? '',
          position_title: c.position_title ?? '',
          main_role: c.main_role ?? '',
        }))
      : [{ ...EMPTY_CAREER }];

  const introduction =
    dto.introduction?.length
      ? dto.introduction.map((i) => ({
          title: i.title ?? '',
          content: i.content ?? '',
        }))
      : [{ ...EMPTY_INTRO }];

  const licenses =
    dto.licenses?.length
      ? dto.licenses.map((l) => ({
          license_name: l.license_name ?? '',
          license_agency: l.license_agency ?? '',
          license_date: formatDateForInput(l.license_date),
        }))
      : [{ ...EMPTY_LICENSE }];

  // profile_url: 이력서 자체 URL → 프로필 이미지 URL 순으로 fallback
  const profileUrl =
    dto.profile_url || profile?.profile_image_url || '';

  return {
    title: dto.title ?? '',
    profile_url: profileUrl,
    language_skills: languageSkills,
    schools,
    career_history: careerHistory,
    introduction,
    licenses,
  };
}

/** 빈 폼 기본값 (신규 이력서 작성용) */
export function emptyFormDefaults(): ResumeFormData {
  return {
    title: '',
    profile_url: '',
    language_skills: [{ ...EMPTY_LANGUAGE }],
    schools: [{ ...EMPTY_SCHOOL }],
    career_history: [{ ...EMPTY_CAREER }],
    introduction: [{ ...EMPTY_INTRO }],
    licenses: [{ ...EMPTY_LICENSE }],
  };
}

// ── Form → API Request ───────────────────────────────────────────────

/**
 * ResumeFormData (폼 값) → CreateResumeRequest / UpdateResumeRequest.
 * 빈 행 제거, optional 필드 정리 포함.
 */
export function mapFormToRequest(
  data: ResumeFormData,
): CreateResumeRequest {
  // 학력: 기본 필드가 모두 비어있는 row 제거
  const filteredSchools = data.schools.filter(
    (s) => s.school_name?.trim() || s.major_name?.trim() || s.start_date,
  );
  const processedSchools =
    filteredSchools.length > 0
      ? filteredSchools.map((school) => {
          const { end_date, ...rest } = school;
          return end_date ? { ...rest, end_date } : rest;
        })
      : undefined;

  // 경력: 회사명/시작일 중 하나도 없는 row 제거
  const filteredCareer = data.career_history.filter(
    (c) => c.company_name?.trim() || c.start_date,
  );
  const processedCareerHistory =
    filteredCareer.length > 0
      ? filteredCareer.map((career) => {
          const { end_date, ...rest } = career;
          if (end_date && !career.is_working) {
            return { ...rest, end_date };
          }
          return rest;
        })
      : undefined;

  // 언어: 둘 다 있을 때만 포함
  const filteredLanguages = data.language_skills.filter(
    (l) => l.language_type?.trim() && l.level?.trim(),
  );

  // 자기소개: title 또는 content 중 하나라도 있을 때만
  const filteredIntroduction = data.introduction.filter(
    (i) => i.title?.trim() || i.content?.trim(),
  );

  // 자격증: license_name 필수
  const filteredLicenses = data.licenses.filter(
    (l) => l.license_name?.trim(),
  );

  return {
    title: data.title?.trim(),
    profile_url: data.profile_url || undefined,
    language_skills:
      filteredLanguages.length > 0 ? filteredLanguages : undefined,
    schools: processedSchools,
    career_history: processedCareerHistory,
    introduction:
      filteredIntroduction.length > 0 ? filteredIntroduction : undefined,
    licenses: filteredLicenses.length > 0 ? filteredLicenses : undefined,
  };
}
