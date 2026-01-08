import React from 'react';
import { Building, Users, Calendar, FileText } from 'lucide-react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import { POSITIONS_L3 } from '@/shared/constants/positions';

interface BasicInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  today: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
  today,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-normal">
      <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
        <Building size={20} />
        기본 정보
      </h2>
      <div className="space-y-4">
        {/* 업종 */}
        <div>
          <label htmlFor="industry_type" className="text-body-3 font-medium text-label-700 mb-2 flex items-center">
            업종 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <input
            type="text"
            id="industry_type"
            name="industry_type"
            value={formData.industry_type}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.industry_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.industry_type && touchedFields.industry_type && formData.industry_type ? 'border-status-success' : ''}`}
            placeholder="예: IT/소프트웨어, 제조, 유통 등"
          />
          {errors.industry_type && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.industry_type}</p>
          )}
          {!errors.industry_type && touchedFields.industry_type && formData.industry_type && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 기업 형태 */}
        <div>
          <label htmlFor="company_type" className="text-body-3 font-medium text-label-700 mb-2 flex items-center">
            기업 형태 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <select
            id="company_type"
            name="company_type"
            value={formData.company_type}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.company_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer ${!errors.company_type && touchedFields.company_type && formData.company_type ? 'border-status-success' : ''}`}
          >
            <option value="">선택하세요</option>
            <option value="주식회사">주식회사</option>
            <option value="유한회사">유한회사</option>
            <option value="개인사업자">개인사업자</option>
            <option value="외국계기업">외국계기업</option>
          </select>
          {errors.company_type && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.company_type}</p>
          )}
          {!errors.company_type && touchedFields.company_type && formData.company_type && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 국가 */}
        <div>
          <label htmlFor="country_id" className="text-body-3 font-medium text-label-700 mb-2 flex items-center">
            국가 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <select
            id="country_id"
            name="country_id"
            value={formData.country_id || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.country_id ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer ${!errors.country_id && touchedFields.country_id && formData.country_id > 0 ? 'border-status-success' : ''}`}
          >
            <option value="">선택하세요</option>
            {COUNTRIES_FULL.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country_id && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.country_id}</p>
          )}
          {!errors.country_id && touchedFields.country_id && formData.country_id > 0 && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 직무 */}
        <div>
          <label htmlFor="position_id" className="text-body-3 font-medium text-label-700 mb-2 flex items-center">
            직무 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <select
            id="position_id"
            name="position_id"
            value={formData.position_id || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.position_id ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer ${!errors.position_id && touchedFields.position_id && formData.position_id > 0 ? 'border-status-success' : ''}`}
          >
            <option value="">선택하세요</option>
            {POSITIONS_L3.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
          {errors.position_id && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.position_id}</p>
          )}
          {!errors.position_id && touchedFields.position_id && formData.position_id > 0 && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 직원 수 & 설립일 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="employee_count" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
              <Users size={16} />
              직원 수 <span className="text-status-error text-lg ml-1">*</span>
            </label>
            <select
              id="employee_count"
              name="employee_count"
              value={formData.employee_count || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full px-4 py-2 border ${errors.employee_count ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer ${!errors.employee_count && touchedFields.employee_count && formData.employee_count > 0 ? 'border-status-success' : ''}`}
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
              <p className="mt-1 text-caption-2 text-status-error">{errors.employee_count}</p>
            )}
            {!errors.employee_count && touchedFields.employee_count && formData.employee_count > 0 && (
              <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
                <span className="text-status-success">✓</span> 입력 완료
              </p>
            )}
          </div>

          <div>
            <label htmlFor="establishment_date" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              설립일 <span className="text-status-error text-lg ml-1">*</span>
            </label>
            <input
              type="date"
              id="establishment_date"
              name="establishment_date"
              value={formData.establishment_date}
              onChange={onChange}
              onBlur={onBlur}
              max={today}
              className={`w-full px-4 py-2 border ${errors.establishment_date ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.establishment_date && touchedFields.establishment_date && formData.establishment_date ? 'border-status-success' : ''}`}
            />
            {errors.establishment_date && (
              <p className="mt-1 text-caption-2 text-status-error">{errors.establishment_date}</p>
            )}
            {!errors.establishment_date && touchedFields.establishment_date && formData.establishment_date && (
              <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
                <span className="text-status-success">✓</span> 입력 완료
              </p>
            )}
          </div>
        </div>

        {/* 보험 */}
        <div>
          <label htmlFor="insurance" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            보험 <span className="text-caption-2 px-2 py-0.5 bg-gray-200 text-label-600 rounded ml-2">선택</span>
          </label>
          <input
            type="text"
            id="insurance"
            name="insurance"
            value={formData.insurance}
            onChange={onChange}
            className={`w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${formData.insurance ? 'border-status-success' : ''}`}
            placeholder="예: 4대보험 완비, 산재보험 등"
          />
          {formData.insurance && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!formData.insurance && (
            <p className="mt-1 text-caption-2 text-label-500">제공하는 보험 정보를 입력해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};
