/**
 * 채용 공고 관련 드롭다운 옵션 상수
 */

export const POSITION_OPTIONS = [
  { value: '1', label: '프론트엔드 개발자' },
  { value: '2', label: '백엔드 개발자' },
  { value: '3', label: '풀스택 개발자' },
  { value: '4', label: '데이터 엔지니어' },
  { value: '5', label: 'DevOps 엔지니어' },
  { value: '6', label: 'QA 엔지니어' },
] as const;

export const WORK_EXPERIENCE_OPTIONS = [
  { value: '경력무관', label: '경력무관' },
  { value: '신입', label: '신입' },
  { value: '1년 이상', label: '1년 이상' },
  { value: '3년 이상', label: '3년 이상' },
  { value: '5년 이상', label: '5년 이상' },
  { value: '10년 이상', label: '10년 이상' },
] as const;

export const EDUCATION_OPTIONS = [
  { value: '학력무관', label: '학력무관' },
  { value: '고졸 이상', label: '고졸 이상' },
  { value: '전문대졸 이상', label: '전문대졸 이상' },
  { value: '대졸 이상', label: '대졸 이상' },
  { value: '석사 이상', label: '석사 이상' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: '한국어 능통', label: '한국어 능통' },
  { value: '영어 가능', label: '영어 가능' },
  { value: '한국어, 영어 모두 가능', label: '한국어, 영어 모두 가능' },
  { value: '무관', label: '무관' },
] as const;
