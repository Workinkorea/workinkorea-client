'use client';

import { UseFormReturn } from 'react-hook-form';
import { X, FileText, Briefcase, Globe } from 'lucide-react';
import { FormField } from '@/shared/ui/FormField';
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
    <div className="space-y-6">
      {/* Card 1: Profile Image */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-[17px] font-bold text-slate-900">프로필 사진</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">채용 담당자에게 보여질 사진을 등록하세요</p>
        </div>
        <ProfileImageUpload
          currentImageUrl={profile.profile_image_url}
          userName={profile.name}
          onImageSelect={onImageSelect}
          maxSizeMB={5}
        />
      </div>

      {/* Card 2: Basic Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-[17px] font-bold text-slate-900">기본 정보</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">개인 정보를 입력해주세요</p>
        </div>

        <div className="space-y-4">
          {/* Name - Full width required */}
          <FormField
            name="name"
            control={control}
            label="이름"
            rules={{ required: true }}
            error={errors.name?.message}
            render={(field, fieldId) => (
              <Input
                {...field}
                id={fieldId}
                placeholder="이름을 입력하세요"
                error={!!errors.name}
              />
            )}
          />

          {/* Location & Address - 2 columns on md+ */}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <FormField
              name="location"
              control={control}
              label="위치"
              error={errors.location?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  placeholder="예: 서울시 강남구"
                  error={!!errors.location}
                />
              )}
            />

            <FormField
              name="address"
              control={control}
              label="주소"
              error={errors.address?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  placeholder="예: 서울특별시 강남구"
                  error={!!errors.address}
                />
              )}
            />
          </div>

          {/* Job Status & Career - 2 columns on md+ */}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <FormField
              name="job_status"
              control={control}
              label="구직 상태"
              error={errors.job_status?.message}
              render={(field, fieldId) => (
                <select
                  {...field}
                  id={fieldId}
                  className={cn(
                    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800',
                    'transition-colors focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
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

            <FormField
              name="career"
              control={control}
              label="경력"
              error={errors.career?.message}
              render={(field, fieldId) => (
                <select
                  {...field}
                  id={fieldId}
                  className={cn(
                    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800',
                    'transition-colors focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
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
          </div>
        </div>
      </div>

      {/* Card 3: Professional Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-6 flex items-start gap-3">
          <Briefcase size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-[17px] font-bold text-slate-900">직무 정보</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">커리어 정보를 입력해주세요</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Position & Country - 2 columns on md+ */}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <FormField
              name="position_id"
              control={control}
              label="직무 선택"
              error={errors.position_id?.message}
              render={(field, fieldId) => (
                <select
                  {...field}
                  id={fieldId}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className={cn(
                    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800',
                    'transition-colors focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
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

            <FormField
              name="country_id"
              control={control}
              label="국적"
              error={errors.country_id?.message}
              render={(field, fieldId) => (
                <select
                  {...field}
                  id={fieldId}
                  value={field.value ?? 122}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 122)}
                  className={cn(
                    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800',
                    'transition-colors focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
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
          </div>

          {/* Portfolio Upload */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">포트폴리오</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                {selectedPortfolioFileName || profile.portfolio_url ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-slate-700 font-medium truncate">
                      {selectedPortfolioFileName || profile.portfolio_url}
                    </span>
                    <button
                      type="button"
                      onClick={onRemovePortfolio}
                      className="text-red-500 hover:text-red-600 cursor-pointer flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-600">파일을 선택하거나 드래그하세요</p>
                )}
                <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, 이미지 (최대 10MB)</p>
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
          </div>
        </div>
      </div>

      {/* Card 4: Introduction & Language Skills */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-6 flex items-start gap-3">
          <Globe size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-[17px] font-bold text-slate-900">자기소개 & 언어 스킬</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">전문성을 표현해주세요</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Introduction (Textarea with character count) */}
          <FormField
            name="introduction"
            control={control}
            label="자기소개"
            error={errors.introduction?.message}
            render={(field, fieldId) => (
              <div>
                <textarea
                  {...field}
                  id={fieldId}
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
                <div className="text-right text-[11px] text-slate-400 mt-1">
                  {field.value?.length || 0}/500
                </div>
              </div>
            )}
          />

          {/* Language Skills (Complex nested field array) */}
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
