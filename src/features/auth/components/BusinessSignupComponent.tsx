'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { toast } from 'sonner';
import TermsModal from '@/shared/ui/TermsModal';
import { authApi } from '@/features/auth/api/authApi';
import {
  formatBusinessNumber,
  isValidBusinessNumber,
  validatePassword,
  validateConfirmPassword,
} from '@/shared/lib/utils/validation';
import {
  formatPhoneByType,
  validatePhoneType,
  getPhonePlaceholder,
  PhoneType,
} from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError, getErrorStatus } from '@/shared/lib/utils/errorHandler';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  PRIVACY_POLICY_HOLD,
  COPYRIGHT_POLICY,
  COOKIE_POLICY,
} from '@/shared/constants/terms';

interface BusinessSignupFormData {
  businessNumber: string;
  company: string;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface TermsAgreement {
  allAgree: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
  personalInfo: boolean;
  thirdParty: boolean;
  marketing: boolean;
}

type TermKey = Exclude<keyof TermsAgreement, 'allAgree'>;

const TERMS: { key: TermKey; label: string; required: boolean }[] = [
  { key: 'termsOfService', label: '서비스 이용약관', required: true },
  { key: 'privacyPolicy', label: '개인(신용)정보 수집 및 이용동의', required: true },
  { key: 'personalInfo', label: '개인(신용)정보 제공 및 위탁동의', required: true },
  { key: 'thirdParty', label: '개인(신용)정보 조회 동의', required: true },
  { key: 'marketing', label: '마케팅 활용 및 광고성 정보 수신동의', required: false },
];

const TERMS_CONTENT: Record<TermKey, { title: string; content: string }> = {
  termsOfService: { title: '서비스 이용약관', content: TERMS_OF_SERVICE },
  privacyPolicy: { title: '개인(신용)정보 수집 및 이용동의', content: PRIVACY_POLICY },
  personalInfo: { title: '개인(신용)정보 제공 및 위탁동의', content: PRIVACY_POLICY_HOLD },
  thirdParty: { title: '개인(신용)정보 조회 동의', content: COPYRIGHT_POLICY },
  marketing: { title: '마케팅 활용 및 광고성 정보 수신동의', content: COOKIE_POLICY },
};

const REQUIRED_KEYS: TermKey[] = ['termsOfService', 'privacyPolicy', 'personalInfo', 'thirdParty'];

export default function BusinessSignupComponent() {
  const router = useRouter();

  const [termsAgreement, setTermsAgreement] = useState<TermsAgreement>({
    allAgree: false,
    termsOfService: false,
    privacyPolicy: false,
    personalInfo: false,
    thirdParty: false,
    marketing: false,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({ isOpen: false, title: '', content: '' });

  const [formState, setFormState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isBusinessNumberVerified: false,
    isVerifying: false,
    businessNumberMessage: '',
    businessNumberVerifyToken: '',
    phoneType: 'MOBILE' as PhoneType,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<BusinessSignupFormData>({
    mode: 'onChange',
    defaultValues: {
      businessNumber: '',
      company: '',
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const businessNumber = watch('businessNumber');
  const company = watch('company');
  const name = watch('name');
  const phoneNumber = watch('phoneNumber');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const openTermsModal = (key: TermKey) => {
    const { title, content } = TERMS_CONTENT[key];
    setModalState({ isOpen: true, title, content });
  };

  const closeModal = () => setModalState({ isOpen: false, title: '', content: '' });

  const handleAllAgreeChange = (checked: boolean) => {
    setTermsAgreement({
      allAgree: checked,
      termsOfService: checked,
      privacyPolicy: checked,
      personalInfo: checked,
      thirdParty: checked,
      marketing: checked,
    });
  };

  const handleTermChange = (key: TermKey, checked: boolean) => {
    const newTerms = { ...termsAgreement, [key]: checked };
    setTermsAgreement({ ...newTerms, allAgree: TERMS.every(({ key: k }) => newTerms[k]) });
  };

  const handleBusinessNumberCheck = async (value: string) => {
    if (!isValidBusinessNumber(value)) {
      setError('businessNumber', { type: 'manual', message: '사업자등록번호 10자리를 입력해주세요.' });
      return;
    }
    setFormState(prev => ({ ...prev, isVerifying: true }));
    try {
      const response = await authApi.verifyBusinessNumber(value);
      if (response.status_code === 'OK' && response.data && response.data.length > 0) {
        const businessData = response.data[0];
        if (businessData.b_stt_cd !== '01') {
          setError('businessNumber', { type: 'manual', message: `해당 사업자는 ${businessData.b_stt} 상태입니다.` });
          toast.error(`사업자 상태: ${businessData.b_stt}`);
          return;
        }
        setFormState(prev => ({
          ...prev,
          isBusinessNumberVerified: true,
          businessNumberMessage: '사업자등록번호 인증이 완료되었습니다.',
          businessNumberVerifyToken: `verified_${value}_${Date.now()}`,
        }));
        clearErrors('businessNumber');
        toast.success('사업자등록번호 인증이 완료되었습니다.');
      } else {
        setError('businessNumber', { type: 'manual', message: '유효하지 않은 사업자등록번호입니다.' });
        toast.error('유효하지 않은 사업자등록번호입니다.');
      }
    } catch {
      setError('businessNumber', { type: 'manual', message: '사업자등록번호 인증에 실패했습니다.' });
      toast.error('사업자등록번호 인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setFormState(prev => ({ ...prev, isVerifying: false }));
    }
  };

  const allRequiredAgreed = REQUIRED_KEYS.every(k => termsAgreement[k]);

  const calculateProgress = useCallback(() => {
    let progress = 0;
    if (formState.isBusinessNumberVerified) progress += 20;
    if (password && password.length >= 8 && !errors.password) progress += 15;
    if (confirmPassword && confirmPassword === password && !errors.confirmPassword) progress += 15;
    if (company && !errors.company) progress += 15;
    if (name && !errors.name) progress += 10;
    if (phoneNumber && phoneNumber.length >= 12 && !errors.phoneNumber) progress += 15;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.email) progress += 10;
    return Math.min(progress, 100);
  }, [formState.isBusinessNumberVerified, password, confirmPassword, company, name, phoneNumber, email, errors]);

  const currentProgress = useMemo(() => calculateProgress(), [calculateProgress]);

  const isFormValid =
    allRequiredAgreed &&
    formState.isBusinessNumberVerified &&
    company && name &&
    phoneNumber && phoneNumber.length >= 12 &&
    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password && password.length >= 8 &&
    confirmPassword && password === confirmPassword &&
    !errors.businessNumber && !errors.company && !errors.name &&
    !errors.phoneNumber && !errors.email && !errors.password && !errors.confirmPassword;

  const onSubmit = async (data: BusinessSignupFormData) => {
    if (!allRequiredAgreed) {
      toast.error('필수 약관에 모두 동의해주세요.');
      return;
    }
    const companySignupData = {
      company_number: data.businessNumber.replace(/[^0-9]/g, ''),
      company_name: data.company,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phoneNumber.replace(/[^0-9]/g, ''),
      phone_type: formState.phoneType,
    };
    try {
      await authApi.companySignup(companySignupData);
      toast.success('기업 회원가입이 완료되었습니다. 로그인 해주세요.');
      router.push('/company-login?signup=success');
    } catch (error: unknown) {
      logError(error, 'BusinessSignupComponent.onSubmit');
      const rawMessage = extractErrorMessage(error, '');
      const status = getErrorStatus(error);
      if (status === 400 && rawMessage.toLowerCase().includes('already exists')) {
        setError('email', { type: 'manual', message: '이미 사용 중인 이메일입니다.' });
        toast.error('이미 사용 중인 이메일입니다.');
      } else {
        toast.error(rawMessage || '회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="w-full flex">
      {/* 약관 동의 섹션 */}
      <div className="w-full bg-slate-50 p-8 border-r border-slate-200">
        <div className="max-w-[500px] mx-auto space-y-6">
          <h2 className="text-xl text-slate-900 mb-6">약관 동의</h2>

          {/* 모두 동의 */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-600">
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
          </div>

          {/* 개별 약관 */}
          <div className="space-y-3">
            {TERMS.map(({ key, label, required }) => (
              <div key={key} className="bg-white rounded-lg p-4 border border-slate-200">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAgreement[key]}
                    onChange={(e) => handleTermChange(key, e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        <span className={required ? 'text-blue-600' : 'text-slate-400'}>
                          [{required ? '필수' : '선택'}]
                        </span>{' '}
                        {label}
                      </span>
                      <button
                        type="button"
                        className="text-[11px] text-slate-500 hover:text-blue-600 underline cursor-pointer"
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
              </div>
            ))}
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
            <h1 className="text-[28px] text-slate-900 mb-2">기업 회원가입</h1>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-500 text-xs">입력 진행도</span>
              <span className="text-blue-600">{currentProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <motion.div
                className="bg-blue-600 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 사업자등록번호 */}
            <div>
              <FormField
                name="businessNumber"
                control={control}
                label="사업자등록번호 (ID)"
                error={errors.businessNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        {...field}
                        id={fieldId}
                        type="text"
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="-제외 10자리 입력"
                        maxLength={12}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(formatBusinessNumber(value));
                          setFormState(prev => ({
                            ...prev,
                            isBusinessNumberVerified: false,
                            businessNumberMessage: '',
                          }));
                          clearErrors('businessNumber');
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={() => field.value && handleBusinessNumberCheck(field.value)}
                        disabled={!field.value || !isValidBusinessNumber(field.value) || formState.isVerifying || formState.isBusinessNumberVerified}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                          formState.isVerifying
                            ? 'bg-blue-500 text-white cursor-not-allowed'
                            : field.value && isValidBusinessNumber(field.value)
                              ? formState.isBusinessNumberVerified
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                        whileTap={field.value && isValidBusinessNumber(field.value) && !formState.isBusinessNumberVerified && !formState.isVerifying ? { scale: 0.95 } : {}}
                      >
                        {formState.isVerifying ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            인증 중
                          </>
                        ) : formState.isBusinessNumberVerified ? '인증완료' : '인증하기'}
                      </motion.button>
                    </div>
                    {formState.isBusinessNumberVerified && (
                      <p className="text-[11px] text-blue-600">{formState.businessNumberMessage}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              {/* 기업명 */}
              <FormField
                name="company"
                control={control}
                label="기업명"
                render={(field, fieldId) => (
                  <Input {...field} id={fieldId} placeholder="기업명 입력" error={!!errors.company} />
                )}
              />

              {/* 담당자명 */}
              <FormField
                name="name"
                control={control}
                label="담당자명"
                render={(field, fieldId) => (
                  <Input {...field} id={fieldId} placeholder="담당자명 입력" error={!!errors.name} />
                )}
              />

              {/* 전화번호 */}
              <FormField
                name="phoneNumber"
                control={control}
                label="담당자 전화번호"
                error={errors.phoneNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="phoneType"
                          value="MOBILE"
                          checked={formState.phoneType === 'MOBILE'}
                          onChange={() => {
                            setFormState(prev => ({ ...prev, phoneType: 'MOBILE' }));
                            field.onChange('');
                            clearErrors('phoneNumber');
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">휴대전화</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="phoneType"
                          value="LANDLINE"
                          checked={formState.phoneType === 'LANDLINE'}
                          onChange={() => {
                            setFormState(prev => ({ ...prev, phoneType: 'LANDLINE' }));
                            field.onChange('');
                            clearErrors('phoneNumber');
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">일반전화</span>
                      </label>
                    </div>
                    <Input
                      {...field}
                      id={fieldId}
                      type="tel"
                      placeholder={getPhonePlaceholder(formState.phoneType)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(formatPhoneByType(value, formState.phoneType));
                      }}
                      onBlur={(e) => {
                        const phoneError = validatePhoneType(e.target.value, formState.phoneType);
                        if (phoneError) {
                          setError('phoneNumber', { type: 'manual', message: phoneError });
                        } else {
                          clearErrors('phoneNumber');
                        }
                      }}
                      maxLength={13}
                      error={!!errors.phoneNumber}
                    />
                    {!errors.phoneNumber && field.value && (
                      <p className="text-[11px] text-slate-500">
                        {formState.phoneType === 'MOBILE'
                          ? '휴대전화: 010, 011, 016-019로 시작'
                          : '일반전화: 지역번호(예: 02, 031, 051) 포함'}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* 이메일 */}
              <FormField
                name="email"
                control={control}
                label="담당자 이메일"
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <Input
                      {...field}
                      id={fieldId}
                      type="email"
                      placeholder="이메일 입력"
                      onBlur={(e) => {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                          setError('email', { type: 'manual', message: '이메일 형식이 올바르지 않습니다.' });
                        } else {
                          clearErrors('email');
                        }
                      }}
                      error={!!errors.email}
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="text-blue-500">ℹ</span>
                      이 이메일은 추후 <span className="font-semibold text-slate-700">로그인 아이디</span>로 사용됩니다.
                    </p>
                  </div>
                )}
              />
            </div>

            {/* 비밀번호 */}
            <FormField
              name="password"
              control={control}
              label="비밀번호"
              error={errors.password?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  variant="password"
                  placeholder="8~15자리/영문, 숫자, 특수문자 조합 입력"
                  error={!!errors.password}
                  showPassword={formState.showPassword}
                  onTogglePassword={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  onBlur={(e) => {
                    const err = validatePassword(e.target.value);
                    if (err) setError('password', { type: 'manual', message: err });
                    else clearErrors('password');
                  }}
                  maxLength={15}
                />
              )}
            />

            {/* 비밀번호 확인 */}
            <FormField
              name="confirmPassword"
              control={control}
              error={errors.confirmPassword?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  variant="password"
                  placeholder="8~15자리/영문, 숫자, 특수문자 조합 재입력"
                  error={!!errors.confirmPassword}
                  showPassword={formState.showConfirmPassword}
                  onTogglePassword={() => setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                  onBlur={(e) => {
                    const err = validateConfirmPassword(password, e.target.value);
                    if (err) setError('confirmPassword', { type: 'manual', message: err });
                    else clearErrors('confirmPassword');
                  }}
                  maxLength={15}
                />
              )}
            />

            <div className="space-y-3 mt-6">
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                기업 회원가입
              </motion.button>
              {!allRequiredAgreed && (
                <p className="text-[11px] text-red-500 text-center">필수 약관에 모두 동의해주세요</p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
