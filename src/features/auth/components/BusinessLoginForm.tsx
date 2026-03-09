'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { useRouter } from 'next/navigation';
import { validatePassword } from '@/shared/lib/utils/validation';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { FetchError } from '@/shared/api/fetchClient';
import { Building2, CheckCircle2, Users, FileText, Loader2 } from 'lucide-react';

interface BusinessLoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SAVED_EMAIL_KEY = 'savedBusinessEmail';

const getDefaultValues = (): BusinessLoginFormData => {
  if (typeof window === 'undefined') {
    return { email: '', password: '', rememberMe: false };
  }
  try {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    return { email: savedEmail || '', password: '', rememberMe: !!savedEmail };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('localStorage access failed:', error);
    }
    return { email: '', password: '', rememberMe: false };
  }
};

const STATUS_ERRORS: Record<number, { field: 'email' | 'password'; message: string }> = {
  401: { field: 'password', message: '비밀번호가 일치하지 않습니다.' },
  403: { field: 'email', message: '기업 계정이 비활성화되었거나 접근 권한이 없습니다.' },
  404: { field: 'email', message: '등록되지 않은 기업 계정입니다.' },
  429: { field: 'password', message: '로그인 시도 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.' },
};

const FEATURES = [
  { icon: FileText,  text: '채용 공고를 손쉽게 등록하고 관리하세요' },
  { icon: Users,     text: '외국인 인재 지원자를 한눈에 확인하세요' },
  { icon: CheckCircle2, text: '전문 HR 솔루션으로 채용 효율을 높이세요' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BusinessLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<BusinessLoginFormData>({
    mode: 'onChange',
    defaultValues: getDefaultValues(),
  });

  const email    = watch('email');
  const password = watch('password');

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleEmailBlur = (val: string) => {
    if (val && !isValidEmail(val)) {
      setError('email', { type: 'manual', message: '올바른 이메일 형식을 입력해주세요.' });
    } else {
      clearErrors('email');
    }
  };

  const handlePasswordBlur = (val: string) => {
    if (val) {
      const err = validatePassword(val);
      if (err) setError('password', { type: 'manual', message: err });
      else clearErrors('password');
    } else {
      clearErrors('password');
    }
  };

  const isFormValid =
    email && password && isValidEmail(email) && password.length >= 8 && !errors.email && !errors.password;

  const onSubmit = async (data: BusinessLoginFormData) => {
    if (!isFormValid) {
      if (!email)    setError('email',    { type: 'manual', message: '이메일을 입력해주세요.' });
      if (!password) setError('password', { type: 'manual', message: '비밀번호를 입력해주세요.' });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    clearErrors();

    try {
      const responseUrl = await authApi.companyLogin({
        username: data.email,
        password: data.password,
      });

      if (responseUrl && typeof responseUrl === 'string') {
        login('company');
        if (data.rememberMe) {
          localStorage.setItem(SAVED_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(SAVED_EMAIL_KEY);
        }
        window.location.href = responseUrl;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Company login error:', error);
      }

      let errorMessage = '로그인 중 오류가 발생했습니다.';
      let errorField: 'email' | 'password' = 'password';

      if (error instanceof FetchError) {
        const { status, data } = error;
        const serverError =
          data && typeof data === 'object'
            ? ((data as Record<string, unknown>).detail as string) ||
              ((data as Record<string, unknown>).error as string) ||
              ((data as Record<string, unknown>).message as string) ||
              ''
            : '';

        if (STATUS_ERRORS[status]) {
          errorField   = STATUS_ERRORS[status].field;
          errorMessage = STATUS_ERRORS[status].message;
        } else if (status === 400) {
          const msg = serverError.toLowerCase();
          if (msg.includes('email')) {
            errorField   = 'email';
            errorMessage = '올바른 이메일 형식을 입력해주세요.';
          } else if (msg.includes('password')) {
            errorMessage = '올바른 비밀번호를 입력해주세요.';
          } else {
            errorMessage = serverError || '입력 정보를 확인해주세요.';
          }
        } else if (status >= 500) {
          errorMessage = '서버에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (serverError) {
          errorMessage = serverError;
        }
      } else if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인해주세요.';
        } else if (msg.includes('timeout')) {
          errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        }
      }

      setError(errorField, { type: 'manual', message: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── 좌측 그라데이션 패널 ──────────────────────────────────── */}
      <motion.div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-900 flex-col justify-center p-16 relative overflow-hidden"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/[0.05] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/[0.07] pointer-events-none" />

        {/* 로고 */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/[0.15] flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-white font-['Plus_Jakarta_Sans'] text-xl font-extrabold tracking-[-0.5px]">
            WorkInKorea
          </span>
        </div>

        {/* 헤드카피 */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-12"
        >
          <motion.p variants={fadeUp} className="text-blue-200 text-[13px] font-semibold uppercase tracking-[1.5px]">
            기업 채용 파트너
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-white text-[34px] font-extrabold leading-tight">
            외국인 인재 채용,<br />
            더 쉽고 빠르게
          </motion.h2>
          <motion.p variants={fadeUp} className="text-blue-200 text-[15px] leading-relaxed">
            WorkInKorea와 함께 우수한 외국인 인재를<br />
            효율적으로 채용하세요.
          </motion.p>
        </motion.div>

        {/* 피처 리스트 */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {FEATURES.map(({ icon: Icon, text }) => (
            <motion.li key={text} variants={fadeUp} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.12] flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white" />
              </div>
              <span className="text-blue-100 text-[13px] font-medium">{text}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* 글래스모피즘 배지 */}
        <motion.div
          className="mt-14 inline-flex items-center gap-2 bg-white/[0.12] backdrop-blur-[10px] border border-white/[0.15] rounded-full px-4 py-2 self-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-blue-100 text-[12px] font-medium">현재 3,200+ 기업이 이용 중</span>
        </motion.div>
      </motion.div>

      {/* ── 우측 폼 패널 ─────────────────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 bg-white"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* 모바일 로고 */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="text-slate-900 font-['Plus_Jakarta_Sans'] text-lg font-extrabold tracking-[-0.5px]">
            WorkInKorea
          </span>
        </div>

        <div className="w-full max-w-[400px] mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-1 mb-8"
          >
            <motion.p variants={fadeUp} className="text-[12px] font-bold text-blue-600 uppercase tracking-[1.5px]">
              기업 전용
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-[26px] font-extrabold text-slate-900">
              기업 로그인
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[13px] text-slate-500">
              등록된 기업 계정으로 로그인하세요
            </motion.p>
          </motion.div>

          <motion.form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <FormField
                name="email"
                control={control}
                label="이메일 (기업 ID)"
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    type="email"
                    placeholder="example@company.com"
                    onChange={(e) => { field.onChange(e.target.value); clearErrors('email'); }}
                    onBlur={(e) => handleEmailBlur(e.target.value)}
                    error={!!errors.email}
                  />
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
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
                    placeholder="••••••••••"
                    error={!!errors.password}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(prev => !prev)}
                    onChange={(e) => { field.onChange(e.target.value); clearErrors('password'); }}
                    onBlur={(e) => handlePasswordBlur(e.target.value)}
                    maxLength={15}
                  />
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <FormField
                name="rememberMe"
                control={control}
                render={(field, fieldId) => (
                  <div className="flex items-center">
                    <input
                      id={fieldId}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-200 rounded cursor-pointer"
                      name={field.name}
                      ref={field.ref}
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                    <label htmlFor={fieldId} className="ml-2 block text-[13px] text-slate-700 cursor-pointer">
                      이메일 저장
                    </label>
                  </div>
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3 pt-1">
              <motion.button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  isLoading || !isFormValid
                    ? 'bg-slate-100 cursor-not-allowed text-slate-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
                }`}
                whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading && <Loader2 size={15} className="animate-spin" />}
                {isLoading ? '로그인 중...' : '기업 로그인'}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push('/company-signup/step1')}
                className="w-full py-3 px-4 border border-slate-200 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                기업 회원가입
              </motion.button>
            </motion.div>
          </motion.form>

          {/* 개인 회원 로그인 링크 */}
          <motion.p
            className="mt-8 text-center text-[13px] text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            개인 회원이신가요?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              개인 로그인
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
