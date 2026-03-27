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
import { Building2, CheckCircle2, Users, FileText, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

type LoginErrorType = 'credential' | 'account' | 'permission' | 'rateLimit' | 'server' | 'network';

interface LoginErrorInfo {
  type: LoginErrorType;
  field: 'email' | 'password' | null;
  message: string;
}

const ICON_MAP = [FileText, Users, CheckCircle2];

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
  const t = useTranslations('auth.companyLogin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginErrorInfo | null>(null);

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

  const STATUS_ERRORS: Record<number, LoginErrorInfo> = {
    401: { type: 'credential', field: 'password', message: t('errorCredential401') },
    403: { type: 'permission', field: 'email',    message: t('errorPermission403') },
    404: { type: 'account',    field: 'email',    message: t('errorAccount404') },
    429: { type: 'rateLimit',  field: null,       message: t('errorRateLimit429') },
  };

  const FEATURES = [
    { icon: ICON_MAP[0], text: t('feature1') },
    { icon: ICON_MAP[1], text: t('feature2') },
    { icon: ICON_MAP[2], text: t('feature3') },
  ];

  const handleEmailBlur = (val: string) => {
    if (val && !isValidEmail(val)) {
      setError('email', { type: 'manual', message: t('errorEmailFormat') });
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
      if (!email)    setError('email',    { type: 'manual', message: t('errorEmailEmpty') });
      if (!password) setError('password', { type: 'manual', message: t('errorPasswordEmpty') });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setLoginError(null);
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

      let errorInfo: LoginErrorInfo = {
        type: 'server',
        field: null,
        message: t('errorServer'),
      };

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
          errorInfo = STATUS_ERRORS[status];
        } else if (status === 400) {
          const msg = serverError.toLowerCase();
          if (msg.includes('email')) {
            errorInfo = { type: 'credential', field: 'email', message: t('errorEmailFormat') };
          } else if (msg.includes('password')) {
            errorInfo = { type: 'credential', field: 'password', message: t('errorPasswordFormat') };
          } else {
            errorInfo = { type: 'credential', field: null, message: serverError || t('errorCredential400') };
          }
        } else if (status >= 500) {
          errorInfo = { type: 'server', field: null, message: t('errorServerInternal') };
        } else if (serverError) {
          errorInfo = { type: 'server', field: null, message: serverError };
        }
      } else if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network') || msg.includes('fetch')) {
          errorInfo = { type: 'network', field: null, message: t('errorNetwork') };
        } else if (msg.includes('timeout')) {
          errorInfo = { type: 'network', field: null, message: t('errorTimeout') };
        }
      }

      setLoginError(errorInfo);
      // 특정 필드에도 포커스 표시
      if (errorInfo.field) {
        setError(errorInfo.field, { type: 'manual', message: '' });
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── 좌측 그라데이션 패널 ──────────────────────────────────── */}
      <motion.div
        className="hidden lg:flex flex-1 bg-linear-to-br from-blue-400 to-blue-600 flex-col justify-center p-16 relative overflow-hidden"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/7 pointer-events-none" />

        {/* 로고 */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-white font-['Plus_Jakarta_Sans'] text-title-4 font-extrabold tracking-[-0.5px]">
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
          <motion.p variants={fadeUp} className="text-blue-200 text-caption-1 font-semibold uppercase tracking-[1.5px]">
            {t('partnerBadge')}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-white text-title-1 font-extrabold leading-tight">
            {t('heading').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-blue-200 text-body-2 leading-relaxed">
            {t('description')}
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
              <div className="w-8 h-8 rounded-lg bg-white/12 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white" />
              </div>
              <span className="text-blue-100 text-caption-1 font-medium">{text}</span>
            </motion.li>
          ))}
        </motion.ul>

      </motion.div>

      {/* ── 우측 폼 패널 ─────────────────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 bg-white"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-full max-w-[400px] mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-1 mb-8"
          >
            <motion.p variants={fadeUp} className="text-caption-2 font-bold text-primary-600 uppercase tracking-[1.5px]">
              {t('overline')}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-title-2 font-extrabold text-label-900">
              {t('title')}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-caption-1 text-label-500">
              {t('subtitle')}
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
                label={t('emailLabel')}
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    type="email"
                    placeholder="example@company.com"
                    onChange={(e) => { field.onChange(e.target.value); clearErrors('email'); setLoginError(null); }}
                    onBlur={(e) => handleEmailBlur(e.target.value)}
                    error={!!errors.email || loginError?.field === 'email'}
                  />
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <FormField
                name="password"
                control={control}
                label={t('passwordLabel')}
                error={errors.password?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    variant="password"
                    placeholder="••••••••••"
                    error={!!errors.password || loginError?.field === 'password'}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(prev => !prev)}
                    onChange={(e) => { field.onChange(e.target.value); clearErrors('password'); setLoginError(null); }}
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
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-line-400 rounded cursor-pointer"
                      name={field.name}
                      ref={field.ref}
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                    <label htmlFor={fieldId} className="ml-2 block text-caption-1 text-label-700 cursor-pointer">
                      {t('rememberEmail')}
                    </label>
                  </div>
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3 pt-1">
              <motion.button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-body-3 transition-colors flex items-center justify-center gap-2 ${
                  isLoading || !isFormValid
                    ? 'bg-label-100 cursor-not-allowed text-label-400'
                    : 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
                }`}
                whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading && <Loader2 size={15} className="animate-spin" />}
                {isLoading ? t('loggingIn') : t('loginButton')}
              </motion.button>

              {/* 로그인 에러 배너 */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-caption-1 font-medium ${
                    loginError.type === 'network'
                      ? 'bg-label-50 border border-line-400 text-label-600'
                      : loginError.type === 'server'
                        ? 'bg-status-caution-bg border border-amber-200 text-amber-700'
                        : loginError.type === 'rateLimit'
                          ? 'bg-status-caution-bg border border-amber-200 text-amber-700'
                          : 'bg-status-error-bg border border-status-error-bg text-status-error'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {loginError.type === 'network'
                    ? <WifiOff size={15} className="mt-0.5 shrink-0" />
                    : <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  }
                  <span>{loginError.message}</span>
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={() => router.push('/company-signup/step1')}
                className="w-full py-3 px-4 border border-line-400 text-primary-600 rounded-lg font-semibold text-body-3 hover:bg-primary-50 transition-colors cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                {t('signupButton')}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* 개인 회원 로그인 링크 */}
          <motion.p
            className="mt-8 text-center text-caption-1 text-label-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t('personalPrompt')}{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary-600 font-semibold hover:underline cursor-pointer"
            >
              {t('personalLogin')}
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
