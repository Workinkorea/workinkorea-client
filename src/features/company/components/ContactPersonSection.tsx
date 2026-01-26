import React from 'react';
import { UserCircle, Mail, Globe, Briefcase, Phone } from 'lucide-react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { COUNTRIES_FULL } from '@/shared/constants/countries';
import { POSITIONS_L3 } from '@/shared/constants/positions';

interface ContactPersonSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ContactPersonSection: React.FC<ContactPersonSectionProps> = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-normal">
      <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
        <UserCircle size={20} className="text-primary-500" />
        담당자 정보
      </h2>
      <p className="text-body-3 text-label-500 mb-6">
        채용 담당자의 연락처 및 기본 정보를 입력해주세요
      </p>

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

        {/* 휴대전화 (담당자 연락처) */}
        <div>
          <label htmlFor="phone_number" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Phone size={16} />
            휴대전화 <span className="text-status-error text-lg ml-1">*</span>
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-2 border ${errors.phone_number ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${!errors.phone_number && touchedFields.phone_number && formData.phone_number ? 'border-status-success' : ''}`}
            placeholder="010-1234-5678"
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
              담당자 휴대전화: 010, 011, 016-019로 시작하는 번호
            </p>
          )}
        </div>

        {/* 국가 */}
        <div>
          <label htmlFor="country_id" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Globe size={16} />
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
          {!touchedFields.country_id && (
            <p className="mt-1 text-caption-2 text-label-500">담당자의 국가를 선택해주세요.</p>
          )}
        </div>

        {/* 직무 */}
        <div>
          <label htmlFor="position_id" className="text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
            <Briefcase size={16} />
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
          {!touchedFields.position_id && (
            <p className="mt-1 text-caption-2 text-label-500">담당자의 직무를 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};
