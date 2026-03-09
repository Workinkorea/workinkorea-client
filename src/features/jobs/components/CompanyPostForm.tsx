'use client';

/**
 * [UX 개선 요약]
 * 1. 섹션 번호 + 아이콘 배경: 각 섹션에 순서 번호와 blue-50 아이콘 배경을 부여해
 *    사용자가 폼을 순서대로 채워야 함을 인지하도록 유도 (인지 부하 감소)
 * 2. 디자인 토큰 통일: border-slate-200, focus:ring-blue-100, text-[13px] font-semibold
 *    → Blue Design System 토큰을 일관되게 적용해 브랜드 일관성 유지
 * 3. 에러 shake 애니메이션: 유효성 실패 시 필드가 흔들려 오류 위치를 즉각 인지
 * 4. isSubmitting 오버레이: 제출 중 폼 전체를 dim + 스피너로 처리해
 *    중복 클릭 방지 + 진행 상태 명시 (작업 진행 중임을 사용자에게 피드백)
 * 5. 버튼 아이콘 스피너: 등록하기 버튼 내부에 인라인 스피너를 표시해
 *    제출 중/완료를 버튼 자체에서 확인 가능
 * 6. 급여 협의 토글: 체크 시 입력 필드가 즉각 비활성화 + 시각적 변화로 상태 명시
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Trash2, Briefcase, MapPin, Calendar,
  DollarSign, Clock, GraduationCap, Languages, Loader2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { CreateCompanyPostRequest, UpdateCompanyPostRequest } from '@/shared/types/api';
import DaumPostcodeSearch from '@/shared/ui/DaumPostcodeSearch';
import {
  POSITION_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  EDUCATION_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/shared/constants/jobOptions';

// ── 타입 정의 ─────────────────────────────────────────────────────────────────
interface CompanyPostFormProps {
  mode:          'create' | 'edit';
  initialData?:  Partial<CreateCompanyPostRequest | UpdateCompanyPostRequest>;
  onSubmit:      (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => void;
  onDelete?:     () => void;
  isSubmitting?: boolean;
}

// ── 공통 스타일 상수 (Blue Design System 토큰) ────────────────────────────────
// 중앙 집중식 스타일 관리로 토큰 일관성 보장 및 유지보수성 향상
const FIELD_BASE = cn(
  'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors',
  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
  'placeholder:text-slate-400',
);
const FIELD_ERROR   = 'border-red-500 focus:border-red-500 focus:ring-red-100';
const FIELD_DEFAULT = 'border-slate-200';
const LABEL_BASE    = 'block text-[13px] font-semibold text-slate-700 mb-1.5';
const REQUIRED_MARK = 'text-red-500 ml-0.5';
const ERROR_MSG     = 'mt-1 text-[11px] text-red-500';

// ── 섹션 헤더 컴포넌트 ─────────────────────────────────────────────────────────
// UX 근거: 번호 + 아이콘으로 폼 진행 순서를 시각화해 완료해야 할 작업량을 사전에 인지
function SectionHeader({
  step, icon, title,
}: { step: number; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {/* 아이콘 배경: blue-50으로 섹션 시작을 시각적으로 구분 */}
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          STEP {step}
        </span>
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
      </div>
    </div>
  );
}

