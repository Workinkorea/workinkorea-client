import { describe, it, expect } from 'vitest';
import {
  mapResumeResponseToForm,
  mapFormToRequest,
  emptyFormDefaults,
} from '../mapResumeForm';
import type { ResumeDetail } from '@/shared/types/api';

// ── 테스트 데이터 ────────────────────────────────────────────────────

const FULL_RESPONSE: ResumeDetail = {
  id: 42,
  user_id: 7,
  title: 'QA 테스트 이력서 (수정됨)',
  profile_url: 'uploads/profile-42.jpg',
  language_skills: [
    { language_type: '한국어', level: 'native' },
    { language_type: '영어', level: 'advanced' },
  ],
  schools: [
    {
      school_name: '서울대학교',
      major_name: '컴퓨터공학',
      start_date: '2018-03-01T00:00:00',
      end_date: '2022-02-23T00:00:00',
      is_graduated: true,
    },
  ],
  career_history: [
    {
      company_name: '테스트 주식회사',
      start_date: '2022-03-01T00:00:00',
      end_date: undefined,
      is_working: true,
      department: '개발팀',
      position_title: '프론트엔드 개발자',
      main_role: 'React + Next.js 프론트엔드 개발',
    },
  ],
  introduction: [
    { title: '자기소개', content: '열정적인 프론트엔드 개발자입니다.' },
  ],
  licenses: [
    {
      license_name: '정보처리기사',
      license_agency: '한국산업인력공단',
      license_date: '2021-06-15T00:00:00',
    },
  ],
};

const MINIMAL_RESPONSE: ResumeDetail = {
  id: 1,
  user_id: 1,
  title: '빈 이력서',
  profile_url: '',
  language_skills: [],
  schools: [],
  career_history: [],
  introduction: [],
  licenses: [],
};

// ── mapResumeResponseToForm ──────────────────────────────────────────

describe('mapResumeResponseToForm', () => {
  it('정상 응답의 모든 필드를 올바르게 매핑한다', () => {
    const result = mapResumeResponseToForm(FULL_RESPONSE);

    expect(result.title).toBe('QA 테스트 이력서 (수정됨)');
    expect(result.profile_url).toBe('uploads/profile-42.jpg');

    // language_skills
    expect(result.language_skills).toHaveLength(2);
    expect(result.language_skills[0]).toEqual({
      language_type: '한국어',
      level: 'native',
    });

    // schools — 날짜가 YYYY-MM-DD 형식으로 변환
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0].school_name).toBe('서울대학교');
    expect(result.schools[0].start_date).toBe('2018-03-01');
    expect(result.schools[0].end_date).toBe('2022-02-23');
    expect(result.schools[0].is_graduated).toBe(true);

    // career_history
    expect(result.career_history).toHaveLength(1);
    expect(result.career_history[0].company_name).toBe('테스트 주식회사');
    expect(result.career_history[0].is_working).toBe(true);
    expect(result.career_history[0].end_date).toBeUndefined();

    // introduction
    expect(result.introduction).toHaveLength(1);
    expect(result.introduction[0].content).toBe(
      '열정적인 프론트엔드 개발자입니다.',
    );

    // licenses — 날짜 변환
    expect(result.licenses).toHaveLength(1);
    expect(result.licenses[0].license_name).toBe('정보처리기사');
    expect(result.licenses[0].license_date).toBe('2021-06-15');
  });

  it('빈 배열 응답이면 각 필드에 빈 항목 1개를 기본값으로 제공한다', () => {
    const result = mapResumeResponseToForm(MINIMAL_RESPONSE);

    expect(result.title).toBe('빈 이력서');
    expect(result.language_skills).toHaveLength(1);
    expect(result.language_skills[0]).toEqual({
      language_type: '',
      level: '',
    });
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0].school_name).toBe('');
    expect(result.career_history).toHaveLength(1);
    expect(result.career_history[0].company_name).toBe('');
    expect(result.introduction).toHaveLength(1);
    expect(result.introduction[0].content).toBe('');
    expect(result.licenses).toHaveLength(1);
    expect(result.licenses[0].license_name).toBe('');
  });

  it('undefined 필드가 포함된 응답에도 기본값을 적용한다', () => {
    const partial: ResumeDetail = {
      ...MINIMAL_RESPONSE,
      title: '',
      language_skills: [{ language_type: undefined, level: undefined }],
      schools: [
        {
          school_name: '',
          major_name: '',
          start_date: '',
          end_date: undefined,
          is_graduated: false,
        },
      ],
    };

    const result = mapResumeResponseToForm(partial);

    expect(result.title).toBe('');
    expect(result.language_skills[0].language_type).toBe('');
    expect(result.language_skills[0].level).toBe('');
    expect(result.schools[0].school_name).toBe('');
    expect(result.schools[0].start_date).toBe('');
    expect(result.schools[0].end_date).toBeUndefined();
  });

  it('profile 옵션이 있으면 profile_url fallback 으로 사용한다', () => {
    const noProfileUrl = { ...MINIMAL_RESPONSE, profile_url: '' };
    const result = mapResumeResponseToForm(noProfileUrl, {
      profile: {
        user_id: 1,
        profile_image_url: 'fallback.jpg',
        location: '',
        introduction: '',
        address: '',
        position_id: 0,
        career: '',
        job_status: '',
        portfolio_url: '',
        language_skills: [],
        birth_date: '',
        name: 'Test',
        country_id: 0,
        created_at: '',
      },
    });

    expect(result.profile_url).toBe('fallback.jpg');
  });

  it('잘못된 날짜 문자열은 빈 문자열로 처리한다', () => {
    const badDates: ResumeDetail = {
      ...MINIMAL_RESPONSE,
      schools: [
        {
          school_name: 'Test',
          major_name: 'CS',
          start_date: 'not-a-date',
          end_date: 'also-bad',
          is_graduated: false,
        },
      ],
    };

    const result = mapResumeResponseToForm(badDates);
    expect(result.schools[0].start_date).toBe('');
    expect(result.schools[0].end_date).toBeUndefined();
  });
});

