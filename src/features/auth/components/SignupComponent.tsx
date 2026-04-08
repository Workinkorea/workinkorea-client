'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormField } from '@/shared/ui/FormField';
import { SelectSearchInput } from '@/shared/ui/SelectSearchInput';
import { Input } from '@/shared/ui/Input';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils/utils';
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

const TERMS_CONTENT_RAW: Record<TermKey, string> = {
  termsOfService: TERMS_OF_SERVICE,
  privacyPolicy: PRIVACY_POLICY,
  privacyPolicyHold: PRIVACY_POLICY_HOLD,
  copyrightPolicy: COPYRIGHT_POLICY,
  cookiePolicy: COOKIE_POLICY,
};

const TERM_KEYS: TermKey[] = [
  'termsOfService',
  'privacyPolicy',
  'privacyPolicyHold',
  'copyrightPolicy',
  'cookiePolicy',
];

export default function SignupComponent({ userEmail, callbackUrl }: { userEmail?: string; callbackUrl?: string }) {
  const router = useRouter();
  const t = useTranslations('auth.signup');

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
    setModalState({
      isOpen: true,
      title: t(`termLabels.${type}`),
      content: TERMS_CONTENT_RAW[type],
    });
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
      toast.success(t('toastCodeSent'));
    } catch {
      setFormState(prev => ({ ...prev, isEmailSent: true }));
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    if (!code || code.length !== 6) {
      setError('verificationCode', { type: 'manual', message: t('errorCodeRequired') });
      return;
    }
    try {
      await authApi.verifyEmailCode(email, code);
      setFormState(prev => ({ ...prev, isEmailVerified: true }));
      clearErrors('verificationCode');
      toast.success(t('toastEmailVerified'));
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : t('toastCodeError');
      setError('verificationCode', {
        type: 'manual',
        message: errorMessage || t('toastCodeInvalid'),
      });
      toast.error(errorMessage || t('toastCodeInvalid'));
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!formState.isEmailVerified) {
      toast.error(t('toastVerifyFirst'));
      return;
    }
    const { email, name, birth, country } = data;
    const birth_date = `${birth.substring(0, 4)}-${birth.substring(4, 6)}-${birth.substring(6, 8)}`;
    try {
      await authApi.signup({ email, name, birth_date, country_code: country });
      toast.success(t('toastSuccess'));
      const loginRedirect = callbackUrl
        ? `/login?signup=success&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '/login?signup=success';
      router.push(loginRedirect);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : t('toastError');
      toast.error(errorMessage || t('toastError'));
    }
  };

  const allTermsAgreed = TERM_KEYS.every((key) => termsAgreement[key]);

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
    setTermsAgreement({ ...newTerms, allAgree: TERM_KEYS.every((key) => newTerms[key]) });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* 약관 동의 섹션 - 모바일: 전체 너비, 데스크탑: 좌측 */}
      <div className="w-full lg:w-1/2 lg:border-r lg:border-line-400 px-4 sm:px-6 py-8 sm:py-12 lg:p-12">
        <div className="max-w-xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-body-2 font-bold text-label-900 mb-4">{t('termsTitle')}</h2>
          </motion.div>

          {/* 모두 동의 */}
          <motion.div
            className="bg-white border-2 border-blue-600 rounded-xl p-5 sm:p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Checkbox
              checked={termsAgreement.allAgree}
              onChange={(e) => handleAllAgreeChange(e.target.checked)}
              label={t('agreeAll')}
              size="md"
            />
          </motion.div>

          {/* 개별 약관 */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.05 }}
          >
            {TERM_KEYS.map((key, index) => (
              <motion.div
                key={key}
                className="bg-white border border-line-400 rounded-xl p-5 sm:p-6 shadow-sm hover:border-primary-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={termsAgreement[key]}
                    onChange={(e) => handleTermChange(key, e.target.checked)}
                    size="sm"
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-body-3 text-label-900">
                        <span className="text-primary-600 font-semibold">{t('required')}</span>{' '}
                        {t(`termLabels.${key}`)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          openTermsModal(key);
                        }}
                        className="text-caption-3 text-label-500 hover:text-primary-600 underline whitespace-nowrap shrink-0 !px-0 !py-0 h-auto"
                      >
                        {t('viewButton')}
                      </Button>
                    </div>
                  </div>
                </div>
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
            <h1 className="text-title-3 sm:text-title-2 font-bold text-label-900 mb-2">{t('personalTitle')}</h1>
            <p className="text-caption-1 text-label-500">{t('formSubtitle')}</p>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 폼 카드 래퍼 */}
            <div className="bg-white border border-line-400 rounded-xl p-5 sm:p-7 shadow-sm space-y-4">
              <div className="mb-2">
                <h3 className="text-body-2 font-bold text-label-900 mb-4">{t('basicInfo')}</h3>
              </div>

              <div className="mb-6">
                <FormField
                  name="email"
                  control={control}
                  label={t('email')}
                  render={(field, fieldId) => (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
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
                        className={cn('flex-1', isEmailFromParam && 'bg-label-50')}
                      />
                      {!isEmailFromParam && (
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={() => emailValue && handleSendVerificationCode(emailValue)}
                          disabled={!emailValue || validateEmail(emailValue) !== null || formState.isEmailSent}
                          className="whitespace-nowrap"
                        >
                          {formState.isEmailSent ? t('codeSent') : t('sendCode')}
                        </Button>
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
                  className="flex items-center gap-2 text-status-correct text-caption-2 -mt-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t('emailVerifiedMsg')}</span>
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
                    label={t('verificationCode')}
                    render={(field, fieldId) => (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Input
                            {...field}
                            id={fieldId}
                            type="text"
                            value={field.value || ''}
                            placeholder={t('codePlaceholder')}
                            maxLength={6}
                            disabled={formState.isEmailVerified}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                              setFormState(prev => ({ ...prev, verificationCode: value }));
                              clearErrors('verificationCode');
                            }}
                            className={cn('flex-1', formState.isEmailVerified && 'bg-label-50')}
                          />
                          <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={() => emailValue && codeValue && handleVerifyCode(emailValue, codeValue)}
                            disabled={formState.isEmailVerified || !codeValue || codeValue.length !== 6}
                            className="whitespace-nowrap"
                          >
                            {formState.isEmailVerified ? t('codeVerified') : t('verify')}
                          </Button>
                        </div>
                        {formState.isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-status-correct text-caption-2"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{t('emailVerifiedMsg')}</span>
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
                label={t('nameLabel')}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="Hong Gildong"
                  />
                )}
              />

              <FormField
                name="birth"
                control={control}
                label={t('birthLabel')}
                render={(field, fieldId) => (
                  <Input
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
                  />
                )}
              />

              <FormField
                name="country"
                control={control}
                label={t('nationality')}
                render={(field) => (
                  <SelectSearchInput
                    options={COUNTRIES}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={t('countryPlaceholder')}
                  />
                )}
              />
            </div>

            {/* 제출 버튼 */}
            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isFormValid}
                className="w-full"
              >
                {t('signupButton')}
              </Button>
              {!allTermsAgreed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-caption-3 text-status-error text-center"
                >
                  {t('termsRequired')}
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
