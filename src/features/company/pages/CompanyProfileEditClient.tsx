'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileApi } from '../api/profileCompany';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyProfileRequest } from '@/shared/types/api';
import toast from 'react-hot-toast';
import { detectPhoneType, formatPhoneByType, PhoneType } from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';
import { validateCompanyProfileField, validateCompanyProfileForm } from '../validations/companyProfileValidation';
import { CompanyInfoSection } from '@/features/company/components/CompanyInfoSection';
import { ContactPersonSection } from '@/features/company/components/ContactPersonSection';

const CompanyProfileEditClient = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<CompanyProfileRequest>({
    industry_type: '',
    employee_count: 0,
    establishment_date: '',
    company_type: '',
    insurance: '',
    company_phone: '',  // 기업 일반전화
    phone_number: '',  // 담당자 휴대전화
    phone_type: 'MOBILE',  // Default phone type
    address: '',
    website_url: '',
    email: '',
    country_id: 0,
    position_id: 0,
    company_number: '',
    representative_name: '',
  });

  const [originalData, setOriginalData] = useState<CompanyProfileRequest | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // 기존 프로필 조회
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany()
  });

  // 프로필 데이터가 로드되면 폼에 설정
  useEffect(() => {
    if (profile) {
      // Detect phone type from existing phone number
      const phoneNum = String(profile.phone_number || '');
      const detectedType = detectPhoneType(phoneNum) || 'MOBILE';

      const data = {
        industry_type: profile.industry_type || '',
        employee_count: profile.employee_count || 0,
        establishment_date: profile.establishment_date || '',
        company_type: profile.company_type || '',
        insurance: profile.insurance || '',
        company_phone: profile.company_phone || '',  // 기업 일반전화
        phone_number: phoneNum,  // 담당자 휴대전화
        phone_type: (profile.phone_type as PhoneType) || detectedType,  // Use saved type or detect
        address: profile.address || '',
        website_url: profile.website_url || '',
        email: profile.email || '',
        country_id: profile.country_id || 0,
        position_id: profile.position_id || 0,
        company_number: profile.company_number || '',
        representative_name: profile.representative_name || '',
      };

      setFormData(data);
      setOriginalData(data);
    }
  }, [profile]);

  // 변경사항 확인
  const hasChanges = useMemo(() => {
    if (!originalData) {
      // originalData가 없으면 기본값과 비교
      const defaultData = {
        industry_type: '',
        employee_count: 0,
        establishment_date: '',
        company_type: '',
        insurance: '',
        company_phone: '',
        phone_number: '',
        phone_type: 'MOBILE' as PhoneType,
        address: '',
        website_url: '',
        email: '',
        country_id: 0,
        position_id: 0,
        company_number: '',
        representative_name: '',
      };
      return JSON.stringify(formData) !== JSON.stringify(defaultData);
    }
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => {
      if (profile) {
        return profileApi.updateProfileCompany(data);
      } else {
        return profileApi.createProfileCompany(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      const message = profile ? '프로필이 성공적으로 수정되었습니다.' : '프로필이 성공적으로 생성되었습니다.';
      toast.success(message);
      setTimeout(() => {
        router.push('/company');
      }, 1000);
    },
    onError: (error: unknown) => {
      logError(error, 'CompanyProfileEditClient.updateProfile');
      const errorMessage = extractErrorMessage(error, '프로필 수정에 실패했습니다. 다시 시도해주세요.');
      toast.error(errorMessage);
    },
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | PhoneType = value;

    // 기업 일반전화는 LANDLINE 포맷팅
    if (name === 'company_phone') {
      processedValue = formatPhoneByType(value, 'LANDLINE');
    }
    // 담당자 휴대전화는 MOBILE 포맷팅
    else if (name === 'phone_number') {
      processedValue = formatPhoneByType(value, 'MOBILE');
    } else if (name === 'employee_count' || name === 'country_id' || name === 'position_id') {
      processedValue = value ? Number(value) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // 실시간 유효성 검사 (해당 필드를 터치한 경우에만)
    if (touchedFields[name]) {
      const error = validateCompanyProfileField(name, processedValue, {
        ...formData,
        [name]: processedValue,
      } as CompanyProfileRequest);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    const processedValue = name === 'employee_count' || name === 'phone_number' || name === 'company_phone' || name === 'country_id' || name === 'position_id'
      ? formData[name as keyof CompanyProfileRequest]
      : value;

    const error = validateCompanyProfileField(name, processedValue as string | number, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors = validateCompanyProfileForm(formData);
    const fields = Object.keys(formData) as Array<keyof CompanyProfileRequest>;

    setErrors(newErrors);
    setTouchedFields(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('입력 항목을 확인해주세요.');
      return;
    }

    if (!hasChanges) {
      toast.error('변경된 내용이 없습니다.');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  // 오늘 날짜 (미래 날짜 선택 방지)
  const today = new Date().toISOString().split('T')[0];

  if (authLoading || (profileLoading && !profile)) {
    return (
      <Layout>
        <div className="min-h-screen bg-white py-8 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">돌아가기</span>
            </button>
            <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900">기업 프로필 수정</h1>
            <p className="text-sm text-slate-500 mt-2">
              기업 정보를 수정하세요
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 pb-24 sm:pb-16 lg:pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* 담당 기업 정보 - 카드 래퍼 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
              <h2 className="text-[15px] font-bold text-slate-900 mb-4">기업 정보</h2>
              <CompanyInfoSection
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                onChange={handleChange}
                onBlur={handleBlur}
                today={today}
              />
            </div>

            {/* 담당자 정보 - 카드 래퍼 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
              <h2 className="text-[15px] font-bold text-slate-900 mb-4">담당자 정보</h2>
              <ContactPersonSection
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* 제출 버튼 - 스티키 */}
            <motion.div
              className="fixed sm:sticky bottom-0 left-0 right-0 sm:bottom-6 sm:mt-6 bg-white sm:bg-transparent border-t sm:border-0 border-slate-200 p-4 sm:p-0 flex gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-5 sm:px-6 py-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending || !hasChanges}
                className={`flex-1 px-5 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  updateProfileMutation.isPending || !hasChanges
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]'
                }`}
                title={!hasChanges ? '변경된 내용이 없습니다' : ''}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="hidden sm:inline">수정 중...</span>
                    <span className="sm:hidden">중...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} className="hidden sm:block" />
                    <span className="hidden sm:inline">{hasChanges ? '수정 완료' : '변경사항 없음'}</span>
                    <span className="sm:hidden">{hasChanges ? '저장' : '저장됨'}</span>
                  </>
                )}
              </button>
            </motion.div>

            {hasChanges && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-amber-600 text-center pt-2"
              >
                * 저장되지 않은 변경사항이 있습니다.
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileEditClient;
