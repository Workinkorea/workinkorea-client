import { ReactNode } from 'react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { Input } from '@/shared/ui/Input';

interface ContactPersonSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FieldRow = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 last:border-0 items-start">
    <span className="text-caption-1 font-semibold text-slate-700 sm:pt-2.5 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    <div>{children}</div>
  </div>
);

const FieldHint = ({
  error,
  touched,
  hasValue,
  hint,
}: {
  error?: string;
  touched?: boolean;
  hasValue?: boolean;
  hint?: string;
}) => {
  if (error) return <p className="mt-1.5 text-[11px] text-red-500">{error}</p>;
  if (touched && hasValue)
    return (
      <p className="mt-1.5 text-[11px] text-emerald-500 flex items-center gap-1">
        <span>✓</span> 입력 완료
      </p>
    );
  if (hint) return <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>;
  return null;
};

export const ContactPersonSection = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
}: ContactPersonSectionProps) => {
  return (
    <div>
      {/* 이메일 */}
      <FieldRow label="이메일" required>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="hr@example.com"
          error={!!errors.email}
          success={!errors.email && touchedFields.email && !!formData.email}
        />
        <FieldHint
          error={errors.email}
          touched={touchedFields.email}
          hasValue={!!formData.email}
          hint="채용 담당자 이메일을 입력해주세요."
        />
      </FieldRow>

      {/* 휴대전화 */}
      <FieldRow label="휴대전화" required>
        <Input
          id="phone_number"
          name="phone_number"
          value={formData.phone_number || ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="010-1234-5678"
          error={!!errors.phone_number}
          success={
            !errors.phone_number && touchedFields.phone_number && !!formData.phone_number
          }
        />
        <FieldHint
          error={errors.phone_number}
          touched={touchedFields.phone_number}
          hasValue={!!formData.phone_number}
          hint="010, 011, 016~019로 시작하는 번호를 입력하세요."
        />
      </FieldRow>

    </div>
  );
};
