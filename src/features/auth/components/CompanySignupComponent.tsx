'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormField } from '@/shared/ui/FormField';
import { validatePassword } from '@/shared/lib/utils/validation';
import { authApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';
import TermsModal from '@/shared/ui/TermsModal';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  PRIVACY_POLICY_HOLD,
  COPYRIGHT_POLICY,
  COOKIE_POLICY,
} from '@/shared/constants/terms';
import { Smartphone, Monitor } from 'lucide-react';

interface CompanySignupFormData {
  userId: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
}

interface TermsAgreement {
  allAgree: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
  privacyPolicyHold: boolean;
  copyrightPolicy: boolean;
  cookiePolicy: boolean;
}

export default function CompanySignupComponent() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    showPassword: false,
    verificationMethod: null as 'phone' | 'ipin' | null,
  });

  const [termsAgreement, setTermsAgreement] = useState<TermsAgreement>({
    allAgree: false,
    termsOfService: false,
    privacyPolicy: false,
    privacyPolicyHold: false,
    copyrightPolicy: false,
    cookiePolicy: false,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  const openTermsModal = (
    type: 'termsOfService' | 'privacyPolicy' | 'privacyPolicyHold' | 'copyrightPolicy' | 'cookiePolicy'
  ) => {
    const modalContent = {
      termsOfService: { title: '사용자 약관', content: TERMS_OF_SERVICE },
      privacyPolicy: { title: '개인정보 처리방침', content: PRIVACY_POLICY },
      privacyPolicyHold: { title: '개인정보 처리방침 보류', content: PRIVACY_POLICY_HOLD },
      copyrightPolicy: { title: '저작권 정책', content: COPYRIGHT_POLICY },
      cookiePolicy: { title: '쿠키 정책', content: COOKIE_POLICY },
    };

    const { title, content } = modalContent[type];
    setModalState({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', content: '' });
  };

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CompanySignupFormData>({
    defaultValues: {
      userId: '',
      password: '',
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  const userIdValue = watch('userId');
  const passwordValue = watch('password');
  const nameValue = watch('name');
  const phoneNumberValue = watch('phoneNumber');
  const emailValue = watch('email');

  const allTermsAgreed =
    termsAgreement.termsOfService &&
    termsAgreement.privacyPolicy &&
    termsAgreement.privacyPolicyHold &&
    termsAgreement.copyrightPolicy &&
    termsAgreement.cookiePolicy;

  const isFormValid =
    userIdValue &&
    passwordValue &&
    nameValue &&
    phoneNumberValue &&
    emailValue &&
    allTermsAgreed &&
    formState.verificationMethod !== null;

  const handleAllAgreeChange = (checked: boolean) => {
    setTermsAgreement({
      allAgree: checked,
      termsOfService: checked,
      privacyPolicy: checked,
      privacyPolicyHold: checked,
      copyrightPolicy: checked,
      cookiePolicy: checked,
    });
  };

  const handleTermChange = (term: keyof Omit<TermsAgreement, 'allAgree'>, checked: boolean) => {
    const newTerms = {
      ...termsAgreement,
      [term]: checked,
    };

    const allChecked =
      newTerms.termsOfService &&
      newTerms.privacyPolicy &&
      newTerms.privacyPolicyHold &&
      newTerms.copyrightPolicy &&
      newTerms.cookiePolicy;

    setTermsAgreement({
      ...newTerms,
      allAgree: allChecked,
    });
  };

  const onSubmit = async (data: CompanySignupFormData) => {
    if (!formState.verificationMethod) {
      toast.error('본인 인증 또는 아이핀 인증을 선택해주세요.');
      return;
    }

    const companySignupData = {
      user_id: data.userId,
      password: data.password,
      name: data.name,
      phone: data.phoneNumber.replace(/[^0-9]/g, ''),
      email: data.email,
      verification_method: formState.verificationMethod,
    };

    try {
      // TODO: Replace with actual company signup API
      // await authApi.companySignup(companySignupData);

      toast.success('기업 회원가입이 완료되었습니다. 로그인 해주세요.');
      router.push('/company-login');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : '회원가입 중 오류가 발생했습니다.';
      toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full flex">
      {/* 약관 동의 섹션 */}
      <div className="w-full bg-gray-50 p-8 border-r border-line-200">
        <div className="max-w-[500px] mx-auto space-y-6">
          <h2 className="text-title-3 text-label-900 mb-6">약관 동의</h2>

          {/* 모두 동의 */}
          <div className="bg-white rounded-lg p-4 border-2 border-primary-300">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAgreement.allAgree}
                onChange={(e) => handleAllAgreeChange(e.target.checked)}
                className="w-5 h-5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
              />
              <span className="ml-3 text-body-2 font-semibold text-label-900 group-hover:text-primary-500 transition-colors">
                전체 동의
              </span>
            </label>
          </div>

          {/* 개별 약관 */}
          <div className="space-y-3">
            {/* 사용자 약관 */}
            <div className="bg-white rounded-lg p-4 border border-line-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAgreement.termsOfService}
                  onChange={(e) => handleTermChange('termsOfService', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-3 text-label-900 group-hover:text-primary-500 transition-colors">
                      <span className="text-primary-500">[필수]</span> 사용자 약관
                    </span>
                    <button
                      type="button"
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTermsModal('termsOfService');
                      }}
                    >
                      보기
                    </button>
                  </div>
                </div>
              </label>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="bg-white rounded-lg p-4 border border-line-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAgreement.privacyPolicy}
                  onChange={(e) => handleTermChange('privacyPolicy', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-3 text-label-900 group-hover:text-primary-500 transition-colors">
                      <span className="text-primary-500">[필수]</span> 개인정보 처리방침
                    </span>
                    <button
                      type="button"
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTermsModal('privacyPolicy');
                      }}
                    >
                      보기
                    </button>
                  </div>
                </div>
              </label>
            </div>

            {/* 개인정보 처리방침 보류 */}
            <div className="bg-white rounded-lg p-4 border border-line-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAgreement.privacyPolicyHold}
                  onChange={(e) => handleTermChange('privacyPolicyHold', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-3 text-label-900 group-hover:text-primary-500 transition-colors">
                      <span className="text-primary-500">[필수]</span> 개인정보 처리방침 보류
                    </span>
                    <button
                      type="button"
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTermsModal('privacyPolicyHold');
                      }}
                    >
                      보기
                    </button>
                  </div>
                </div>
              </label>
            </div>

            {/* 저작권 정책 */}
            <div className="bg-white rounded-lg p-4 border border-line-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAgreement.copyrightPolicy}
                  onChange={(e) => handleTermChange('copyrightPolicy', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-3 text-label-900 group-hover:text-primary-500 transition-colors">
                      <span className="text-primary-500">[필수]</span> 저작권 정책
                    </span>
                    <button
                      type="button"
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTermsModal('copyrightPolicy');
                      }}
                    >
                      보기
                    </button>
                  </div>
                </div>
              </label>
            </div>

            {/* 쿠키 정책 */}
            <div className="bg-white rounded-lg p-4 border border-line-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAgreement.cookiePolicy}
                  onChange={(e) => handleTermChange('cookiePolicy', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-primary-500 border-line-300 rounded focus:ring-2 focus:ring-primary-300 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-3 text-label-900 group-hover:text-primary-500 transition-colors">
                      <span className="text-primary-500">[필수]</span> 쿠키 정책
                    </span>
                    <button
                      type="button"
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        openTermsModal('cookiePolicy');
                      }}
                    >
                      보기
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 약관 모달 */}
      <TermsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        content={modalState.content}
      />

      {/* 회원가입 폼 섹션 */}
      <div className="flex justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[600px] w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-title-2 text-label-900">인사담당자 정보</h1>
              <a
                href="/help/overseas-corporate"
                className="text-body-3 text-primary-500 hover:text-primary-600 underline"
              >
                Overseas Corporate Help
              </a>
            </div>

            {/* 본인 인증 방법 선택 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* 본인 인증 */}
              <div
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  formState.verificationMethod === 'phone'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-line-200 hover:border-primary-300'
                }`}
                onClick={() => setFormState((prev) => ({ ...prev, verificationMethod: 'phone' }))}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-body-2 font-semibold text-label-900 mb-1">본인 인증</h3>
                    <p className="text-caption-2 text-label-600">
                      본인 인증 시 제공되는 정보는
                      <br />
                      인증 이외 용도로 이용 또는 저장되지 않습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 아이핀 인증 */}
              <div
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  formState.verificationMethod === 'ipin'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-line-200 hover:border-primary-300'
                }`}
                onClick={() => setFormState((prev) => ({ ...prev, verificationMethod: 'ipin' }))}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-body-2 font-semibold text-label-900 mb-1">아이핀 인증</h3>
                    <p className="text-caption-2 text-label-600">
                      NICE평가정보(주)를 통해 본
                      <br />
                      인증을 확인받을 수 있는 서비스입니다.
                      <br />
                      <a href="#" className="text-primary-500 underline">
                        아이핀이란?
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {/* 아이디 */}
              <FormField
                name="userId"
                control={control}
                label="아이디"
                rules={{ required: true }}
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="아이디 입력"
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              {/* 비밀번호 */}
              <FormField
                name="password"
                control={control}
                label="비밀번호"
                rules={{ required: true }}
                error={errors.password?.message}
                render={(field, fieldId) => (
                  <div className="relative">
                    <input
                      {...field}
                      id={fieldId}
                      type={formState.showPassword ? 'text' : 'password'}
                      value={field.value || ''}
                      placeholder="비밀번호 입력"
                      onBlur={(e) => {
                        const passwordError = validatePassword(e.target.value);
                        if (passwordError) {
                          setError('password', {
                            type: 'manual',
                            message: passwordError,
                          });
                        } else {
                          clearErrors('password');
                        }
                      }}
                      className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent pr-16"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-caption-2 text-label-500 hover:text-label-700"
                    >
                      표시
                    </button>
                  </div>
                )}
              />

              {/* 가입자명 */}
              <FormField
                name="name"
                control={control}
                label="가입자명"
                rules={{ required: true }}
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="가입자명 입력"
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              {/* 전화번호 */}
              <FormField
                name="phoneNumber"
                control={control}
                label="전화번호"
                rules={{ required: true }}
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="tel"
                    value={field.value || ''}
                    placeholder="전화번호 입력"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const formatted =
                        value.length <= 3
                          ? value
                          : value.length <= 7
                          ? `${value.slice(0, 3)}-${value.slice(3)}`
                          : `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
                      field.onChange(formatted);
                    }}
                    maxLength={13}
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              {/* 이메일 */}
              <FormField
                name="email"
                control={control}
                label="이메일"
                rules={{ required: true }}
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="email"
                    value={field.value || ''}
                    placeholder="이메일 입력"
                    onBlur={(e) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(e.target.value)) {
                        setError('email', {
                          type: 'manual',
                          message: '이메일 형식이 올바르지 않습니다.',
                        });
                      } else {
                        clearErrors('email');
                      }
                    }}
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />
            </motion.div>

            <motion.div className="space-y-3 mt-6">
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isFormValid
                    ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                    : 'bg-gray-300 text-white cursor-not-allowed'
                }`}
                disabled={!isFormValid}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                가입하기
              </motion.button>
              {!allTermsAgreed && (
                <p className="text-caption-2 text-red-500 text-center">모든 약관에 동의해주세요</p>
              )}
              {!formState.verificationMethod && (
                <p className="text-caption-2 text-red-500 text-center">
                  본인 인증 방법을 선택해주세요
                </p>
              )}
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
