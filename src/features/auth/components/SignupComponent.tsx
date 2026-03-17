'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormField } from '@/shared/ui/FormField';
import { SelectSearchInput } from '@/shared/ui/SelectSearchInput';
import { COUNTRIES } from '@/shared/constants/countries';
import { validateEmail } from '@/shared/lib/utils/validation';
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

type TermKey = Exclude<keyof TermsAgreement, 'allAgree'>;

const TERMS: { key: TermKey; label: string }[] = [
  { key: 'termsOfService', label: '사용자 약관' },
  { key: 'privacyPolicy', label: '개인정보 처리방침' },
  { key: 'privacyPolicyHold', label: '개인정보 처리방침 보류' },
  { key: 'copyrightPolicy', label: '저작권 정책' },
  { key: 'cookiePolicy', label: '쿠키 정책' },
];

const TERMS_CONTENT: Record<TermKey, { title: string; content: string }> = {
  termsOfService: { title: '사용자 약관', content: TERMS_OF_SERVICE },
  privacyPolicy: { title: '개인정보 처리방침', content: PRIVACY_POLICY },
  privacyPolicyHold: { title: '개인정보 처리방침 보류', content: PRIVACY_POLICY_HOLD },
  copyrightPolicy: { title: '저작권 정책', content: COPYRIGHT_POLICY },
  cookiePolicy: { title: '쿠키 정책', content: COOKIE_POLICY },
};

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
  }>({ isOpen: false, title: '', content: '' });

  const openTermsModal = (type: TermKey) => {
    const { title, content } = TERMS_CONTENT[type];
    setModalState({ isOpen: true, title, content });
  };

  const closeModal = () => setModalState({ isOpen: false, title: '', content: '' });

  const { control, handleSubmit, watch, setError, clearErrors, setValue } = useForm({
    defaultValues: {
      name: '',
      birth: '',
      country: '',
      email: userEmail || '',
      verificationCode: '',
    },
  });

  useEffect(() => {
    if (userEmail) setValue('email', userEmail);
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
      setError('email', { type: 'manual', message: validationError });
      return;
    }
    try {
      await authApi.sendEmailVerification(email);
      setFormState(prev => ({ ...prev, isEmailSent: true }));
      clearErrors('email');
      toast.success('인증번호가 이메일로 전송되었습니다.');
    } catch {
      setFormState(prev => ({ ...prev, isEmailSent: true }));
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    if (!code || code.length !== 6) {
      setError('verificationCode', { type: 'manual', message: '6자리 인증번호를 입력해주세요.' });
      return;
    }
    try {
      await authApi.verifyEmailCode(email, code);
      setFormState(prev => ({ ...prev, isEmailVerified: true }));
      clearErrors('verificationCode');
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : '인증번호 확인 중 오류가 발생했습니다.';
      setError('verificationCode', {
        type: 'manual',
        message: errorMessage || '인증번호가 올바르지 않습니다.',
      });
      toast.error(errorMessage || '인증번호가 올바르지 않습니다.');
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!formState.isEmailVerified) {
      toast.error('이메일 인증 완료해주세요.');
      return;
    }
    const { email, name, birth, country } = data;
    const birth_date = `${birth.substring(0, 4)}-${birth.substring(4, 6)}-${birth.substring(6, 8)}`;
    try {
      await authApi.signup({ email, name, birth_date, country_code: country });
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

  const allTermsAgreed = TERMS.every(({ key }) => termsAgreement[key]);

  const isFormValid =
    formState.isEmailVerified &&
    nameValue &&
    birthValue &&
    birthValue.length === 8 &&
    countryValue &&
    allTermsAgreed;

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

  const handleTermChange = (term: TermKey, checked: boolean) => {
    const newTerms = { ...termsAgreement, [term]: checked };
    setTermsAgreement({ ...newTerms, allAgree: TERMS.every(({ key }) => newTerms[key]) });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* 약관 동의 섹션 - 모바일: 전체 너비, 데스크탑: 좌측 */}
      <div className="w-full lg:w-1/2 lg:border-r lg:border-slate-200 px-4 sm:px-6 py-8 sm:py-12 lg:p-12">
        <div className="max-w-xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[15px] font-bold text-slate-900 mb-4">약관 동의</h2>
          </motion.div>

          {/* 모두 동의 */}
          <motion.div
            className="bg-white border-2 border-blue-600 rounded-xl p-5 sm:p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAgreement.allAgree}
                onChange={(e) => handleAllAgreeChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
              />
              <span className="ml-3 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                전체 동의
              </span>
            </label>
          </motion.div>

          {/* 개별 약관 */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.05 }}
          >
            {TERMS.map(({ key, label }, index) => (
              <motion.div
                key={key}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-blue-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <label className="flex items-start cursor-pointer group gap-3">
                  <input
                    type="checkbox"
                    checked={termsAgreement[key]}
                    onChange={(e) => handleTermChange(key, e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        <span className="text-blue-600 font-semibold">[필수]</span> {label}
                      </span>
                      <button
                        type="button"
                        className="text-[11px] text-slate-500 hover:text-blue-600 underline cursor-pointer whitespace-nowrap shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          openTermsModal(key);
                        }}
                      >
                        보기
                      </button>
                    </div>
                  </div>
                </label>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 약관 모달 */}
      <TermsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        content={modalState.content}
      />

      {/* 회원가입 폼 섹션 - 모바일: 전체 너비, 데스크탑: 우측 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 lg:p-12 bg-white">
        <div className="max-w-xl mx-auto w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-title-3 sm:text-title-2 font-bold text-slate-900 mb-2">개인 회원가입</h1>
            <p className="text-sm text-slate-500">가입 정보를 입력하세요</p>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 폼 카드 래퍼 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-4">
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-slate-900 mb-4">기본 정보</h3>
              </div>

              <div className="mb-6">
                <FormField
                  name="email"
                  control={control}
                  label="이메일"
                  render={(field, fieldId) => (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        {...field}
                        id={fieldId}
                        type="email"
                        value={field.value || ''}
                        placeholder="example@email.com"
                        disabled={isEmailFromParam}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFormState(prev => ({ ...prev, isEmailSent: false, isEmailVerified: false }));
                          clearErrors('email');
                        }}
                        className={`flex-1 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors ${
                          isEmailFromParam ? 'bg-slate-50 cursor-not-allowed' : ''
                        }`}
                      />
                      {!isEmailFromParam && (
                        <motion.button
                          type="button"
                          onClick={() => emailValue && handleSendVerificationCode(emailValue)}
                          disabled={!emailValue || validateEmail(emailValue) !== null || formState.isEmailSent}
                          className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            emailValue && validateEmail(emailValue) === null && !formState.isEmailSent
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          whileTap={
                            emailValue && validateEmail(emailValue) === null && !formState.isEmailSent
                              ? { scale: 0.95 }
                              : {}
                          }
                        >
                          {formState.isEmailSent ? '전송완료' : '인증하기'}
                        </motion.button>
                      )}
                    </div>
                  )}
                />
              </div>

              {isEmailFromParam && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-emerald-600 text-xs -mt-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>이메일 인증이 완료되었습니다.</span>
                </motion.div>
              )}

              {formState.isEmailSent && !isEmailFromParam && (
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
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                              setFormState(prev => ({ ...prev, verificationCode: value }));
                              clearErrors('verificationCode');
                            }}
                            className={`flex-1 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors ${
                              formState.isEmailVerified ? 'bg-slate-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <motion.button
                            type="button"
                            onClick={() => emailValue && codeValue && handleVerifyCode(emailValue, codeValue)}
                            disabled={formState.isEmailVerified || !codeValue || codeValue.length !== 6}
                            className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                              formState.isEmailVerified
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : codeValue && codeValue.length === 6
                                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            whileTap={
                              !formState.isEmailVerified && codeValue && codeValue.length === 6
                                ? { scale: 0.95 }
                                : {}
                            }
                          >
                            {formState.isEmailVerified ? '인증완료' : '확인'}
                          </motion.button>
                        </div>
                        {formState.isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-emerald-600 text-xs"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
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
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors"
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
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors"
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
            </div>

            {/* 제출 버튼 */}
            <div className="space-y-3">
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                회원가입
              </motion.button>
              {!allTermsAgreed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-red-500 text-center"
                >
                  모든 약관에 동의해주세요
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
