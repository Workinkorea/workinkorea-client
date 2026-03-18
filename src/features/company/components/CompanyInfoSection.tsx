import { ReactNode } from 'react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils/utils';

interface CompanyInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  today: string;
}

// 폼 행 레이아웃 헬퍼
const FieldRow = ({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 last:border-0 items-start">
    <span className="text-caption-1 font-semibold text-slate-700 sm:pt-2.5 flex items-center gap-1.5 flex-wrap">
      {label}
      {required && <span className="text-red-500">*</span>}
      {optional && (
        <span className="text-caption-3 font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
          선택
        </span>
      )}
    </span>
    <div>{children}</div>
  </div>
);

// 공통 select 스타일
const selectCls = (error: boolean, touched: boolean, hasValue: boolean) =>
  cn(
    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-800 bg-white transition-colors appearance-none cursor-pointer',
    'focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100',
    error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200',
    !error && touched && hasValue && 'border-emerald-500',
  );

// 에러 / 성공 힌트 메시지
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
  if (error) return <p className="mt-1.5 text-caption-3 text-red-500">{error}</p>;
  if (touched && hasValue)
    return (
      <p className="mt-1.5 text-caption-3 text-emerald-500 flex items-center gap-1">
        <span>✓</span> 입력 완료
      </p>
    );
  if (hint) return <p className="mt-1.5 text-caption-3 text-slate-400">{hint}</p>;
  return null;
};

export const CompanyInfoSection = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
  today,
}: CompanyInfoSectionProps) => {
  return (
    <div>
      {/* 업종 */}
      <FieldRow label="업종" required>
        <Input
          id="industry_type"
          name="industry_type"
          value={formData.industry_type}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="예: IT/소프트웨어, 제조, 유통 등"
          error={!!errors.industry_type}
          success={!errors.industry_type && touchedFields.industry_type && !!formData.industry_type}
        />
        <FieldHint
          error={errors.industry_type}
          touched={touchedFields.industry_type}
          hasValue={!!formData.industry_type}
        />
      </FieldRow>

      {/* 기업 형태 */}
      <FieldRow label="기업 형태" required>
        <select
          id="company_type"
          name="company_type"
          value={formData.company_type}
          onChange={onChange}
          onBlur={onBlur}
          className={selectCls(
            !!errors.company_type,
            touchedFields.company_type,
            !!formData.company_type,
          )}
        >
          <option value="">선택하세요</option>
          <option value="주식회사">주식회사</option>
          <option value="유한회사">유한회사</option>
          <option value="개인사업자">개인사업자</option>
          <option value="외국계기업">외국계기업</option>
        </select>
        <FieldHint
          error={errors.company_type}
          touched={touchedFields.company_type}
          hasValue={!!formData.company_type}
        />
      </FieldRow>

      {/* 직원 수 & 설립일 */}
      <FieldRow label="직원 수 / 설립일" required>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <select
              id="employee_count"
              name="employee_count"
              value={formData.employee_count || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={selectCls(
                !!errors.employee_count,
                touchedFields.employee_count,
                formData.employee_count > 0,
              )}
            >
              <option value="">직원 수</option>
              <option value="10">1~10명</option>
              <option value="50">11~50명</option>
              <option value="100">51~100명</option>
              <option value="200">101~200명</option>
              <option value="500">201~500명</option>
              <option value="1000">500명 이상</option>
            </select>
            <FieldHint
              error={errors.employee_count}
              touched={touchedFields.employee_count}
              hasValue={formData.employee_count > 0}
            />
          </div>
          <div>
            <Input
              type="date"
              id="establishment_date"
              name="establishment_date"
              value={formData.establishment_date}
              onChange={onChange}
              onBlur={onBlur}
              max={today}
              error={!!errors.establishment_date}
              success={
                !errors.establishment_date &&
                touchedFields.establishment_date &&
                !!formData.establishment_date
              }
            />
            <FieldHint
              error={errors.establishment_date}
              touched={touchedFields.establishment_date}
              hasValue={!!formData.establishment_date}
            />
          </div>
        </div>
      </FieldRow>

      {/* 보험 */}
      <FieldRow label="보험" optional>
        <Input
          id="insurance"
          name="insurance"
          value={formData.insurance}
          onChange={onChange}
          placeholder="예: 4대보험 완비, 산재보험 등"
          success={!!formData.insurance}
        />
        {!formData.insurance && (
          <p className="mt-1.5 text-caption-3 text-slate-400">제공하는 보험 정보를 입력해주세요.</p>
        )}
      </FieldRow>

      {/* 주소 */}
      <FieldRow label="주소" required>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="서울특별시 강남구 테헤란로 427"
          error={!!errors.address}
          success={!errors.address && touchedFields.address && !!formData.address}
        />
        <FieldHint
          error={errors.address}
          touched={touchedFields.address}
          hasValue={!!formData.address}
          hint="회사의 주소를 입력해주세요."
        />
      </FieldRow>

      {/* 웹사이트 */}
      <FieldRow label="웹사이트" optional>
        <Input
          type="url"
          id="website_url"
          name="website_url"
          value={formData.website_url}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="https://example.com"
          error={!!errors.website_url}
          success={!errors.website_url && !!formData.website_url}
        />
        <FieldHint
          error={errors.website_url}
          hasValue={!!formData.website_url}
          hint="회사 홈페이지 주소를 입력해주세요. (https:// 포함)"
        />
      </FieldRow>
    </div>
  );
};
