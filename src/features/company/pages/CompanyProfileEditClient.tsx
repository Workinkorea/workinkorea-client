'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileApi } from '../api/profileCompany';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyProfileRequest } from '@/shared/types/api';
import toast from 'react-hot-toast';
import { detectPhoneType, formatPhoneByType, PhoneType } from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';
import { validateCompanyProfileField, validateCompanyProfileForm } from '../validations/companyProfileValidation';
import { BasicInfoSection } from '@/features/company/components/BasicInfoSection';
import { ContactInfoSection } from '@/features/company/components/ContactInfoSection';

const CompanyProfileEditClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });

  const [formData, setFormData] = useState<CompanyProfileRequest>({
    industry_type: '',
    employee_count: 0,
    establishment_date: '',
    company_type: '',
    insurance: '',
    phone_number: '',
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

  const handleLogout = async () => {
    await logout();
  };

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
        phone_number: phoneNum,
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
  const hasChanges = React.useMemo(() => {
    if (!originalData) {
      // originalData가 없으면 기본값과 비교
      const defaultData = {
        industry_type: '',
        employee_count: 0,
        establishment_date: '',
        company_type: '',
        insurance: '',
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

    // Handle phone type change
    if (name === 'phone_type') {
      const newPhoneType = value as PhoneType;
      setFormData((prev) => ({
        ...prev,
        phone_type: newPhoneType,
        phone_number: '',  // Reset phone number when type changes
      }));
      setErrors((prev) => ({ ...prev, phone_number: '' }));
      return;
    }

    // 전화번호는 자동으로 타입별 포맷팅
    if (name === 'phone_number') {
      processedValue = formatPhoneByType(value, formData.phone_type);
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

    const processedValue = name === 'employee_count' || name === 'phone_number' || name === 'country_id' || name === 'position_id'
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
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />

      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-label-600 hover:text-label-900 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-body-3">돌아가기</span>
            </button>
            <h1 className="text-title-2 font-bold text-label-900">기업 프로필 수정</h1>
            <p className="text-body-3 text-label-500 mt-1">
              기업 정보를 수정하세요
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* 기본 정보 */}
            <BasicInfoSection
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              onChange={handleChange}
              onBlur={handleBlur}
              today={today}
            />

            {/* 연락 정보 */}
            <ContactInfoSection
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending || !hasChanges}
                className={`flex-1 px-6 py-3 rounded-lg text-body-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                  updateProfileMutation.isPending || !hasChanges
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                title={!hasChanges ? '변경된 내용이 없습니다' : ''}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {hasChanges ? '수정 완료' : '변경사항 없음'}
                  </>
                )}
              </button>
            </div>

            {hasChanges && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-caption-2 text-orange-600 text-center"
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
