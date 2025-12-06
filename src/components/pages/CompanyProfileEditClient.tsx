'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building, MapPin, Phone, Mail, Globe, Users, Calendar, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { profileApi } from '@/lib/api/profile/profileCompany';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyProfileRequest } from '@/lib/api/types';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setFormData({
        industry_type: profile.industry_type,
        employee_count: profile.employee_count,
        establishment_date: profile.establishment_date,
        company_type: profile.company_type,
        insurance: profile.insurance,
        phone_number: profile.phone_number,
        address: profile.address,
        website_url: profile.website_url,
        email: profile.email,
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => profileApi.updateProfileCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      alert('프로필이 수정되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'employee_count' || name === 'phone_number' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.industry_type?.trim()) {
      newErrors.industry_type = '업종을 입력해주세요.';
    }
    if (!formData.employee_count || formData.employee_count <= 0) {
      newErrors.employee_count = '직원 수를 입력해주세요.';
    }
    if (!formData.establishment_date?.trim()) {
      newErrors.establishment_date = '설립일을 입력해주세요.';
    }
    if (!formData.company_type?.trim()) {
      newErrors.company_type = '기업 형태를 선택해주세요.';
    }
    if (!formData.address?.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }
    if (!formData.email?.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    }
    if (!formData.phone_number || formData.phone_number <= 0) {
      newErrors.phone_number = '전화번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateProfileMutation.mutate(formData);
  };

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
                    className={`w-full px-4 py-2 border ${errors.industry_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="예: IT/소프트웨어"
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
                    className={`w-full px-4 py-2 border ${errors.company_type ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
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
                      value={formData.employee_count}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-2 border ${errors.employee_count ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
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
                      className={`w-full px-4 py-2 border ${errors.establishment_date ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.establishment_date && (
                      <p className="mt-1 text-caption-2 text-status-error">{errors.establishment_date}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="insurance" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    보험
                  </label>
                  <input
                    type="text"
                    id="insurance"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="예: 4대보험 완비"
                  />
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
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="hr@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Phone size={16} />
                    전화번호 *
                  </label>
                  <input
                    type="number"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.phone_number ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="27001234"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="website_url" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Globe size={16} />
                    웹사이트
                  </label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com"
                  />
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
                    className={`w-full px-4 py-2 border ${errors.address ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="서울특별시 강남구 테헤란로 427"
                  />
                  {errors.address && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.address}</p>
                  )}
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
                disabled={updateProfileMutation.isPending}
                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    수정 완료
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileEditClient;
