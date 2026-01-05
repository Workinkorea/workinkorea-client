'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import ProfileImageUpload from '../shared/ProfileImageUpload';
import FileUploadButton from '../shared/FileUploadButton';
import LanguageSkillsInput from '../shared/LanguageSkillsInput';
import { cn } from '@/lib/utils/utils';
import type { BasicProfileForm } from '@/lib/validations/profile';
import { COUNTRIES_FULL } from '@/constants/countries';
import { getPositionsByHierarchy } from '@/constants/positions';

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

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  profile,
  onImageSelect,
  onPortfolioSelect,
  selectedPortfolioFileName,
  onRemovePortfolio,
}) => {
  const {
    control,
    formState: { errors },
  } = form;

  // Get hierarchical position data
  const positionHierarchy = getPositionsByHierarchy();

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <ProfileImageUpload
        currentImageUrl={profile.profile_image_url}
        userName={profile.name}
        onImageSelect={onImageSelect}
        maxSizeMB={5}
      />

      {/* Name */}
      <FormField
        name="name"
        control={control}
        label="이름"
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

      {/* Location */}
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

      {/* Address */}
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

      {/* Introduction (Textarea with character count) */}
      <FormField
        name="introduction"
        control={control}
        label="소개"
        error={errors.introduction?.message}
        render={(field, fieldId) => (
          <div className="relative">
            <textarea
              {...field}
              id={fieldId}
              placeholder="자신에 대해 간단히 소개해주세요"
              rows={4}
              maxLength={500}
              className={cn(
                'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
                'transition-colors focus:ring-2 focus:border-transparent resize-none',
                'border-line-400 focus:ring-primary',
                errors.introduction && 'border-status-error focus:ring-status-error'
              )}
            />
            <div className="absolute bottom-2 right-2 text-caption-2 text-label-400">
              {field.value?.length || 0}/500
            </div>
          </div>
        )}
      />

      {/* Job Status */}
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
              'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
              'transition-colors focus:ring-2 focus:border-transparent',
              'border-line-400 focus:ring-primary',
              errors.job_status && 'border-status-error focus:ring-status-error'
            )}
          >
            <option value="">상태를 선택하세요</option>
            <option value="available">구직중</option>
            <option value="busy">바쁨</option>
            <option value="not-looking">구직안함</option>
          </select>
        )}
      />

      {/* Career */}
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
              'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
              'transition-colors focus:ring-2 focus:border-transparent',
              'border-line-400 focus:ring-primary',
              errors.career && 'border-status-error focus:ring-status-error'
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

      {/* Portfolio File Upload */}
      <div className="space-y-2">
        <label className="text-caption-2 font-medium text-label-900">
          포트폴리오
        </label>
        <div className="flex items-center gap-3">
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
            buttonLabel="파일 선택"
            hint="PDF, DOCX, 이미지 파일 업로드 가능 (최대 10MB)"
          />

          {/* Selected file display */}
          {(selectedPortfolioFileName || profile.portfolio_url) && (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-caption-2 text-label-600 truncate">
                {selectedPortfolioFileName || profile.portfolio_url}
              </span>
              <button
                type="button"
                onClick={onRemovePortfolio}
                className="text-status-error hover:text-status-error/80 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Position Selection (Hierarchical dropdown) */}
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
              'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
              'transition-colors focus:ring-2 focus:border-transparent',
              'border-line-400 focus:ring-primary',
              errors.position_id && 'border-status-error focus:ring-status-error'
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

      {/* Country Selection */}
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
              'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
              'transition-colors focus:ring-2 focus:border-transparent',
              'border-line-400 focus:ring-primary',
              errors.country_id && 'border-status-error focus:ring-status-error'
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

      {/* Language Skills (Complex nested field array) */}
      <LanguageSkillsInput control={control} errors={errors} />
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
export default React.memo(BasicInfoSection);
