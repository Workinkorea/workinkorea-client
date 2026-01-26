import React from 'react';
import { Building2, Users, Calendar, FileText, Hash, User, Phone, MapPin, Globe } from 'lucide-react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { getPhonePlaceholder } from '@/shared/lib/utils/phoneUtils';

interface CompanyInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  today: string;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
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
        <Building2 size={20} className="text-primary-500" />
        담당 기업 정보
      </h2>
      <p className="text-body-3 text-label-500 mb-6">
        기업의 기본 정보를 입력해주세요
      </p>

      <div className="space-y-4">
        {/* 사업자등록번호 */}
        <div>
          <label htmlFor="company_number" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Hash size={16} />
            사업자등록번호 <span className="text-caption-2 px-2 py-0.5 bg-gray-200 text-label-600 rounded ml-2">선택</span>
          </label>
          <input
            type="text"
            id="company_number"
            name="company_number"
            value={formData.company_number || ''}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            placeholder="000-00-00000"
            maxLength={12}
          />
          {formData.company_number && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

        {/* 대표자명 */}
        <div>
          <label htmlFor="representative_name" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <User size={16} />
            대표자명 <span className="text-caption-2 px-2 py-0.5 bg-gray-200 text-label-600 rounded ml-2">선택</span>
          </label>
          <input
            type="text"
            id="representative_name"
            name="representative_name"
            value={formData.representative_name || ''}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            placeholder="홍길동"
          />
          {formData.representative_name && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
        </div>

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

        {/* 일반전화 (회사 대표번호) */}
        <div>
          <label htmlFor="company_phone" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Phone size={16} />
            일반전화 (회사 대표번호) <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <input
            type="text"
            id="company_phone"
            name="company_phone"
            value={formData.company_phone || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.company_phone ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.company_phone && touchedFields.company_phone && formData.company_phone ? 'border-status-success' : ''}`}
            placeholder="02-1234-5678 (지역번호 포함)"
          />
          {errors.company_phone && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.company_phone}</p>
          )}
          {!errors.company_phone && touchedFields.company_phone && formData.company_phone && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.company_phone && (
            <p className="mt-1 text-caption-2 text-label-500">
              일반전화: 지역번호(예: 02, 031, 051) 포함
            </p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <MapPin size={16} />
            주소 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.address ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.address && touchedFields.address && formData.address ? 'border-status-success' : ''}`}
            placeholder="서울특별시 강남구 테헤란로 427"
          />
          {errors.address && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.address}</p>
          )}
          {!errors.address && touchedFields.address && formData.address && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.address && (
            <p className="mt-1 text-caption-2 text-label-500">회사의 주소를 입력해주세요.</p>
          )}
        </div>

        {/* 웹사이트 */}
        <div>
          <label htmlFor="website_url" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Globe size={16} />
            웹사이트 <span className="text-caption-2 px-2 py-0.5 bg-gray-200 text-label-600 rounded ml-2">선택</span>
          </label>
          <input
            type="url"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.website_url ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.website_url && formData.website_url ? 'border-status-success' : ''}`}
            placeholder="https://example.com"
          />
          {errors.website_url && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.website_url}</p>
          )}
          {!errors.website_url && formData.website_url && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!formData.website_url && (
            <p className="mt-1 text-caption-2 text-label-500">회사 홈페이지 주소를 입력해주세요. (http:// 또는 https:// 포함)</p>
          )}
        </div>
      </div>
    </div>
  );
};
