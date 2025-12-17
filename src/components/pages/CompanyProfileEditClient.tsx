'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building, MapPin, Phone, Mail, Globe, Users, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { profileApi } from '@/lib/api/profile/profileCompany';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyProfileRequest } from '@/lib/api/types';

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

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
    phone_number: 0,
    address: '',
    website_url: '',
    email: '',
  });

  const [originalData, setOriginalData] = useState<CompanyProfileRequest | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    await logout();
  };

  // Toast 표시 함수
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // 기존 프로필 조회
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany()
  });

  // 프로필 데이터가 로드되면 폼에 설정
  useEffect(() => {
    if (profile) {
      const data = {
        industry_type: profile.industry_type,
        employee_count: profile.employee_count,
        establishment_date: profile.establishment_date,
        company_type: profile.company_type,
        insurance: profile.insurance,
        phone_number: profile.phone_number,
        address: profile.address,
        website_url: profile.website_url,
        email: profile.email,
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [profile]);

  // 변경사항 확인
  const hasChanges = originalData ? JSON.stringify(formData) !== JSON.stringify(originalData) : false;

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => profileApi.updateProfileCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      showToast('success', '프로필이 성공적으로 수정되었습니다.');
      setTimeout(() => {
        router.push('/company');
      }, 1000);
    },
    onError: (error: unknown) => {
      console.error('프로필 수정 실패:', error);

      // 에러 메시지 한글화
      let errorMessage = '프로필 수정에 실패했습니다. 다시 시도해주세요.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        const serverError = axiosError.response?.data?.error;
        if (serverError) {
          errorMessage = serverError;
        }
      }

      showToast('error', errorMessage);
    },
  });

  // 실시간 필드 유효성 검사
  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case 'email':
        if (!value) return '이메일을 입력해주세요.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) return '올바른 이메일 형식이 아닙니다.';
        return '';

      case 'website_url':
        if (value && typeof value === 'string') {
          try {
            new URL(value);
            return '';
          } catch {
            return '올바른 URL 형식이 아닙니다. (예: https://example.com)';
          }
        }
        return '';

      case 'phone_number':
        if (!value || Number(value) <= 0) return '전화번호를 입력해주세요.';
        if (String(value).length < 7) return '올바른 전화번호를 입력해주세요.';
        return '';

      case 'employee_count':
        if (!value || Number(value) <= 0) return '직원 수를 입력해주세요.';
        return '';

      case 'industry_type':
        if (!value || !String(value).trim()) return '업종을 입력해주세요.';
        return '';

      case 'company_type':
        if (!value || !String(value).trim()) return '기업 형태를 선택해주세요.';
        return '';

      case 'address':
        if (!value || !String(value).trim()) return '주소를 입력해주세요.';
        return '';

      case 'establishment_date':
        if (!value) return '설립일을 입력해주세요.';
        const selectedDate = new Date(String(value));
        const today = new Date();
        if (selectedDate > today) return '설립일은 오늘 이전이어야 합니다.';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    // 전화번호는 숫자만 허용
    if (name === 'phone_number') {
      processedValue = value.replace(/[^0-9]/g, '');
      processedValue = processedValue ? Number(processedValue) : 0;
    } else if (name === 'employee_count') {
      processedValue = value ? Number(value) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // 실시간 유효성 검사 (해당 필드를 터치한 경우에만)
    if (touchedFields[name]) {
      const error = validateField(name, processedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    const processedValue = name === 'employee_count' || name === 'phone_number'
      ? formData[name as keyof CompanyProfileRequest]
      : value;

    const error = validateField(name, processedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = Object.keys(formData) as Array<keyof CompanyProfileRequest>;

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouchedFields(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', '입력 항목을 확인해주세요.');
      return;
    }

    if (!hasChanges) {
      showToast('error', '변경된 내용이 없습니다.');
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg max-w-md"
            style={{
              backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444',
              color: 'white',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="text-body-3 font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <Building size={20} />
                기본 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="industry_type" className="block text-body-3 font-medium text-label-700 mb-2">
                    업종 *
                  </label>
                  <input
                    type="text"
                    id="industry_type"
                    name="industry_type"
                    value={formData.industry_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.industry_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    placeholder="예: IT/소프트웨어, 제조, 유통 등"
                  />
                  {errors.industry_type && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.industry_type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company_type" className="block text-body-3 font-medium text-label-700 mb-2">
                    기업 형태 *
                  </label>
                  <select
                    id="company_type"
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.company_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer`}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employee_count" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                      <Users size={16} />
                      직원 수 *
                    </label>
                    <input
                      type="number"
                      id="employee_count"
                      name="employee_count"
                      value={formData.employee_count || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="1"
                      className={`w-full px-4 py-2 border ${errors.employee_count ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                      placeholder="10"
                    />
                    {errors.employee_count && (
                      <p className="mt-1 text-caption-2 text-status-error">{errors.employee_count}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="establishment_date" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      설립일 *
                    </label>
                    <input
                      type="date"
                      id="establishment_date"
                      name="establishment_date"
                      value={formData.establishment_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      max={today}
                      className={`w-full px-4 py-2 border ${errors.establishment_date ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    />
                    {errors.establishment_date && (
                      <p className="mt-1 text-caption-2 text-status-error">{errors.establishment_date}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="insurance" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    보험 <span className="text-caption-2 text-label-500">(선택)</span>
                  </label>
                  <input
                    type="text"
                    id="insurance"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    placeholder="예: 4대보험 완비, 산재보험 등"
                  />
                  <p className="mt-1 text-caption-2 text-label-500">제공하는 보험 정보를 입력해주세요.</p>
                </div>
              </div>
            </div>

            {/* 연락 정보 */}
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <Phone size={20} />
                연락 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    placeholder="hr@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.email}</p>
                  )}
                  <p className="mt-1 text-caption-2 text-label-500">채용 담당자 이메일을 입력해주세요.</p>
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Phone size={16} />
                    전화번호 *
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.phone_number ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    placeholder="0212345678"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.phone_number}</p>
                  )}
                  <p className="mt-1 text-caption-2 text-label-500">하이픈(-) 없이 숫자만 입력해주세요.</p>
                </div>

                <div>
                  <label htmlFor="website_url" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Globe size={16} />
                    웹사이트 <span className="text-caption-2 text-label-500">(선택)</span>
                  </label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.website_url ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    placeholder="https://example.com"
                  />
                  {errors.website_url && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.website_url}</p>
                  )}
                  <p className="mt-1 text-caption-2 text-label-500">회사 홈페이지 주소를 입력해주세요. (http:// 또는 https:// 포함)</p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    주소 *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.address ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    placeholder="서울특별시 강남구 테헤란로 427"
                  />
                  {errors.address && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.address}</p>
                  )}
                  <p className="mt-1 text-caption-2 text-label-500">회사의 주소를 입력해주세요.</p>
                </div>
              </div>
            </div>

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
