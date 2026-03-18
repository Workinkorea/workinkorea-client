'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import {
  formatBusinessNumber,
  isValidBusinessNumber,
  validateConfirmPassword,
  validatePassword,
} from '@/shared/lib/utils/validation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/authApi';
import {
  formatPhoneByType,
  validatePhoneType,
  getPhonePlaceholder,
  PhoneType,
} from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError, getErrorStatus } from '@/shared/lib/utils/errorHandler';
import TermsModal from '@/shared/ui/TermsModal';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  PRIVACY_POLICY_HOLD,
  COPYRIGHT_POLICY,
  COOKIE_POLICY,
} from '@/shared/constants/terms';
import { Step2Form } from '@/features/auth/types/signup.types';

type TermKey = 'termsOfService' | 'privacyPolicy' | 'personalInfo' | 'thirdParty' | 'marketing';

interface TermsState {
  allAgree: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
  personalInfo: boolean;
  thirdParty: boolean;
  marketing: boolean;
}

const TERMS: { key: TermKey; label: string; required: boolean }[] = [
  { key: 'termsOfService', label: '서비스 이용약관', required: true },
  { key: 'privacyPolicy', label: '개인(신용)정보 수집 및 이용', required: true },
  { key: 'personalInfo', label: '개인(신용)정보 제공 및 위탁', required: true },
  { key: 'thirdParty', label: '개인(신용)정보 조회', required: true },
  { key: 'marketing', label: '마케팅 활용 및 광고성 정보 수신', required: false },
];

const TERMS_CONTENT: Record<TermKey, { title: string; content: string }> = {
  termsOfService: { title: '서비스 이용약관', content: TERMS_OF_SERVICE },
  privacyPolicy: { title: '개인(신용)정보 수집 및 이용', content: PRIVACY_POLICY },
  personalInfo: { title: '개인(신용)정보 제공 및 위탁', content: PRIVACY_POLICY_HOLD },
  thirdParty: { title: '개인(신용)정보 조회', content: COPYRIGHT_POLICY },
  marketing: { title: '마케팅 활용 및 광고성 정보 수신', content: COOKIE_POLICY },
};

