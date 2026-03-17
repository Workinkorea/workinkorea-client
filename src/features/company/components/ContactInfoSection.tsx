import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CompanyProfileRequest } from '@/shared/types/api';
import { Input } from '@/shared/ui/Input';

interface ContactInfoSectionProps {
  formData: CompanyProfileRequest;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ContactInfoSection = ({
  formData,
  errors,
  touchedFields,
  onChange,
  onBlur,
}: ContactInfoSectionProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Phone size={20} />
        연락 정보
      </h2>
      <div className="space-y-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Mail size={16} />
            이메일 <span className="text-red-500 text-lg ml-1">*</span>
          </label>
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
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
          )}
          {!errors.email && touchedFields.email && formData.email && (
            <p className="mt-1 text-[11px] text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.email && (
            <p className="mt-1 text-[11px] text-slate-500">채용 담당자 이메일을 입력해주세요.</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <label htmlFor="phone_number" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Phone size={16} />
            전화번호 <span className="text-red-500 text-lg ml-1">*</span>
          </label>

          <Input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="010-1234-5678"
            error={!!errors.phone_number}
            success={!errors.phone_number && touchedFields.phone_number && !!formData.phone_number}
          />
          {errors.phone_number && (
            <p className="mt-1 text-[11px] text-red-500">{errors.phone_number}</p>
          )}
          {!errors.phone_number && touchedFields.phone_number && formData.phone_number && (
            <p className="mt-1 text-[11px] text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.phone_number && (
            <p className="mt-1 text-[11px] text-slate-500">010, 011, 016~019로 시작하는 번호를 입력하세요.</p>
          )}
        </div>

        {/* 웹사이트 */}
        <div>
          <label htmlFor="website_url" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Globe size={16} />
            웹사이트 <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded ml-2">선택</span>
          </label>
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
          {errors.website_url && (
            <p className="mt-1 text-[11px] text-red-500">{errors.website_url}</p>
          )}
          {!errors.website_url && formData.website_url && (
            <p className="mt-1 text-[11px] text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
          {!formData.website_url && (
            <p className="mt-1 text-[11px] text-slate-500">회사 홈페이지 주소를 입력해주세요. (http:// 또는 https:// 포함)</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={16} />
            주소 <span className="text-red-500 text-lg ml-1">*</span>
          </label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="서울특별시 강남구 테헤란로 427"
            error={!!errors.address}
            success={!errors.address && touchedFields.address && !!formData.address}
          />
          {errors.address && (
            <p className="mt-1 text-[11px] text-red-500">{errors.address}</p>
          )}
          {!errors.address && touchedFields.address && formData.address && (
            <p className="mt-1 text-[11px] text-emerald-500 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> 입력 완료
            </p>
          )}
          {!touchedFields.address && (
            <p className="mt-1 text-[11px] text-slate-500">회사의 주소를 입력해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};
