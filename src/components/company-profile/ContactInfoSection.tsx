import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CompanyProfileRequest } from '@/lib/api/types';
import { getPhonePlaceholder } from '@/lib/utils/phoneUtils';

interface ContactInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-normal">
      <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
        <Phone size={20} />
        연락 정보
      </h2>
      <div className="space-y-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Mail size={16} />
            이메일 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.email ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.email && touchedFields.email && formData.email ? 'border-status-success' : ''}`}
            placeholder="hr@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.email}</p>
          )}
          {!errors.email && touchedFields.email && formData.email && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.email && (
            <p className="mt-1 text-caption-2 text-label-500">채용 담당자 이메일을 입력해주세요.</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <label htmlFor="phone_number" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Phone size={16} />
            전화번호 <span className="text-status-error text-lg ml-1">*</span>
          </label>

          {/* Phone Type Selection */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="phone_type"
                value="MOBILE"
                checked={formData.phone_type === 'MOBILE'}
                onChange={onChange}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-body-3 text-label-700">휴대전화</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="phone_type"
                value="LANDLINE"
                checked={formData.phone_type === 'LANDLINE'}
                onChange={onChange}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-body-3 text-label-700">일반전화</span>
            </label>
          </div>

          {/* Phone Number Input */}
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.phone_number ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.phone_number && touchedFields.phone_number && formData.phone_number ? 'border-status-success' : ''}`}
            placeholder={getPhonePlaceholder(formData.phone_type)}
          />
          {errors.phone_number && (
            <p className="mt-1 text-caption-2 text-status-error">{errors.phone_number}</p>
          )}
          {!errors.phone_number && touchedFields.phone_number && formData.phone_number && (
            <p className="mt-1 text-caption-2 text-status-success flex items-center gap-1">
              <span className="text-status-success">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.phone_number && (
            <p className="mt-1 text-caption-2 text-label-500">
              {formData.phone_type === 'MOBILE'
                ? '휴대전화: 010, 011, 016-019로 시작하는 번호'
                : '일반전화: 지역번호(예: 02, 031, 051) 포함'}
            </p>
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
      </div>
    </div>
  );
};