// ── 폼 필드 래퍼 컴포넌트 ─────────────────────────────────────────────────────
// UX 근거: 에러 시 shake 애니메이션으로 오류 위치를 즉각 시각화
function FormField({
  label, required = false, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <label className={LABEL_BASE}>
        {label}
        {required && <span className={REQUIRED_MARK}>*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            className={ERROR_MSG}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── 메인 폼 컴포넌트 ──────────────────────────────────────────────────────────
export function CompanyPostForm({
  mode, initialData, onSubmit, onDelete, isSubmitting = false,
}: CompanyPostFormProps) {
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

  // initialData 주입: edit 모드에서 기존 주소·급여 상태를 복원
  useEffect(() => {
    if (initialData?.work_location) {
      const parts = initialData.work_location.split('|');
      setBaseAddress(parts[0].trim());
      if (parts.length === 2) setDetailAddress(parts[1].trim());
    }
    if (initialData?.salary === 0) setIsNegotiableSalary(true);
  }, [initialData]);

  // ── 입력 변경 핸들러 ──────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['working_hours', 'salary', 'position_id'].includes(name) ? Number(value) : value,
    }));
    // 수정 즉시 해당 필드 에러를 지워 사용자에게 긍정적 피드백 제공
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── 유효성 검사 ──────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim())                       newErrors.title         = '공고 제목을 입력해주세요.';
    if (!formData.content.trim())                     newErrors.content       = '상세 설명을 입력해주세요.';
    if (!baseAddress)                                 newErrors.work_location = '근무 위치를 입력해주세요.';
    if (!isNegotiableSalary && formData.salary <= 0)  newErrors.salary        = '연봉을 입력하거나 협의 가능을 선택해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── 폼 제출 ──────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullAddress  = detailAddress ? `${baseAddress} | ${detailAddress}` : baseAddress;
    const submitData   = {
      ...formData,
      work_location: fullAddress,
      salary:        isNegotiableSalary ? 0 : formData.salary,
    };
    onSubmit(submitData);
  };

  // ── 주소 검색 완료 핸들러 ─────────────────────────────────────────────────
  const handleAddressComplete = (address: string) => {
    setBaseAddress(address);
    setFormData(prev => ({ ...prev, work_location: address }));
    if (errors.work_location) setErrors(prev => ({ ...prev, work_location: '' }));
  };

  // ── 렌더링 ───────────────────────────────────────────────────────────────
  return (
    // isSubmitting 오버레이: 제출 중 폼 전체를 dim 처리해 중복 제출을 차단
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-lg">
            <Loader2 size={18} className="text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-700">
              {mode === 'create' ? '공고를 등록하는 중...' : '공고를 수정하는 중...'}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── STEP 1: 기본 정보 ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <SectionHeader step={1} icon={<Briefcase size={16} />} title="기본 정보" />

          <div className="space-y-4">
            <FormField label="공고 제목" required error={errors.title}>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, errors.title ? FIELD_ERROR : FIELD_DEFAULT)}
                placeholder="예: 외국인 환영! 프론트엔드 개발자 모집"
              />
            </FormField>

            <FormField label="포지션" required>
              <select
                id="position_id"
                name="position_id"
                value={String(formData.position_id)}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              >
                {POSITION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="상세 설명" required error={errors.content}>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={8}
                className={cn(FIELD_BASE, errors.content ? FIELD_ERROR : FIELD_DEFAULT, 'resize-y')}
                placeholder="채용 공고 상세 내용을 입력하세요&#10;&#10;예) 주요 업무, 자격 요건, 우대 사항, 복지 및 혜택 등"
              />
            </FormField>
          </div>
        </div>

        {/* ── STEP 2: 자격 요건 ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <SectionHeader step={2} icon={<GraduationCap size={16} />} title="자격 요건" />

          <div className="space-y-4">
            <FormField label="경력 요건">
              <select
                id="work_experience"
                name="work_experience"
                value={formData.work_experience}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              >
                {WORK_EXPERIENCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="학력 요건">
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              >
                {EDUCATION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="언어 요건">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Languages size={15} />
                </div>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={cn(FIELD_BASE, FIELD_DEFAULT, 'pl-9 cursor-pointer')}
                >
                  {LANGUAGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </FormField>
          </div>
        </div>

        {/* ── STEP 3: 근무 조건 ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <SectionHeader step={3} icon={<Clock size={16} />} title="근무 조건" />

          <div className="space-y-4">
            <FormField label="고용 형태">
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              >
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
                <option value="프리랜서">프리랜서</option>
              </select>
            </FormField>

            {/* 근무 위치: Daum 주소 검색 + 상세 주소 입력 */}
            <FormField label="근무 위치" required error={errors.work_location}>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <MapPin size={15} />
                    </div>
                    <input
                      type="text"
                      value={baseAddress}
                      readOnly
                      className={cn(
                        FIELD_BASE,
                        'pl-9 bg-slate-50 cursor-default',
                        errors.work_location ? FIELD_ERROR : FIELD_DEFAULT,
                      )}
                      placeholder="주소 검색 버튼을 클릭하세요"
                    />
                  </div>
                  <DaumPostcodeSearch
                    value={baseAddress}
                    onChange={handleAddressComplete}
                    error={errors.work_location}
                  />
                </div>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={e => setDetailAddress(e.target.value)}
                  disabled={isSubmitting}
                  className={cn(FIELD_BASE, FIELD_DEFAULT)}
                  placeholder="상세 주소 (동/호수 등, 선택)"
                />
              </div>
            </FormField>

            {/* 주당 근무 시간 */}
            <FormField label="주당 근무 시간">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="working_hours"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="1"
                  max="80"
                  className={cn(FIELD_BASE, FIELD_DEFAULT, 'w-28')}
                />
                <span className="text-sm text-slate-500">시간 / 주</span>
              </div>
            </FormField>

            {/* 연봉: 급여 협의 토글 포함
                UX 근거: 체크 즉시 입력 필드가 비활성화되어 상태 전환을 즉각 인지 */}
            <FormField label="연봉" error={errors.salary}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <DollarSign size={15} />
                    </div>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      disabled={isNegotiableSalary || isSubmitting}
                      min="0"
                      step="1000000"
                      className={cn(
                        FIELD_BASE,
                        'pl-9',
                        errors.salary ? FIELD_ERROR : FIELD_DEFAULT,
                        (isNegotiableSalary || isSubmitting) && 'bg-slate-50 text-slate-400 cursor-not-allowed',
                      )}
                      placeholder="예: 40000000"
                    />
                  </div>
                  <span className="text-sm text-slate-500 shrink-0">원 / 년</span>
                </div>
                {/* 급여 협의 체크박스 */}
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={isNegotiableSalary}
                    onChange={e => {
                      setIsNegotiableSalary(e.target.checked);
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, salary: 0 }));
                        setErrors(prev => ({ ...prev, salary: '' }));
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[13px] text-slate-600 select-none">급여 협의 가능</span>
                </label>
              </div>
            </FormField>
          </div>
        </div>

        {/* ── STEP 4: 모집 기간 ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <SectionHeader step={4} icon={<Calendar size={16} />} title="모집 기간" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="시작일">
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              />
            </FormField>
            <FormField label="종료일">
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className={cn(FIELD_BASE, FIELD_DEFAULT, 'cursor-pointer')}
              />
            </FormField>
          </div>
        </div>

        {/* ── 액션 버튼 ──────────────────────────────────────────────────
            UX 근거: Primary 버튼(bg-blue-600)과 Destructive 버튼(border-red-500)을
            색상으로 명확히 구분해 실수로 인한 삭제를 방지합니다.
            isSubmitting 중에는 스피너가 표시되어 작업 완료 대기 상태를 명시합니다.
        ──────────────────────────────────────────────────────────────── */}
        <div className="flex gap-3 justify-end pb-4">
          {mode === 'edit' && onDelete && (
            <motion.button
              type="button"
              onClick={onDelete}
              disabled={isSubmitting}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm',
                'border border-red-300 text-red-500',
                'hover:bg-red-50 hover:border-red-400 transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2',
              )}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <Trash2 size={16} />
              삭제
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white',
              'bg-blue-600 hover:bg-blue-700 transition-colors',
              'shadow-[0_4px_14px_rgba(37,99,235,0.25)]',
              'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            )}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
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
        </div>

      </form>
    </div>
  );
}
