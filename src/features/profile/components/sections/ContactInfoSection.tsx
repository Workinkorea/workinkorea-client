'use client';

import { UseFormReturn, Controller } from 'react-hook-form';
import { Phone, Github, Linkedin, Globe } from 'lucide-react';
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

function ContactInfoSection({ form }: ContactInfoSectionProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Phone size={16} className="text-blue-600" />
        </span>
        <div>
          <h2 className="text-body-2 font-bold text-slate-900">연락처 정보</h2>
          <p className="text-caption-3 text-slate-400 mt-0.5">채용 담당자가 연락할 수 있는 정보를 입력하세요</p>
        </div>
      </div>

      {/* Phone Number */}
      <FieldRow label="전화번호" optional>
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                {...field}
                type="tel"
                placeholder="010-1234-5678"
                error={!!errors.phone_number}
                className="pl-10"
              />
            </div>
          )}
        />
        {errors.phone_number && <p className="text-caption-2 text-red-500 mt-1">{errors.phone_number.message}</p>}
      </FieldRow>

      {/* GitHub URL */}
      <FieldRow label="GitHub URL" optional>
        <Controller
          name="github_url"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                {...field}
                placeholder="https://github.com/username"
                error={!!errors.github_url}
                className="pl-10"
              />
            </div>
          )}
        />
        {errors.github_url && <p className="text-caption-2 text-red-500 mt-1">{errors.github_url.message}</p>}
      </FieldRow>

      {/* LinkedIn URL */}
      <FieldRow label="LinkedIn URL" optional>
        <Controller
          name="linkedin_url"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                {...field}
                placeholder="https://linkedin.com/in/username"
                error={!!errors.linkedin_url}
                className="pl-10"
              />
            </div>
          )}
        />
        {errors.linkedin_url && <p className="text-caption-2 text-red-500 mt-1">{errors.linkedin_url.message}</p>}
      </FieldRow>

      {/* Website URL */}
      <FieldRow label="웹사이트 URL" optional>
        <Controller
          name="website_url"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                {...field}
                placeholder="https://yourportfolio.com"
                error={!!errors.website_url}
                className="pl-10"
              />
            </div>
          )}
        />
        {errors.website_url && <p className="text-caption-2 text-red-500 mt-1">{errors.website_url.message}</p>}
      </FieldRow>
    </div>
  );
};

/**
 * Performance Optimization:
 * Export memoized version to prevent unnecessary re-renders
 * when parent state changes but props remain the same
 */
export default ContactInfoSection;
