import { describe, it, expect, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import ResumeEditor from '@/features/resume/components/ResumeEditor';
import { renderWithProviders } from '@/shared/test-utils/render-with-providers';
import type { ResumeFormData } from '@/features/resume/lib/mapResumeForm';

vi.mock('@/features/resume/api/resumeApi', () => ({
  resumeApi: {
    getResumeById: vi.fn(),
    createResume: vi.fn(),
    updateResume: vi.fn(),
  },
}));
vi.mock('@/features/profile/api/profileApi', () => ({
  profileApi: {
    getProfile: vi.fn().mockResolvedValue({ name: 'Tester', birth_date: '1990-01-01', country_id: 122 }),
    getContact: vi.fn().mockResolvedValue({ email: 't@example.com', phone_number: '010-0000-0000' }),
  },
}));

// DatePicker imports react-datepicker CSS which trips up vitest's PostCSS loader.
// Replace with a minimal stub that preserves the value/onChange API used by the form.
vi.mock('@/shared/ui/DatePicker', () => ({
  default: ({ value, onChange, placeholder }: { value?: string; onChange?: (v: string) => void; placeholder?: string }) => (
    <input
      type="text"
      data-testid="datepicker-stub"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

function makeDefaults(): ResumeFormData {
  return {
    title: 'QA 테스트 이력서 (수정됨)',
    profile_url: '',
    language_skills: [{ language_type: 'ko', level: 'native' }],
    schools: [
      {
        school_name: '테스트 대학교',
        major_name: '컴퓨터공학',
        start_date: '2010-03-01',
        end_date: '2014-02-28',
        is_graduated: true,
      },
    ],
    career_history: [],
    introduction: [],
    licenses: [],
  } as ResumeFormData;
}

describe('ResumeEditor pre-fill (P1 리그레션)', () => {
  it('isEditMode + formDefaults 로 렌더되면 title input 에 값이 채워진다', async () => {
    const defaults = makeDefaults();
    renderWithProviders(
      <ResumeEditor templateType="modern" formDefaults={defaults} isEditMode resumeId={10} />,
    );

    const titleInput = (await screen.findByDisplayValue('QA 테스트 이력서 (수정됨)')) as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe('QA 테스트 이력서 (수정됨)');
  });

  it('formDefaults 가 비동기로 변경되면 reset 으로 폼이 갱신된다', async () => {
    const defaults1 = makeDefaults();
    const { rerender } = renderWithProviders(
      <ResumeEditor templateType="modern" formDefaults={defaults1} isEditMode resumeId={10} />,
    );

    const titleInput = (await screen.findByDisplayValue('QA 테스트 이력서 (수정됨)')) as HTMLInputElement;
    expect(titleInput.value).toBe('QA 테스트 이력서 (수정됨)');

    const defaults2: ResumeFormData = { ...defaults1, title: '두번째 버전' };
    rerender(
      <ResumeEditor templateType="modern" formDefaults={defaults2} isEditMode resumeId={10} />,
    );

    await waitFor(() => {
      const input = screen.getByDisplayValue('두번째 버전') as HTMLInputElement;
      expect(input.value).toBe('두번째 버전');
    });
  });
});
