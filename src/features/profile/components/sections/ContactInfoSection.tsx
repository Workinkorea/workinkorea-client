'use client';

import { UseFormReturn } from 'react-hook-form';
import { Phone, Github, Linkedin, Globe } from 'lucide-react';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils/utils';
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

function ContactInfoSection({ form }: ContactInfoSectionProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6 flex items-start gap-3">
        <Phone size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">연락처 정보</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">채용 담당자가 연락할 수 있는 정보를 입력하세요</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Phone Number & GitHub - 2 columns on md+ */}
        <div className="md:grid md:grid-cols-2 md:gap-4">
          {/* Phone Number */}
          <FormField
            name="phone_number"
            control={control}
            label="전화번호"
            error={errors.phone_number?.message}
            render={(field, fieldId) => (
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <Input
                  {...field}
                  id={fieldId}
                  type="tel"
                  placeholder="010-1234-5678"
                  error={!!errors.phone_number}
                  className="pl-10"
                />
              </div>
            )}
          />

          {/* GitHub URL */}
          <FormField
            name="github_url"
            control={control}
            label="GitHub URL"
            error={errors.github_url?.message}
            render={(field, fieldId) => (
              <div className="relative">
                <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <Input
                  {...field}
                  id={fieldId}
                  placeholder="https://github.com/username"
                  error={!!errors.github_url}
                  className="pl-10"
                />
              </div>
            )}
          />
        </div>

        {/* LinkedIn URL & Website - 2 columns on md+ */}
        <div className="md:grid md:grid-cols-2 md:gap-4">
          {/* LinkedIn URL */}
          <FormField
            name="linkedin_url"
            control={control}
            label="LinkedIn URL"
            error={errors.linkedin_url?.message}
            render={(field, fieldId) => (
              <div className="relative">
                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <Input
                  {...field}
                  id={fieldId}
                  placeholder="https://linkedin.com/in/username"
                  error={!!errors.linkedin_url}
                  className="pl-10"
                />
              </div>
            )}
          />

          {/* Website URL */}
          <FormField
            name="website_url"
            control={control}
            label="웹사이트 URL"
            error={errors.website_url?.message}
            render={(field, fieldId) => (
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <Input
                  {...field}
                  id={fieldId}
                  placeholder="https://yourportfolio.com"
                  error={!!errors.website_url}
                  className="pl-10"
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Performance Optimization:
 * Export memoized version to prevent unnecessary re-renders
 * when parent state changes but props remain the same
 */
export default ContactInfoSection;
