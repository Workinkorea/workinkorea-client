'use client';

import { Briefcase, Languages } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import {
  POSITION_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  EDUCATION_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/shared/constants/jobOptions';
import { CreateCompanyPostRequest } from '@/shared/types/api';
import { SectionHeader } from './SectionHeader';
import { FormField } from './FormField';
import { FIELD_BASE, FIELD_DEFAULT, FIELD_ERROR, FIELD_SELECT } from './fieldStyles';

interface BasicInfoSectionProps {
  formData: Pick<
    CreateCompanyPostRequest,
    'title' | 'position_id' | 'work_experience' | 'education' | 'language' | 'content'
  >;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

/**
 * STEP 1 — 기본 정보 섹션
 * 포함 필드: 공고 제목, 직무, 경력 요건, 학력 요건, 언어 요건, 상세 설명
 *
 * 반응형 레이아웃:
 * - Mobile  (<md): 모든 필드 1단 (w-full)
 * - Tablet+ (≥md): 직무+경력, 학력+언어 쌍을 각각 2단 grid로 배치
 */
export function BasicInfoSection({
  formData,
  errors,
  isSubmitting,
  onChange,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <SectionHeader
        step={1}
        icon={<Briefcase size={16} />}
        title="기본 정보"
        description="채용 공고의 기본 정보와 자격 요건을 입력하세요"
      />

      <div className="space-y-4 md:space-y-5">
        {/* 공고 제목 */}
        <FormField label="공고 제목" htmlFor="title" required error={errors.title}>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            disabled={isSubmitting}
            className={cn(FIELD_BASE, errors.title ? FIELD_ERROR : FIELD_DEFAULT)}
            placeholder="예: 외국인 환영! 프론트엔드 개발자 모집"
          />
        </FormField>

        {/* 직무 + 경력 요건: 태블릿 이상 2단 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="직무" htmlFor="position_id" required>
            <select
              id="position_id"
              name="position_id"
              value={String(formData.position_id)}
              onChange={onChange}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT, FIELD_SELECT)}
            >
              {POSITION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="경력 요건" htmlFor="work_experience">
            <select
              id="work_experience"
              name="work_experience"
              value={formData.work_experience}
              onChange={onChange}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT, FIELD_SELECT)}
            >
              {WORK_EXPERIENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* 학력 요건 + 언어 요건: 태블릿 이상 2단 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="학력 요건" htmlFor="education">
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={onChange}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT, FIELD_SELECT)}
            >
              {EDUCATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="언어 요건" htmlFor="language">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Languages size={15} />
              </div>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={onChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, FIELD_SELECT, 'pl-9')}
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </FormField>
        </div>

        {/* 상세 설명 — 모바일에서도 충분한 높이 확보 */}
        <FormField label="상세 설명" htmlFor="content" required error={errors.content}>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={onChange}
            disabled={isSubmitting}
            rows={8}
            maxLength={5000}
            className={cn(
              FIELD_BASE,
              errors.content ? FIELD_ERROR : FIELD_DEFAULT,
              'resize-y min-h-[140px]',
            )}
            placeholder={
              '채용 공고 상세 내용을 입력하세요\n\n예) 주요 업무, 자격 요건, 우대 사항, 복지 및 혜택 등'
            }
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-caption-3 text-slate-400">최소 30자 이상 입력해주세요</p>
            <p
              className={cn(
                'text-caption-3 font-medium',
                formData.content.length < 30 ? 'text-slate-400' : 'text-emerald-500',
              )}
            >
              {formData.content.length.toLocaleString()} / 5,000
            </p>
          </div>
        </FormField>
      </div>
    </div>
  );
}
