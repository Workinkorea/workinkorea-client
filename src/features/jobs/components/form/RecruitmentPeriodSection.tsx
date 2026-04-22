'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { CreateCompanyPostRequest } from '@/shared/types/api';
import { SectionHeader } from './SectionHeader';
import { FormField } from './FormField';
import { FIELD_BASE, FIELD_DEFAULT } from './fieldStyles';

interface RecruitmentPeriodSectionProps {
  formData: Pick<CreateCompanyPostRequest, 'start_date' | 'end_date'>;
  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

/**
 * STEP 3 — 모집 기간 섹션
 * 포함 필드: 게시 시작일, 게시 종료일
 *
 * 반응형 레이아웃:
 * - Mobile  (<md): 1단 (시작일 → 종료일 순서로 쌓임)
 * - Tablet+ (≥md): 2단 grid (시작일 | 종료일)
 */
export function RecruitmentPeriodSection({
  formData,
  isSubmitting,
  onChange,
}: RecruitmentPeriodSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <SectionHeader
        step={3}
        icon={<Calendar size={16} />}
        title="모집 기간"
        description="채용 공고를 게시할 기간을 설정하세요"
      />

      {/* 태블릿 이상에서 2단: 시작일 | 종료일 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="게시 시작일" htmlFor="start_date">
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={onChange}
            disabled={isSubmitting}
            className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
          />
        </FormField>

        <FormField label="게시 종료일" htmlFor="end_date">
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={onChange}
            disabled={isSubmitting}
            className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
          />
        </FormField>
      </div>
    </div>
  );
}
