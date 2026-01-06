'use client';

import React from 'react';
import { Control, useFieldArray, FieldErrors } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { FormField } from '@/shared/ui/FormField';
import { cn } from '@/shared/lib/utils/utils';
import type { BasicProfileForm } from '../../validations/profile';

/**
 * LanguageSkillsInput Component
 *
 * Manages language skills as a dynamic field array.
 * Integrates with react-hook-form's useFieldArray for array manipulation.
 *
 * @example
 * <LanguageSkillsInput
 *   control={basicForm.control}
 *   errors={basicForm.formState.errors}
 * />
 *
 * Architecture Decision:
 * - Uses react-hook-form's Controller pattern for complex nested fields
 * - Array operations (add/remove) handled internally
 * - Parent only provides control object (loose coupling)
 *
 * Why this pattern?
 * - Encapsulates field array complexity
 * - Reusable across different forms
 * - Easier to add features (e.g., drag-to-reorder, max limit)
 */

const LANGUAGE_OPTIONS = [
  { value: 'korean', label: '한국어' },
  { value: 'english', label: '영어' },
  { value: 'japanese', label: '일본어' },
  { value: 'chinese', label: '중국어' },
  { value: 'spanish', label: '스페인어' },
  { value: 'french', label: '프랑스어' },
  { value: 'german', label: '독일어' },
  { value: 'vietnamese', label: '베트남어' },
  { value: 'thai', label: '태국어' },
  { value: 'other', label: '기타' },
] as const;

const LANGUAGE_LEVEL_OPTIONS = [
  { value: 'native', label: '원어민' },
  { value: 'advanced', label: '고급' },
  { value: 'intermediate', label: '중급' },
  { value: 'beginner', label: '초급' },
] as const;

export interface LanguageSkillsInputProps {
  /** react-hook-form control object */
  control: Control<BasicProfileForm>;

  /** Form errors object */
  errors?: FieldErrors<BasicProfileForm>;
}

const LanguageSkillsInput: React.FC<LanguageSkillsInputProps> = ({
  control,
  errors,
}) => {
  /**
   * useFieldArray hook manages dynamic array operations
   * - fields: Array of field objects with unique `id`
   * - append: Add new item to array
   * - remove: Remove item by index
   */
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'language_skills',
  });

  /**
   * Add new language skill with empty values
   */
  const handleAddLanguage = () => {
    append({ language_type: '', level: '' });
  };

  /**
   * Remove language skill by index
   */
  const handleRemoveLanguage = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-3">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <label className="text-caption-2 font-medium text-label-900">
          언어 스킬
        </label>
        <button
          type="button"
          onClick={handleAddLanguage}
          className="
            flex items-center gap-1
            text-primary-500 hover:text-primary-600
            text-caption-2 cursor-pointer
            transition-colors
          "
        >
          <Plus size={16} />
          <span>추가</span>
        </button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <p className="text-caption-2 text-label-400">
          언어 스킬을 추가해주세요
        </p>
      )}

      {/* Language skill items */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-line-200 rounded-lg p-4 space-y-3"
          >
            {/* Item header with remove button */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption-2 font-medium text-label-700">
                언어 {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                className="
                  text-status-error hover:text-status-error/80
                  cursor-pointer transition-colors
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* Language type select */}
            <FormField
              name={`language_skills.${index}.language_type`}
              control={control}
              label="언어"
              error={errors?.language_skills?.[index]?.language_type?.message}
              render={(fieldProps, fieldId) => (
                <select
                  {...fieldProps}
                  id={fieldId}
                  className={cn(
                    'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
                    'transition-colors focus:ring-2 focus:border-transparent',
                    'border-line-400 focus:ring-primary',
                    errors?.language_skills?.[index]?.language_type &&
                      'border-status-error focus:ring-status-error'
                  )}
                >
                  <option value="">언어를 선택하세요</option>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />

            {/* Language level select */}
            <FormField
              name={`language_skills.${index}.level`}
              control={control}
              label="수준"
              error={errors?.language_skills?.[index]?.level?.message}
              render={(fieldProps, fieldId) => (
                <select
                  {...fieldProps}
                  id={fieldId}
                  className={cn(
                    'w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm',
                    'transition-colors focus:ring-2 focus:border-transparent',
                    'border-line-400 focus:ring-primary',
                    errors?.language_skills?.[index]?.level &&
                      'border-status-error focus:ring-status-error'
                  )}
                >
                  <option value="">수준을 선택하세요</option>
                  {LANGUAGE_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSkillsInput;
