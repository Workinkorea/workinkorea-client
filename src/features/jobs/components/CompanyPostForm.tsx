'use client';

/**
 * CompanyPostForm — 채용 공고 등록/수정 폼 오케스트레이터
 *
 * [컴포넌트 분리 구조 (FSD)]
 *   form/BasicInfoSection        — STEP 1: 공고 제목, 직무, 경력, 학력, 언어, 상세 설명
 *   form/WorkConditionsSection   — STEP 2: 고용 형태, 주당 근무 시간, 연봉, 근무 위치
 *   form/RecruitmentPeriodSection — STEP 3: 모집 시작일 / 종료일
 *   form/ManagerInfoSection      — STEP 4: 담당자 이름, 연락처, 이메일 (기업 정보 자동입력)
 *
 * [반응형 전략]
 *   Mobile  (<768px): 1단, 폼 전체에 pb-24 여백 → 하단 고정 버튼 바가 콘텐츠를 가리지 않음
 *   Tablet  (≥768px): 섹션 내 연관 필드 2단 grid
 *   Desktop (≥1024px): CompanyPostCreateClient의 max-w-4xl 컨테이너가 너비 제한
 *
 * [UX 포인트]
 *   1. isSubmitting 오버레이: 제출 중 폼 전체 dim + 스피너 → 중복 제출 방지
 *   2. 유효성 실패 시 첫 번째 에러 필드로 자동 스크롤
 *   3. 모바일 sticky 버튼 바: 항상 화면 하단에 노출, 스크롤에도 접근성 유지
 *   4. "내 기업 정보와 동일": fetchClient로 기업 프로필 조회 후 담당자 정보 자동 입력
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/utils';
import { fetchClient } from '@/shared/api/fetchClient';
import {
  CreateCompanyPostRequest,
  UpdateCompanyPostRequest,
  CompanyProfileResponse,
} from '@/shared/types/api';

import { BasicInfoSection } from './form/BasicInfoSection';
import { WorkConditionsSection } from './form/WorkConditionsSection';
import { RecruitmentPeriodSection } from './form/RecruitmentPeriodSection';
import { ManagerInfoSection, type ManagerInfo } from './form/ManagerInfoSection';

// ── 타입 ──────────────────────────────────────────────────────────────────────

interface CompanyPostFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateCompanyPostRequest | UpdateCompanyPostRequest>;
  onSubmit: (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function CompanyPostForm({
  mode,
  initialData,
  onSubmit,
  onDelete,
  isSubmitting = false,
}: CompanyPostFormProps) {

  // ── 폼 상태 ────────────────────────────────────────────────────────────────

  const [formData, setFormData] = useState<CreateCompanyPostRequest>({
    title:           '',
    content:         '',
    work_experience: '경력무관',
    position_id:     1,
    education:       '학력무관',
    language:        '한국어 능통',
    employment_type: '정규직',
    work_location:   '',
    working_hours:   40,
    salary:          0,
    start_date: new Date().toISOString().split('T')[0],
    end_date:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...initialData,
  });

  const [errors,             setErrors]            = useState<Record<string, string>>({});
  const [isNegotiableSalary, setIsNegotiableSalary] = useState(false);
  const [baseAddress,        setBaseAddress]        = useState('');
  const [detailAddress,      setDetailAddress]      = useState('');

  // 담당자 정보 — UI 전용 (현재 API payload 미포함, 추후 확장 가능)
  const [managerInfo, setManagerInfo] = useState<ManagerInfo>({
    manager_name:  '',
    manager_phone: '',
    manager_email: '',
  });

  // edit 모드: 기존 주소/급여 상태 복원
  useEffect(() => {
    if (initialData?.work_location) {
      const parts = initialData.work_location.split('|');
      setBaseAddress(parts[0].trim());
      if (parts.length === 2) setDetailAddress(parts[1].trim());
    }
    if (initialData?.salary === 0) setIsNegotiableSalary(true);
  }, [initialData]);

  // ── 핸들러 ─────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['working_hours', 'salary', 'position_id'].includes(name)
        ? Number(value)
        : value,
    }));
    // 수정 즉시 해당 필드 에러 제거 → 긍정적 피드백
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressComplete = (address: string) => {
    setBaseAddress(address);
    if (errors.work_location) setErrors(prev => ({ ...prev, work_location: '' }));
  };

  const handleNegotiableSalaryChange = (checked: boolean) => {
    setIsNegotiableSalary(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, salary: 0 }));
      setErrors(prev => ({ ...prev, salary: '' }));
    }
  };

  const handleManagerInfoChange = (key: keyof ManagerInfo, value: string) => {
    setManagerInfo(prev => ({ ...prev, [key]: value }));
  };

  /** "내 기업 정보와 동일" — 기업 프로필 API로 담당자 정보 자동 입력 */
  const handleFillFromCompany = async () => {
    try {
      const profile = await fetchClient.get<CompanyProfileResponse>('/api/company-profile');
      setManagerInfo({
        manager_name:  profile.representative_name ?? '',
        manager_phone: profile.phone_number ?? '',
        manager_email: profile.email ?? '',
      });
      toast.success('기업 담당자 정보가 자동 입력되었습니다');
    } catch {
      toast.error('기업 정보를 불러오지 못했습니다');
    }
  };

  // ── 유효성 검사 ────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim())
      newErrors.title         = '공고 제목을 입력해주세요.';
    if (!formData.content.trim())
      newErrors.content       = '상세 설명을 입력해주세요.';
    if (!baseAddress)
      newErrors.work_location = '근무 위치를 입력해주세요.';
    if (!isNegotiableSalary && formData.salary <= 0)
      newErrors.salary        = '연봉을 입력하거나 급여 협의 가능을 선택해주세요.';

    setErrors(newErrors);

    // 첫 번째 에러 필드로 자동 스크롤
    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return Object.keys(newErrors).length === 0;
  };

  // ── 폼 제출 ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullAddress = detailAddress
      ? `${baseAddress} | ${detailAddress}`
      : baseAddress;

    onSubmit({
      ...formData,
      work_location: fullAddress,
      salary:        isNegotiableSalary ? 0 : formData.salary,
    });
  };

  // ── 공용 액션 버튼 JSX ─────────────────────────────────────────────────────
  // 데스크탑(md 이상)과 모바일 sticky 바에서 동일한 버튼을 재사용

  const deleteButton = mode === 'edit' && onDelete && (
    <motion.button
      type="button"
      onClick={onDelete}
      disabled={isSubmitting}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
        'border border-red-300 text-red-500',
        'hover:bg-red-50 hover:border-red-400 transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2',
      )}
      whileHover={!isSubmitting ? { scale: 1.01 } : {}}
      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
    >
      <Trash2 size={15} />
      공고 삭제
    </motion.button>
  );

  const submitButton = (extraClassName?: string) => (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg font-semibold text-sm text-white',
        'bg-blue-600 hover:bg-blue-700 transition-colors',
        'shadow-[0_4px_14px_rgba(79,70,229,0.25)]',   // --shadow-blue (indigo 기반)
        'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        extraClassName,
      )}
      whileHover={!isSubmitting ? { scale: 1.01 } : {}}
      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
    >
      {isSubmitting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {mode === 'create' ? '등록 중...' : '수정 중...'}
        </>
      ) : (
        <>
          <Save size={16} />
          {mode === 'create' ? '공고 등록하기' : '공고 수정하기'}
        </>
      )}
    </motion.button>
  );

  // ── 렌더링 ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative">

      {/* 제출 중 오버레이
          UX: 전체 폼 dim + 스피너 → 중복 제출 방지 + 진행 상태 명시 */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-lg">
            <Loader2 size={18} className="text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-700">
              {mode === 'create' ? '공고를 등록하는 중...' : '공고를 수정하는 중...'}
            </span>
          </div>
        </div>
      )}

      {/* 폼
          pb-24 md:pb-0: 모바일에서 sticky 버튼 바(높이 ~72px)가 콘텐츠를 가리지 않도록 여백 확보 */}
      <form
        id="company-post-form"
        onSubmit={handleSubmit}
        className="space-y-3 md:space-y-4 pb-24 md:pb-0"
      >
        {/* STEP 1: 기본 정보 */}
        <BasicInfoSection
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
        />

        {/* STEP 2: 근무 조건 */}
        <WorkConditionsSection
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          isNegotiableSalary={isNegotiableSalary}
          baseAddress={baseAddress}
          detailAddress={detailAddress}
          onChange={handleChange}
          onAddressComplete={handleAddressComplete}
          onDetailAddressChange={setDetailAddress}
          onNegotiableSalaryChange={handleNegotiableSalaryChange}
        />

        {/* STEP 3: 모집 기간 */}
        <RecruitmentPeriodSection
          formData={formData}
          isSubmitting={isSubmitting}
          onChange={handleChange}
        />

        {/* STEP 4: 담당자 정보 */}
        <ManagerInfoSection
          managerInfo={managerInfo}
          isSubmitting={isSubmitting}
          onManagerInfoChange={handleManagerInfoChange}
          onFillFromCompany={handleFillFromCompany}
        />

        {/* ── 데스크탑 액션 버튼 (md 이상에서만 표시) ──────────────────────
            Primary 버튼(blue-600)과 Destructive 버튼(red-300 border)을
            색상으로 명확히 구분해 실수로 인한 삭제를 방지 */}
        <div className="hidden md:flex gap-3 justify-end pt-2 pb-4">
          {deleteButton}
          {submitButton()}
        </div>
      </form>

      {/* ── 모바일 sticky 버튼 바 (md 미만에서만 표시) ───────────────────────
          UX: 길어진 폼 양식에서도 제출 버튼에 즉시 접근 가능
          fixed 포지셔닝으로 스크롤 위치와 무관하게 항상 하단 고정
          shadow-[0_-4px_20px_...]: 위 방향 그림자로 sticky 느낌 강조 */}
      <div
        className={cn(
          'md:hidden fixed bottom-0 left-0 right-0 z-20',
          'flex items-center gap-3 px-4 py-3',
          'bg-white border-t border-slate-200',
          'shadow-[0_-4px_20px_rgba(0,0,0,0.08)]',
        )}
      >
        {/* 삭제 버튼 (edit 모드에서만) */}
        {mode === 'edit' && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-1.5 shrink-0',
              'px-4 py-2.5 rounded-lg font-semibold text-sm',
              'border border-red-300 text-red-500',
              'hover:bg-red-50 transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
              'focus:outline-none',
            )}
          >
            <Trash2 size={15} />
            삭제
          </button>
        )}

        {/* 등록/수정 버튼: flex-1로 가용 너비 모두 차지 */}
        <button
          type="submit"
          form="company-post-form"
          disabled={isSubmitting}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-2',
            'py-2.5 rounded-lg font-semibold text-sm text-white',
            'bg-blue-600 hover:bg-blue-700 transition-colors',
            'shadow-[0_4px_14px_rgba(79,70,229,0.25)]',
            'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer',
            'focus:outline-none',
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {mode === 'create' ? '등록 중...' : '수정 중...'}
            </>
          ) : (
            <>
              <Save size={16} />
              {mode === 'create' ? '공고 등록하기' : '공고 수정하기'}
            </>
          )}
        </button>
      </div>

    </div>
  );
}
