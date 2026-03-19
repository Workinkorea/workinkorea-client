'use client';

import { UseFormReturn, Controller } from 'react-hook-form';
import { X, FileText, Briefcase, Globe } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import ProfileImageUpload from '../shared/ProfileImageUpload';
import FileUploadButton from '../shared/FileUploadButton';
import LanguageSkillsInput from '../shared/LanguageSkillsInput';
import { cn } from '@/shared/lib/utils/utils';
import type { BasicProfileForm } from '../../validations/profile';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import { getPositionsByHierarchy } from '@/shared/constants/positions';

/**
 * BasicInfoSection Component
 *
 * Complex presentational component for basic profile information.
 * Composed of multiple sub-components for better organization.
 *
 * @example
 * <BasicInfoSection
 *   form={basicForm}
 *   profile={profileData}
 *   onImageSelect={(file, preview) => {
 *     setSelectedImageFile(file);
 *     setImagePreview(preview);
 *   }}
 *   onPortfolioSelect={(file) => setPortfolioFile(file)}
 *   selectedPortfolioFileName={portfolioFileName}
 *   onRemovePortfolio={() => setPortfolioFileName('')}
 * />
 *
 * Architecture Decision:
 * - Composition pattern: Uses ProfileImageUpload, FileUploadButton, LanguageSkillsInput
 * - Controlled components: Parent manages file state
 * - Form state managed by react-hook-form
 *
 * Why this structure?
 * - Separation of Concerns: Image upload ≠ form fields
 * - Reusability: Sub-components can be used elsewhere
 * - Testability: Can test image upload independently
 * - Maintainability: Each concern has its own file
 */

// Career options (matches API spec)
const CAREER_OPTIONS = [
  { key: 'NEWCOMER', label: '신입' },
  { key: 'YEAR_1_LESS', label: '1년 이하' },
  { key: 'YEAR_1', label: '1년' },
  { key: 'YEAR_2_LESS', label: '2년 이하' },
  { key: 'YEAR_2', label: '2년' },
  { key: 'YEAR_3_LESS', label: '3년 이하' },
  { key: 'YEAR_3', label: '3년' },
  { key: 'YEAR_5_LESS', label: '5년 이하' },
  { key: 'YEAR_5', label: '5년' },
  { key: 'YEAR_7_LESS', label: '7년 이하' },
  { key: 'YEAR_7', label: '7년' },
  { key: 'YEAR_10_LESS', label: '10년 이하' },
  { key: 'YEAR_10', label: '10년' },
  { key: 'YEAR_10_MORE', label: '10년 이상' },
] as const;

export interface BasicInfoSectionProps {
  /** react-hook-form instance for basic profile */
  form: UseFormReturn<BasicProfileForm>;

  /** Current profile data for display */
  profile: {
    name?: string;
    profile_image_url?: string | null;
    portfolio_url?: string | null;
  };

  /** Callback when profile image is selected */
  onImageSelect: (file: File, preview: string) => void;

  /** Callback when portfolio file is selected */
  onPortfolioSelect: (file: File) => void;

  /** Currently selected portfolio file name */
  selectedPortfolioFileName?: string;

  /** Callback to remove portfolio file */
  onRemovePortfolio: () => void;
}

