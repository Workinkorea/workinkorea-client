'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import type { ContactInfoForm } from '../../validations/profile';

/**
 * ContactInfoSection Component
 *
 * Presentational component for editing contact information.
 * Receives form instance from parent container.
 *
 * @example
 * <ContactInfoSection form={contactForm} />
 *
 * Architecture Decision:
 * - Presentational (dumb) component: No data fetching, only UI
 * - Receives form instance via props (Dependency Injection pattern)
 * - Parent (Container) handles mutations and API calls
 *
 * Why this pattern?
 * - Testability: Easy to test with mock form object
 * - Reusability: Can be used in different contexts (modal, page, etc.)
 * - Separation of Concerns: UI logic separate from business logic
 * - Performance: Parent can memoize this component
 */

export interface ContactInfoSectionProps {
  /** react-hook-form instance for contact info */
  form: UseFormReturn<ContactInfoForm>;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Phone Number */}
      <FormField
        name="phone_number"
        control={control}
        label="전화번호"
        error={errors.phone_number?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            type="tel"
            placeholder="전화번호를 입력하세요"
            error={!!errors.phone_number}
          />
        )}
      />

      {/* GitHub URL */}
      <FormField
        name="github_url"
        control={control}
        label="GitHub URL"
        error={errors.github_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://github.com/username"
            error={!!errors.github_url}
          />
        )}
      />

      {/* LinkedIn URL */}
      <FormField
        name="linkedin_url"
        control={control}
        label="LinkedIn URL"
        error={errors.linkedin_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://linkedin.com/in/username"
            error={!!errors.linkedin_url}
          />
        )}
      />

      {/* Website URL */}
      <FormField
        name="website_url"
        control={control}
        label="웹사이트 URL"
        error={errors.website_url?.message}
        render={(field, fieldId) => (
          <Input
            {...field}
            id={fieldId}
            placeholder="https://yourportfolio.com"
            error={!!errors.website_url}
          />
        )}
      />
    </div>
  );
};

/**
 * Performance Optimization:
 * Export memoized version to prevent unnecessary re-renders
 * when parent state changes but props remain the same
 */
export default React.memo(ContactInfoSection);
