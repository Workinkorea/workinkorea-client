'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/ui/FormField';
import { SelectSearchInput } from '@/components/ui/SelectSearchInput';
import { COUNTRIES } from '@/constants/countries';
import { validateEmail } from '@/lib/utils/validation';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import TermsModal from '@/components/ui/TermsModal';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  PRIVACY_POLICY_HOLD,
  COPYRIGHT_POLICY,
  COOKIE_POLICY,
} from '@/constants/terms';

interface SignupFormData {
  name: string;
  birth: string;
  country: string;
  email: string;
  verificationCode: string;
}

interface TermsAgreement {
  allAgree: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
  privacyPolicyHold: boolean;
  copyrightPolicy: boolean;
  cookiePolicy: boolean;
}

export default function SignupComponent({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    isEmailSent: !!userEmail,
    isEmailVerified: !!userEmail,
    verificationCode: '',
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

  // 약관 보기 모달 열기
  const openTermsModal = (type: 'termsOfService' | 'privacyPolicy' | 'privacyPolicyHold' | 'copyrightPolicy' | 'cookiePolicy') => {
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
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      birth: '',
      country: '',
      email: userEmail || '',
      verificationCode: '',
    }
  });

  useEffect(() => {
    if (userEmail) {
      setValue('email', userEmail);
    }
  }, [userEmail, setValue]);

  const emailValue = watch('email');
  const codeValue = watch('verificationCode');
  const nameValue = watch('name');
  const birthValue = watch('birth');
  const countryValue = watch('country');

  const isEmailFromParam = !!userEmail;

  const handleSendVerificationCode = async (email: string) => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError('email', {
        type: 'manual',
        message: validationError
      });
      return;
    }

    try {
      await authApi.sendEmailVerification(email);

      setFormState(prev => ({
        ...prev,
        isEmailSent: true
      }));

      clearErrors('email');
      toast.success('인증번호가 이메일로 전송되었습니다.');
    } catch {
      setFormState(prev => ({
        ...prev,
        isEmailSent: true
      }));
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    if (!code || code.length !== 6) {
      setError('verificationCode', {
        type: 'manual',
        message: '6자리 인증번호를 입력해주세요.'
      });
      return;
    }

    try {
      await authApi.verifyEmailCode(email, code);

      setFormState(prev => ({
        ...prev,
        isEmailVerified: true
      }));

      clearErrors('verificationCode');
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : '인증번호 확인 중 오류가 발생했습니다.';

      setError('verificationCode', {
        type: 'manual',
        message: errorMessage || '인증번호가 올바르지 않습니다.'
      });
      toast.error(errorMessage || '인증번호가 올바르지 않습니다.');
    }
  }

  const onSubmit = async (data: SignupFormData) => {
    if (!formState.isEmailVerified) {
      toast.error('이메일 인증 완료해주세요.');
      return;
    }
    const { email, name, birth, country } = data;

    const birth_date = `${birth.substring(0, 4)}-${birth.substring(4, 6)}-${birth.substring(6, 8)}`;

    const signupData = {
      email: email,
      name: name,
      birth_date: birth_date,
      country_code: country,
    };

    try {
      await authApi.signup(signupData);

      toast.success('회원가입이 완료되었습니다. 로그인 해주세요.');
      router.push('/login');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : '회원가입 중 오류가 발생했습니다.';
      toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.');
    }
  };

  // 모든 약관 동의 여부 확인
  const allTermsAgreed =
    termsAgreement.termsOfService &&
    termsAgreement.privacyPolicy &&
    termsAgreement.privacyPolicyHold &&
    termsAgreement.copyrightPolicy &&
    termsAgreement.cookiePolicy;

  const isFormValid =
    formState.isEmailVerified &&
    nameValue &&
    birthValue &&
    birthValue.length === 8 &&
    countryValue &&
    allTermsAgreed;

  // 모두 동의 체크박스 핸들러
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

  // 개별 약관 체크박스 핸들러
  const handleTermChange = (term: keyof Omit<TermsAgreement, 'allAgree'>, checked: boolean) => {
    const newTerms = {
      ...termsAgreement,
      [term]: checked,
    };

    // 모든 개별 약관이 체크되었는지 확인
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

  return (
    <div className='w-full flex'>
      {/* 약관 동의 섹션 */}
      <div className='w-full bg-gray-50 p-8 border-r border-line-200'>
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
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline"
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
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline"
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
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline"
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
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline"
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
                      className="text-caption-2 text-label-500 hover:text-primary-500 underline"
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
        <div className="max-w-[400px] w-full space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-title-2 text-label-900 mb-8">
              개인 회원가입
            </h1>
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
              <div className='mb-6'>
                <FormField
                  name="email"
                  control={control}
                  label="이메일"
                  render={(field, fieldId) => (
                    <div className="flex gap-2">
                      <input
                        {...field}
                        id={fieldId}
                        type="email"
                        value={field.value || ''}
                        placeholder="example@email.com"
                        disabled={isEmailFromParam}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFormState(prev => ({
                            ...prev,
                            isEmailSent: false,
                            isEmailVerified: false
                          }));
                          clearErrors('email');
                        }}
                        className={`flex-1 border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                          isEmailFromParam ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                      {!isEmailFromParam && (
                        <motion.button
                          type="button"
                          onClick={() => emailValue && handleSendVerificationCode(emailValue)}
                          disabled={!emailValue || validateEmail(emailValue) !== null || formState.isEmailSent}
                          className={`relative px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                            emailValue && validateEmail(emailValue) === null && !formState.isEmailSent
                              ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          whileTap={emailValue && validateEmail(emailValue) === null && !formState.isEmailSent ? { scale: 0.95 } : {}}
                        >
                          {formState.isEmailSent ? '전송완료' : '인증하기'}
                        </motion.button>
                      )}
                    </div>
                  )}
                />
              </div>

              {formState.isEmailSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <FormField
                    name="verificationCode"
                    control={control}
                    label="인증번호"
                    render={(field, fieldId) => (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            {...field}
                            id={fieldId}
                            type="text"
                            value={field.value || ''}
                            placeholder="6자리 인증번호"
                            maxLength={6}
                            disabled={formState.isEmailVerified}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                              setFormState(prev => ({
                                ...prev,
                                verificationCode: value
                              }));
                              clearErrors('verificationCode');
                            }}
                            className={`flex-1 border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                              formState.isEmailVerified ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <motion.button
                            type="button"
                            onClick={() => {
                              if (emailValue && codeValue) {
                                handleVerifyCode(emailValue, codeValue);
                              }
                            }}
                            disabled={formState.isEmailVerified || !codeValue || codeValue.length !== 6}
                            className={`relative px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                              formState.isEmailVerified
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : codeValue && codeValue.length === 6
                                ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            whileTap={!formState.isEmailVerified && codeValue && codeValue.length === 6 ? { scale: 0.95 } : {}}
                          >
                            {formState.isEmailVerified ? '인증완료' : '확인'}
                          </motion.button>
                        </div>
                        {formState.isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-green-600 text-caption-1"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>이메일 인증이 완료되었습니다.</span>
                          </motion.div>
                        )}
                      </div>
                    )}
                  />
                </motion.div>
              )}
              <FormField
                name="name"
                control={control}
                label="이름 (영문)"
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="Hong Gildong"
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              <FormField
                name="birth"
                control={control}
                label="생년월일"
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="YYYYMMDD"
                    maxLength={8}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              <FormField
                name="country"
                control={control}
                label="국적"
                render={(field) => (
                  <SelectSearchInput
                    options={COUNTRIES}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="국적을 선택하세요"
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
                whileTap={isFormValid ? { scale: 0.98 }: {}}
              >
                회원가입
              </motion.button>
              {!allTermsAgreed && (
                <p className="text-caption-2 text-red-500 text-center">
                  모든 약관에 동의해주세요
                </p>
              )}
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}