// FieldRow 헬퍼 컴포넌트
const FieldRow = ({ label, required, optional, children }: {
  label: string; required?: boolean; optional?: boolean; children: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 last:border-0 items-start">
    <span className="text-caption-1 font-semibold text-slate-700 sm:pt-2.5 flex items-center gap-1.5 flex-wrap">
      {label}
      {required && <span className="text-red-500">*</span>}
      {optional && <span className="text-caption-3 font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">선택</span>}
    </span>
    <div>{children}</div>
  </div>
);

function BasicInfoSection({
  form,
  profile,
  onImageSelect,
  onPortfolioSelect,
  selectedPortfolioFileName,
  onRemovePortfolio,
}: BasicInfoSectionProps) {
  const {
    control,
    formState: { errors },
  } = form;

  // Get hierarchical position data
  const positionHierarchy = getPositionsByHierarchy();

  return (
    <div className="space-y-4">
      {/* Card 1: Profile Image */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-blue-600" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-slate-900">프로필 사진</h2>
            <p className="text-caption-3 text-slate-400 mt-0.5">채용 담당자에게 보여질 사진을 등록하세요</p>
          </div>
        </div>
        <div className="px-5 sm:px-7 py-5">
          <ProfileImageUpload
            currentImageUrl={profile.profile_image_url}
            userName={profile.name}
            onImageSelect={onImageSelect}
            maxSizeMB={5}
          />
        </div>
      </div>

      {/* Card 2: Basic Information */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase size={16} className="text-blue-600" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-slate-900">기본 정보</h2>
            <p className="text-caption-3 text-slate-400 mt-0.5">개인 정보를 입력해주세요</p>
          </div>
        </div>

        {/* Name */}
        <FieldRow label="이름" required>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="이름을 입력하세요"
                error={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
            )}
          />
          {errors.name && <p id="name-error" className="text-caption-2 text-red-500 mt-1">{errors.name.message}</p>}
        </FieldRow>

        {/* Location & Address */}
        <FieldRow label="위치" optional>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="예: 서울시 강남구"
                error={!!errors.location}
              />
            )}
          />
          {errors.location && <p className="text-caption-2 text-red-500 mt-1">{errors.location.message}</p>}
        </FieldRow>

        <FieldRow label="주소" optional>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="예: 서울특별시 강남구"
                error={!!errors.address}
              />
            )}
          />
          {errors.address && <p className="text-caption-2 text-red-500 mt-1">{errors.address.message}</p>}
        </FieldRow>

        {/* Job Status & Career */}
        <FieldRow label="구직 상태" optional>
          <Controller
            name="job_status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={cn(
                  'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'border-slate-200',
                  errors.job_status && 'border-red-500 focus:ring-red-100'
                )}
              >
                <option value="">상태를 선택하세요</option>
                <option value="available">구직중</option>
                <option value="busy">바쁨</option>
                <option value="not-looking">구직안함</option>
              </select>
            )}
          />
          {errors.job_status && <p className="text-caption-2 text-red-500 mt-1">{errors.job_status.message}</p>}
        </FieldRow>

        <FieldRow label="경력" optional>
          <Controller
            name="career"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={cn(
                  'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'border-slate-200',
                  errors.career && 'border-red-500 focus:ring-red-100'
                )}
              >
                <option value="">경력을 선택하세요</option>
                {CAREER_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.career && <p className="text-caption-2 text-red-500 mt-1">{errors.career.message}</p>}
        </FieldRow>
      </div>

      {/* Card 3: Professional Information */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Briefcase size={16} className="text-blue-600" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-slate-900">직무 정보</h2>
            <p className="text-caption-3 text-slate-400 mt-0.5">커리어 정보를 입력해주세요</p>
          </div>
        </div>

        {/* Position */}
        <FieldRow label="직무 선택" optional>
          <Controller
            name="position_id"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                className={cn(
                  'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'border-slate-200',
                  errors.position_id && 'border-red-500 focus:ring-red-100'
                )}
              >
                <option value="">직무를 선택하세요</option>
                {positionHierarchy.map((category) => (
                  <optgroup key={category.categoryCode} label={category.category}>
                    {category.subcategories.map((subcategory) =>
                      subcategory.positions.map((position) => (
                        <option key={position.id} value={position.id}>
                          {subcategory.name} - {position.name}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            )}
          />
          {errors.position_id && <p className="text-caption-2 text-red-500 mt-1">{errors.position_id.message}</p>}
        </FieldRow>

        {/* Country */}
        <FieldRow label="국적" optional>
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ?? 122}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 122)}
                className={cn(
                  'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
                  'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
                  'border-slate-200',
                  errors.country_id && 'border-red-500 focus:ring-red-100'
                )}
              >
                {COUNTRIES_FULL.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.country_id && <p className="text-caption-2 text-red-500 mt-1">{errors.country_id.message}</p>}
        </FieldRow>

        {/* Portfolio Upload */}
        <FieldRow label="포트폴리오" optional>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              {selectedPortfolioFileName || profile.portfolio_url ? (
                <div className="flex items-center gap-2">
                  <span className="text-caption-1 text-slate-700 font-medium truncate">
                    {selectedPortfolioFileName || profile.portfolio_url}
                  </span>
                  <button
                    type="button"
                    onClick={onRemovePortfolio}
                    className="text-red-500 hover:text-red-600 cursor-pointer shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-caption-1 text-slate-600">파일을 선택하거나 드래그하세요</p>
              )}
              <p className="text-caption-3 text-slate-400 mt-0.5">PDF, DOCX, 이미지 (최대 10MB)</p>
            </div>
            <FileUploadButton
              fileType="portfolio"
              maxSizeMB={10}
              acceptedTypes={[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
                'image/jpg',
              ]}
              onFileSelect={(file) => onPortfolioSelect(file)}
              buttonLabel="선택"
              hint=""
            />
          </div>
        </FieldRow>
      </div>

      {/* Card 4: Introduction & Language Skills */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Globe size={16} className="text-blue-600" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-slate-900">자기소개 & 언어 스킬</h2>
            <p className="text-caption-3 text-slate-400 mt-0.5">전문성을 표현해주세요</p>
          </div>
        </div>

        {/* Introduction */}
        <FieldRow label="자기소개" optional>
          <Controller
            name="introduction"
            control={control}
            render={({ field }) => (
              <div>
                <textarea
                  {...field}
                  placeholder="자신에 대해 간단히 소개해주세요"
                  rows={4}
                  maxLength={500}
                  className={cn(
                    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800',
                    'transition-colors focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 resize-none',
                    'border-slate-200',
                    errors.introduction && 'border-red-500 focus:ring-red-100'
                  )}
                />
                <div className="text-right text-caption-3 text-slate-400 mt-1">
                  {field.value?.length || 0}/500
                </div>
              </div>
            )}
          />
          {errors.introduction && <p className="text-caption-2 text-red-500 mt-1">{errors.introduction.message}</p>}
        </FieldRow>

        {/* Language Skills */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 last:border-0">
          <span className="text-caption-1 font-semibold text-slate-700 mb-4 block">언어 스킬</span>
          <LanguageSkillsInput control={control} errors={errors} />
        </div>
      </div>
    </div>
  );
};

/**
 * Performance Notes:
 * - Memoized to prevent unnecessary re-renders
 * - File upload state managed by parent (lifting state up)
 * - Sub-components (ProfileImageUpload, LanguageSkillsInput) also memoized
 *
 * Future Improvements:
 * - Add drag-and-drop for portfolio upload
 * - Add image cropping for profile picture
 * - Add preview modal for portfolio documents
 */
export default BasicInfoSection;
