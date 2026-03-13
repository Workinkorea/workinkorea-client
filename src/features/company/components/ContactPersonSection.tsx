import { ReactNode } from 'react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils/utils';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import { POSITIONS_L3 } from '@/shared/constants/positions';

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
    <span className="text-[13px] font-semibold text-slate-700 sm:pt-2.5 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    <div>{children}</div>
  </div>
);

const selectCls = (error: boolean, touched: boolean, hasValue: boolean) =>
  cn(
    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
    'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
    error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200',
    !error && touched && hasValue && 'border-emerald-500',
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

      {/* 국가 */}
      <FieldRow label="국가" required>
        <select
          id="country_id"
          name="country_id"
          value={formData.country_id || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={selectCls(
            !!errors.country_id,
            touchedFields.country_id,
            formData.country_id > 0,
          )}
        >
          <option value="">선택하세요</option>
          {COUNTRIES_FULL.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <FieldHint
          error={errors.country_id}
          touched={touchedFields.country_id}
          hasValue={formData.country_id > 0}
          hint="담당자의 국가를 선택해주세요."
        />
      </FieldRow>

      {/* 직무 */}
      <FieldRow label="직무" required>
        <select
          id="position_id"
          name="position_id"
          value={formData.position_id || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={selectCls(
            !!errors.position_id,
            touchedFields.position_id,
            formData.position_id > 0,
          )}
        >
          <option value="">선택하세요</option>
          {POSITIONS_L3.map((position) => (
            <option key={position.id} value={position.id}>
              {position.name}
            </option>
          ))}
        </select>
        <FieldHint
          error={errors.position_id}
          touched={touchedFields.position_id}
          hasValue={formData.position_id > 0}
          hint="담당자의 직무를 선택해주세요."
        />
      </FieldRow>
    </div>
  );
};
