'use client';

import { User, Phone, Mail, Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { FormField } from './FormField';
import { FIELD_BASE, FIELD_DEFAULT } from './fieldStyles';

export interface ManagerInfo {
  manager_name: string;
  manager_phone: string;
  manager_email: string;
}

interface ManagerInfoSectionProps {
  managerInfo: ManagerInfo;
  isSubmitting: boolean;
  onManagerInfoChange: (key: keyof ManagerInfo, value: string) => void;
  /** "내 기업 정보와 동일" 클릭 시 → 기업 프로필에서 자동 입력 */
  onFillFromCompany: () => void;
}

/**
 * STEP 4 — 담당자 정보 섹션
 * 포함 필드: 담당자 이름, 연락처, 이메일
 * 특수 기능: "내 기업 정보와 동일" 버튼 → 기업 프로필 자동 입력
 *
 * 반응형 레이아웃:
 * - Mobile  (<md): 모든 필드 1단
 * - Tablet+ (≥md): 연락처 + 이메일 → 2단 grid
 *
 * Note: 담당자 정보는 현재 API CreateCompanyPostRequest에 포함되지 않는
 *       UI 전용 필드입니다. 추후 API 확장 시 onSubmit 데이터에 포함하세요.
 */
export function ManagerInfoSection({
  managerInfo,
  isSubmitting,
  onManagerInfoChange,
  onFillFromCompany,
}: ManagerInfoSectionProps) {
  return (
    <div className="bg-background-default border border-line-400 rounded-xl p-5 md:p-6">
      {/* 섹션 헤더 — 오른쪽에 "내 기업 정보와 동일" 버튼이 있어 SectionHeader 대신 커스텀 렌더 */}
      <div className="flex items-start justify-between gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-line-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <User size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded tracking-wide">
                STEP 4
              </span>
              <h2 className="text-[15px] font-bold text-label-900">담당자 정보</h2>
            </div>
            <p className="text-xs text-label-400">지원자가 문의할 담당자 정보를 입력하세요</p>
          </div>
        </div>

        {/* "내 기업 정보와 동일" — secondary 버튼 패턴 */}
        <button
          type="button"
          onClick={onFillFromCompany}
          disabled={isSubmitting}
          className={cn(
            'inline-flex items-center gap-1.5 shrink-0',
            'px-3 py-1.5 text-caption-2 font-semibold rounded-lg transition-colors cursor-pointer',
            'border border-blue-200 text-blue-600 bg-blue-50',
            'hover:bg-blue-100 hover:border-blue-300',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <Building2 size={13} />
          <span className="hidden sm:inline">내 기업 정보와 동일</span>
          {/* 모바일에서는 아이콘만 표시 */}
          <span className="sm:hidden">자동입력</span>
        </button>
      </div>

      <div className="space-y-4 md:space-y-5">
        {/* 담당자 이름 */}
        <FormField label="담당자 이름">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-label-400 pointer-events-none">
              <User size={15} />
            </div>
            <input
              type="text"
              value={managerInfo.manager_name}
              onChange={e => onManagerInfoChange('manager_name', e.target.value)}
              disabled={isSubmitting}
              className={cn(FIELD_BASE, FIELD_DEFAULT, 'pl-9')}
              placeholder="예: 홍길동"
            />
          </div>
        </FormField>

        {/* 연락처 + 이메일: 태블릿 이상 2단 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="연락처">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-label-400 pointer-events-none">
                <Phone size={15} />
              </div>
              <input
                type="tel"
                value={managerInfo.manager_phone}
                onChange={e => onManagerInfoChange('manager_phone', e.target.value)}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'pl-9')}
                placeholder="예: 010-1234-5678"
              />
            </div>
          </FormField>

          <FormField label="이메일">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-label-400 pointer-events-none">
                <Mail size={15} />
              </div>
              <input
                type="email"
                value={managerInfo.manager_email}
                onChange={e => onManagerInfoChange('manager_email', e.target.value)}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'pl-9')}
                placeholder="예: hr@company.com"
              />
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}