export default function BusinessSignupComponent() {
  const router = useRouter();

  const [terms, setTerms] = useState<TermsState>({
    allAgree: false,
    termsOfService: false,
    privacyPolicy: false,
    personalInfo: false,
    thirdParty: false,
    marketing: false,
  });

  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: '',
  });

  const openTermsModal = (key: TermKey) => {
    const { title, content } = TERMS_CONTENT[key];
    setModalState({ isOpen: true, title, content });
  };
  const closeModal = () => setModalState({ isOpen: false, title: '', content: '' });

  const handleAllAgree = (checked: boolean) => {
    setTerms({ allAgree: checked, termsOfService: checked, privacyPolicy: checked, personalInfo: checked, thirdParty: checked, marketing: checked });
  };

  const handleTermChange = (key: TermKey, checked: boolean) => {
    const next = { ...terms, [key]: checked };
    const all: TermKey[] = ['termsOfService', 'privacyPolicy', 'personalInfo', 'thirdParty', 'marketing'];
    next.allAgree = all.every((k) => next[k]);
    setTerms(next);
  };

  const requiredAgreed = terms.termsOfService && terms.privacyPolicy && terms.personalInfo && terms.thirdParty;

  const { control, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm<Step2Form>({
    mode: 'onChange',
    defaultValues: { businessNumber: '', password: '', confirmPassword: '', company: '', name: '', phoneNumber: '', email: '' },
  });

  const [formState, setFormState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isBusinessNumberVerified: false,
    isVerifying: false,
    businessNumberMessage: '',
    businessNumberVerifyToken: '',
    companyInfo: null as { company: string; owner: string } | null,
    phoneType: 'MOBILE' as PhoneType,
  });

  const businessNumber = watch('businessNumber');
  const name = watch('name');
  const phoneNumber = watch('phoneNumber');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const company = watch('company');

  const handlePasswordBlur = (val: string) => {
    if (!val) return;
    const err = validatePassword(val);
    if (err) setError('password', { type: 'manual', message: err });
    else clearErrors('password');
  };

  const handleConfirmPasswordBlur = (val: string) => {
    if (!val) return;
    const err = validateConfirmPassword(password, val);
    if (err) setError('confirmPassword', { type: 'manual', message: err });
    else clearErrors('confirmPassword');
  };

  const handleBusinessNumberCheck = async (bn: string) => {
    if (!isValidBusinessNumber(bn)) {
      setError('businessNumber', { type: 'manual', message: '사업자등록번호 10자리를 입력해주세요.' });
      return;
    }
    setFormState((prev) => ({ ...prev, isVerifying: true }));
    try {
      const response = await authApi.verifyBusinessNumber(bn);
      if (response.status_code === 'OK' && response.data?.length > 0) {
        const bizData = response.data[0];
        if (bizData.b_stt_cd !== '01') {
          setError('businessNumber', { type: 'manual', message: `해당 사업자는 ${bizData.b_stt} 상태입니다.` });
          toast.error(`사업자 상태: ${bizData.b_stt}`);
          return;
        }
        setFormState((prev) => ({
          ...prev,
          isBusinessNumberVerified: true,
          businessNumberMessage: '사업자등록번호 인증이 완료되었습니다.',
          businessNumberVerifyToken: `verified_${bn}_${Date.now()}`,
          companyInfo: { company: bizData.tax_type || '', owner: bizData.b_stt || '' },
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
      setFormState((prev) => ({ ...prev, isVerifying: false }));
    }
  };

  const calculateProgress = useCallback(() => {
    let p = 0;
    if (formState.isBusinessNumberVerified) p += 20;
    if (password && password.length >= 8 && !errors.password) p += 15;
    if (confirmPassword && confirmPassword === password && !errors.confirmPassword) p += 15;
    if (company && !errors.company) p += 15;
    if (name && !errors.name) p += 10;
    if (phoneNumber && phoneNumber.length >= 12 && !errors.phoneNumber) p += 15;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.email) p += 10;
    return Math.min(p, 100);
  }, [formState.isBusinessNumberVerified, password, confirmPassword, company, name, phoneNumber, email, errors]);

  const currentProgress = useMemo(() => calculateProgress(), [calculateProgress]);

  const isFormValid =
    requiredAgreed &&
    formState.isBusinessNumberVerified &&
    company && name &&
    phoneNumber && phoneNumber.length >= 12 &&
    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password && password.length >= 8 &&
    confirmPassword && password === confirmPassword &&
    !errors.businessNumber && !errors.password && !errors.confirmPassword &&
    !errors.company && !errors.name && !errors.phoneNumber && !errors.email;

  const onSubmit = async (data: Step2Form) => {
    if (!requiredAgreed) { toast.error('필수 약관에 모두 동의해주세요.'); return; }
    try {
      await authApi.companySignup({
        company_number: data.businessNumber.replace(/[^0-9]/g, ''),
        company_name: data.company,
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phoneNumber.replace(/[^0-9]/g, ''),
      });
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* Left: Terms */}
      <div className="w-full lg:w-1/2 lg:border-r lg:border-slate-200 px-4 sm:px-6 py-8 sm:py-12 lg:p-12">
        <div className="max-w-xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-body-2 font-bold text-slate-900 mb-4">약관 동의</h2>
          </motion.div>

          <motion.div
            className="bg-white border-2 border-blue-600 rounded-xl p-5 sm:p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={terms.allAgree}
                onChange={(e) => handleAllAgree(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
              />
              <span className="ml-3 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">전체 동의</span>
            </label>
          </motion.div>

          <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            {TERMS.map(({ key, label, required }, index) => (
              <motion.div
                key={key}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-blue-200 transition-colors"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <label className="flex items-start cursor-pointer group gap-3">
                  <input
                    type="checkbox"
                    checked={terms[key]}
                    onChange={(e) => handleTermChange(key, e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {required
                          ? <span className="text-blue-600 font-semibold">[필수] </span>
                          : <span className="text-slate-400 font-semibold">[선택] </span>
                        }
                        {label}
                      </span>
                      <button
                        type="button"
                        className="text-caption-3 text-slate-500 hover:text-blue-600 underline cursor-pointer whitespace-nowrap shrink-0"
                        onClick={(e) => { e.preventDefault(); openTermsModal(key); }}
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

      <TermsModal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.title} content={modalState.content} />

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 lg:p-12 bg-white">
        <div className="max-w-xl mx-auto w-full space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-title-3 sm:text-title-2 font-bold text-slate-900 mb-2">기업 회원가입</h1>
            <p className="text-sm text-slate-500">기업 정보를 입력해 주세요</p>
          </motion.div>

          {/* Progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">입력 진행도</span>
              <span className="text-blue-600 font-semibold">{currentProgress}%</span>
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
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 사업자 정보 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
              <h3 className="text-body-2 font-bold text-slate-900">사업자 정보</h3>
              <FormField
                name="businessNumber" control={control} label="사업자등록번호 (ID)" error={errors.businessNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        {...field} id={fieldId} type="text"
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors"
                        placeholder="-제외 10자리 입력" maxLength={12}
                        onChange={(e) => {
                          const formatted = formatBusinessNumber(e.target.value.replace(/[^0-9]/g, ''));
                          field.onChange(formatted);
                          setFormState((prev) => ({ ...prev, isBusinessNumberVerified: false, businessNumberMessage: '', companyInfo: null }));
                          clearErrors('businessNumber');
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={() => field.value && handleBusinessNumberCheck(field.value)}
                        disabled={!field.value || !isValidBusinessNumber(field.value) || formState.isVerifying || formState.isBusinessNumberVerified}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                          formState.isVerifying ? 'bg-blue-500 text-white cursor-not-allowed'
                          : field.value && isValidBusinessNumber(field.value)
                            ? formState.isBusinessNumberVerified ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                        whileTap={field.value && isValidBusinessNumber(field.value) && !formState.isBusinessNumberVerified && !formState.isVerifying ? { scale: 0.95 } : {}}
                      >
                        {formState.isVerifying ? <><Loader2 size={14} className="animate-spin" />인증 중</> : formState.isBusinessNumberVerified ? '인증완료' : '인증하기'}
                      </motion.button>
                    </div>
                    {formState.isBusinessNumberVerified && formState.businessNumberMessage && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-caption-3 text-blue-600">
                        {formState.businessNumberMessage}
                      </motion.p>
                    )}
                  </div>
                )}
              />
              <FormField name="company" control={control} label="기업명"
                render={(field, fieldId) => <Input {...field} id={fieldId} placeholder="기업명 입력" error={!!errors.company} />}
              />
            </div>

            {/* 담당자 정보 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
              <h3 className="text-body-2 font-bold text-slate-900">담당자 정보</h3>
              <FormField name="name" control={control} label="담당자명"
                render={(field, fieldId) => <Input {...field} id={fieldId} placeholder="담당자명 입력" error={!!errors.name} />}
              />
              <FormField name="phoneNumber" control={control} label="담당자 전화번호" error={errors.phoneNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      {(['MOBILE', 'LANDLINE'] as PhoneType[]).map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio" name="phoneType" value={type}
                            checked={formState.phoneType === type}
                            onChange={() => { setFormState((prev) => ({ ...prev, phoneType: type })); field.onChange(''); clearErrors('phoneNumber'); }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-caption-1 text-slate-700">{type === 'MOBILE' ? '휴대전화' : '일반전화'}</span>
                        </label>
                      ))}
                    </div>
                    <Input
                      {...field} id={fieldId} type="tel"
                      placeholder={getPhonePlaceholder(formState.phoneType)}
                      onChange={(e) => field.onChange(formatPhoneByType(e.target.value.replace(/[^0-9]/g, ''), formState.phoneType))}
                      onBlur={(e) => {
                        const err = validatePhoneType(e.target.value, formState.phoneType);
                        if (err) setError('phoneNumber', { type: 'manual', message: err });
                        else clearErrors('phoneNumber');
                      }}
                      maxLength={13} error={!!errors.phoneNumber}
                    />
                  </div>
                )}
              />
              <FormField name="email" control={control} label="담당자 이메일" error={errors.email?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <Input
                      {...field} id={fieldId} type="email" placeholder="이메일 입력"
                      onBlur={(e) => {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) setError('email', { type: 'manual', message: '이메일 형식이 올바르지 않습니다.' });
                        else clearErrors('email');
                      }}
                      error={!!errors.email}
                    />
                    <p className="text-caption-2 text-slate-500 flex items-center gap-1">
                      <span className="text-blue-500">ℹ</span>
                      이 이메일은 추후 <span className="font-semibold text-slate-700">로그인 아이디</span>로 사용됩니다.
                    </p>
                  </div>
                )}
              />
            </div>

            {/* 비밀번호 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
              <h3 className="text-body-2 font-bold text-slate-900">비밀번호 설정</h3>
              <FormField name="password" control={control} label="비밀번호" error={errors.password?.message}
                render={(field, fieldId) => (
                  <Input {...field} id={fieldId} variant="password" placeholder="8~15자리/영문, 숫자, 특수문자 조합"
                    error={!!errors.password} showPassword={formState.showPassword}
                    onTogglePassword={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
                    onBlur={(e) => handlePasswordBlur(e.target.value)} maxLength={15}
                  />
                )}
              />
              <FormField name="confirmPassword" control={control} label="비밀번호 확인" error={errors.confirmPassword?.message}
                render={(field, fieldId) => (
                  <Input {...field} id={fieldId} variant="password" placeholder="비밀번호 재입력"
                    error={!!errors.confirmPassword} showPassword={formState.showConfirmPassword}
                    onTogglePassword={() => setFormState((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                    onBlur={(e) => handleConfirmPasswordBlur(e.target.value)} maxLength={15}
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <motion.button
                type="submit" disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors ${isFormValid ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                가입하기
              </motion.button>
              {!requiredAgreed && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-caption-3 text-red-500 text-center">
                  필수 약관에 모두 동의해주세요
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
