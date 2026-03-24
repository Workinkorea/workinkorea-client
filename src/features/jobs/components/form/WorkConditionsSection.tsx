'use client';

import { Clock, DollarSign } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { CreateCompanyPostRequest } from '@/shared/types/api';
import DaumPostcodeSearch from '@/shared/ui/DaumPostcodeSearch';
import { SectionHeader } from './SectionHeader';
import { FormField } from './FormField';
import { FIELD_BASE, FIELD_DEFAULT, FIELD_ERROR, FIELD_SELECT } from './fieldStyles';

interface WorkConditionsSectionProps {
  formData: Pick<CreateCompanyPostRequest, 'employment_type' | 'working_hours' | 'salary'>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isNegotiableSalary: boolean;
  baseAddress: string;
  detailAddress: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onAddressComplete: (address: string) => void;
  onDetailAddressChange: (value: string) => void;
  onNegotiableSalaryChange: (checked: boolean) => void;
}

/**
 * STEP 2 — 근무 조건 섹션
 * 포함 필드: 고용 형태, 주당 근무 시간, 연봉(급여 협의 토글), 근무 위치(다음 우편번호)
 *
 * 반응형 레이아웃:
 * - Mobile  (<md): 1단 (w-full)
 * - Tablet+ (≥md): 고용형태+주당근무시간 → 2단 grid
 *
 * UX:
 * - 급여 협의 체크 즉시 연봉 입력 비활성화 → 상태 전환 즉각 인지
 * - DaumPostcodeSearch + 상세주소 input 2단 구성
 */
export function WorkConditionsSection({
  formData,
  errors,
  isSubmitting,
  isNegotiableSalary,
  baseAddress,
  detailAddress,
  onChange,
  onAddressComplete,
  onDetailAddressChange,
  onNegotiableSalaryChange,
}: WorkConditionsSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <SectionHeader
        step={2}
        icon={<Clock size={16} />}
        title="근무 조건"
        description="고용 형태, 근무 지역, 급여 정보를 입력하세요"
      />

      <div className="space-y-4 md:space-y-5">
        {/* 고용 형태 + 주당 근무 시간: 태블릿 이상 2단 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="고용 형태">
            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={onChange}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT, FIELD_SELECT)}
            >
              <option value="정규직">정규직</option>
              <option value="계약직">계약직</option>
              <option value="인턴">인턴</option>
              <option value="프리랜서">프리랜서</option>
            </select>
          </FormField>

          <FormField
            label="주당 근무 시간"
            hint="법정 기준: 주 40시간"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="working_hours"
                value={formData.working_hours}
                onChange={onChange}
                disabled={isSubmitting}
                min="1"
                max="80"
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'flex-1')}
              />
              <span className="text-body-3 text-slate-500 shrink-0">시간 / 주</span>
            </div>
          </FormField>
        </div>

        {/* 연봉 — 급여 협의 체크박스 포함
            UX: 체크 즉시 입력 필드 비활성화 + 시각적 변화로 상태 명시 */}
        <FormField label="연봉" error={errors.salary}>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                {/* DollarSign 아이콘: 입력 필드 내 왼쪽 고정 */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <DollarSign size={15} />
                </div>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={onChange}
                  disabled={isNegotiableSalary || isSubmitting}
                  min="0"
                  step="1000000"
                  className={cn(
                    FIELD_BASE,
                    'pl-9',
                    errors.salary ? FIELD_ERROR : FIELD_DEFAULT,
                    /* 협의 가능 선택 시 시각적 비활성 표시 강화 */
                    isNegotiableSalary && 'bg-slate-100 text-slate-400 cursor-not-allowed',
                  )}
                  placeholder="예: 40000000"
                />
              </div>
              <span className="text-body-3 text-slate-500 shrink-0">원 / 년</span>
            </div>

            {/* 급여 협의 체크박스 */}
            <label className="flex items-center gap-2 cursor-pointer w-fit group">
              <input
                type="checkbox"
                checked={isNegotiableSalary}
                onChange={e => onNegotiableSalaryChange(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
              />
              <span className="text-caption-1 text-slate-600 select-none group-hover:text-slate-800 transition-colors">
                급여 협의 가능
              </span>
            </label>
          </div>
        </FormField>

        {/* 근무 위치 — Daum 주소 검색 + 상세주소 */}
        <FormField label="근무 위치" required error={errors.work_location}>
          <div className="space-y-2">
            {/* DaumPostcodeSearch: 기본 주소 검색 (input + 검색 버튼 내장) */}
            <DaumPostcodeSearch
              value={baseAddress}
              onChange={onAddressComplete}
              placeholder="주소 검색 버튼을 클릭하세요"
              /* error prop을 넘기지 않아 에러 메시지 중복 방지
                 (에러 표시는 FormField의 AnimatePresence에서 처리) */
            />

            {/* 상세 주소 입력 */}
            <input
              type="text"
              value={detailAddress}
              onChange={e => onDetailAddressChange(e.target.value)}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT)}
              placeholder="상세 주소 (동/호수 등, 선택)"
            />
          </div>
        </FormField>
      </div>
    </div>
  );
}
