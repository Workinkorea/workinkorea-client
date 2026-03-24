import { Building, Users, Calendar, FileText } from 'lucide-react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { Input } from '@/shared/ui/Input';

interface BasicInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  today: string;
}

export const BasicInfoSection = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
  today,
}: BasicInfoSectionProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-title-4 font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Building size={20} />
        기본 정보
      </h2>
      <div className="space-y-4">
        {/* 업종 */}
        <div>
          <label htmlFor="industry_type" className="text-caption-1 font-semibold text-slate-700 mb-2 flex items-center">
            업종 <span className="text-red-500 text-lg ml-1">*</span>
          </label>
          <Input
            type="text"
            id="industry_type"
            name="industry_type"
            value={formData.industry_type}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="예: IT/소프트웨어, 제조, 유통 등"
            error={!!errors.industry_type}
            success={!errors.industry_type && touchedFields.industry_type && !!formData.industry_type}
          />
          {errors.industry_type && (
            <p className="mt-1 text-caption-3 text-red-500">{errors.industry_type}</p>
          )}
          {!errors.industry_type && touchedFields.industry_type && formData.industry_type && (
            <p className="mt-1 text-caption-3 text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 기업 형태 */}
        <div>
          <label htmlFor="company_type" className="text-caption-1 font-semibold text-slate-700 mb-2 flex items-center">
            기업 형태 <span className="text-red-500 text-lg ml-1">*</span>
          </label>
          <select
            id="company_type"
            name="company_type"
            value={formData.company_type}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-3.5 py-2.5 border ${errors.company_type ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-[3px] focus:ring-blue-100 transition-colors cursor-pointer ${!errors.company_type && touchedFields.company_type && formData.company_type ? 'border-emerald-500' : ''}`}
          >
            <option value="">선택하세요</option>
            <option value="주식회사">주식회사</option>
            <option value="유한회사">유한회사</option>
            <option value="개인사업자">개인사업자</option>
            <option value="외국계기업">외국계 기업</option>
          </select>
          {errors.company_type && (
            <p className="mt-1 text-caption-3 text-red-500">{errors.company_type}</p>
          )}
          {!errors.company_type && touchedFields.company_type && formData.company_type && (
            <p className="mt-1 text-caption-3 text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 직원 수 & 설립일 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="employee_count" className="text-caption-1 font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Users size={16} />
              직원 수 <span className="text-red-500 text-lg ml-1">*</span>
            </label>
            <select
              id="employee_count"
              name="employee_count"
              value={formData.employee_count || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full px-3.5 py-2.5 border ${errors.employee_count ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-[3px] focus:ring-blue-100 transition-colors cursor-pointer ${!errors.employee_count && touchedFields.employee_count && formData.employee_count > 0 ? 'border-emerald-500' : ''}`}
            >
              <option value="">선택하세요</option>
              <option value="10">1-10명</option>
              <option value="50">11-50명</option>
              <option value="100">51-100명</option>
              <option value="200">101-200명</option>
              <option value="500">201-500명</option>
              <option value="1000">500명 이상</option>
            </select>
            {errors.employee_count && (
              <p className="mt-1 text-caption-3 text-red-500">{errors.employee_count}</p>
            )}
            {!errors.employee_count && touchedFields.employee_count && formData.employee_count > 0 && (
              <p className="mt-1 text-caption-3 text-emerald-500 flex items-center gap-1">
                <span className="text-emerald-500">✓</span> 입력 완료
              </p>
            )}
          </div>

          <div>
            <label htmlFor="establishment_date" className="text-caption-1 font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              설립일 <span className="text-red-500 text-lg ml-1">*</span>
            </label>
            <Input
              type="date"
              id="establishment_date"
              name="establishment_date"
              value={formData.establishment_date}
              onChange={onChange}
              onBlur={onBlur}
              max={today}
              error={!!errors.establishment_date}
              success={!errors.establishment_date && touchedFields.establishment_date && !!formData.establishment_date}
            />
            {errors.establishment_date && (
              <p className="mt-1 text-caption-3 text-red-500">{errors.establishment_date}</p>
            )}
            {!errors.establishment_date && touchedFields.establishment_date && formData.establishment_date && (
              <p className="mt-1 text-caption-3 text-emerald-500 flex items-center gap-1">
                <span className="text-emerald-500">✓</span> 입력 완료
              </p>
            )}
          </div>
        </div>

        {/* 보험 */}
        <div>
          <label htmlFor="insurance" className="text-caption-1 font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            보험 <span className="text-caption-3 px-2 py-0.5 bg-slate-200 text-slate-600 rounded ml-2">선택</span>
          </label>
          <Input
            type="text"
            id="insurance"
            name="insurance"
            value={formData.insurance}
            onChange={onChange}
            placeholder="예: 4대보험 완비, 산재보험 등"
            success={!!formData.insurance}
          />
          {formData.insurance && (
            <p className="mt-1 text-caption-3 text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
          {!formData.insurance && (
            <p className="mt-1 text-caption-3 text-slate-500">제공하는 보험 정보를 입력해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};