// ── mapFormToRequest ─────────────────────────────────────────────────

describe('mapFormToRequest', () => {
  it('빈 행을 필터링한다', () => {
    const formData = emptyFormDefaults();
    const result = mapFormToRequest(formData);

    expect(result.schools).toBeUndefined();
    expect(result.career_history).toBeUndefined();
    expect(result.language_skills).toBeUndefined();
    expect(result.introduction).toBeUndefined();
    expect(result.licenses).toBeUndefined();
  });

  it('유효한 데이터만 포함한다', () => {
    const formData = mapResumeResponseToForm(FULL_RESPONSE);
    const result = mapFormToRequest(formData);

    expect(result.title).toBe('QA 테스트 이력서 (수정됨)');
    expect(result.language_skills).toHaveLength(2);
    expect(result.schools).toHaveLength(1);
    expect(result.career_history).toHaveLength(1);
    expect(result.introduction).toHaveLength(1);
    expect(result.licenses).toHaveLength(1);
  });

  it('재직중인 경력의 end_date 를 제거한다', () => {
    const formData = mapResumeResponseToForm(FULL_RESPONSE);
    // 재직중 경력에 end_date 강제 설정
    formData.career_history[0].is_working = true;
    formData.career_history[0].end_date = '2025-01-01';

    const result = mapFormToRequest(formData);
    const career = result.career_history?.[0];
    expect(career).toBeDefined();
    expect('end_date' in (career ?? {})).toBe(false);
  });

  it('language_type 만 있고 level 이 없으면 제외한다', () => {
    const formData = emptyFormDefaults();
    formData.language_skills = [{ language_type: '한국어', level: '' }];

    const result = mapFormToRequest(formData);
    expect(result.language_skills).toBeUndefined();
  });
});

// ── emptyFormDefaults ────────────────────────────────────────────────

describe('emptyFormDefaults', () => {
  it('모든 배열 필드에 빈 항목 1개를 포함한다', () => {
    const defaults = emptyFormDefaults();

    expect(defaults.title).toBe('');
    expect(defaults.language_skills).toHaveLength(1);
    expect(defaults.schools).toHaveLength(1);
    expect(defaults.career_history).toHaveLength(1);
    expect(defaults.introduction).toHaveLength(1);
    expect(defaults.licenses).toHaveLength(1);
  });
});
