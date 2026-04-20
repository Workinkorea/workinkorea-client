'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { tokenStore } from '@/shared/api/tokenStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';

interface AdminLoginFormData {
  email: string;
  password: string;
}

type LoginErrorType = 'credential' | 'account' | 'permission' | 'rateLimit' | 'server' | 'network';

interface LoginErrorInfo {
  type: LoginErrorType;
  field: 'email' | 'password' | null;
  message: string;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginErrorInfo | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<AdminLoginFormData>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isFormValid = email && password && isValidEmail(email) && password.length >= 8 && !errors.email && !errors.password;

  const handleEmailBlur = (val: string) => {
    if (val && !isValidEmail(val)) {
      setError('email', { type: 'manual', message: '올바른 이메일 형식이 아닙니다.' });
    } else {
      clearErrors('email');
    }
  };

  const handlePasswordBlur = (val: string) => {
    if (val && val.length < 8) {
      setError('password', { type: 'manual', message: '비밀번호는 8자 이상이어야 합니다.' });
    } else {
      clearErrors('password');
    }
  };

  const onSubmit = async (data: AdminLoginFormData) => {
    if (!isFormValid) {
      if (!email) setError('email', { type: 'manual', message: '이메일을 입력해주세요.' });
      if (!password) setError('password', { type: 'manual', message: '비밀번호를 입력해주세요.' });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setLoginError(null);
    clearErrors();

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json().catch(() => ({})) as Record<string, unknown>;

      if (!response.ok) {
        const errorMessage = (responseData.detail as string) ||
          (responseData.error as string) ||
          (responseData.message as string) ||
          '로그인에 실패했습니다.';

        let errorInfo: LoginErrorInfo = {
          type: 'server',
          field: null,
          message: errorMessage,
        };

        if (response.status === 401) {
          errorInfo = { type: 'credential', field: 'password', message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
        } else if (response.status === 403) {
          errorInfo = { type: 'permission', field: 'email', message: '관리자 권한이 없습니다.' };
        } else if (response.status === 404) {
          errorInfo = { type: 'account', field: 'email', message: '존재하지 않는 계정입니다.' };
        } else if (response.status === 429) {
          errorInfo = { type: 'rateLimit', field: null, message: '로그인 시도 횟수가 많습니다. 잠시 후 다시 시도해주세요.' };
        }

        setLoginError(errorInfo);
        if (errorInfo.field) {
          setError(errorInfo.field, { type: 'manual', message: '' });
        }
        return;
      }

      // Token from response body
      const token = responseData.access_token as string | undefined;
      if (token) {
        tokenStore.set(token);
      }

      login('admin');

      const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
      router.replace(callbackUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.';
      const isNetworkError = message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch');

      setLoginError({
        type: isNetworkError ? 'network' : 'server',
        field: null,
        message: isNetworkError ? '네트워크 연결을 확인해주세요.' : message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <motion.div
            className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-white">
              <p className="text-caption-2 font-bold uppercase tracking-[1.5px] text-blue-100 mb-2">
                관리자 전용
              </p>
              <h1 className="text-title-2 font-extrabold">로그인</h1>
              <p className="text-body-2 text-blue-100 mt-3">
                WorkInKorea 관리자 계정으로 로그인하세요
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="px-8 py-8"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={fadeUp}>
                <FormField
                  name="email"
                  control={control}
                  label="이메일"
                  error={errors.email?.message}
                  render={(field, fieldId) => (
                    <Input
                      {...field}
                      id={fieldId}
                      type="email"
                      placeholder="admin@example.com"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        clearErrors('email');
                        setLoginError(null);
                      }}
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
                  label="비밀번호"
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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        clearErrors('password');
                        setLoginError(null);
                      }}
                      onBlur={(e) => handlePasswordBlur(e.target.value)}
                      maxLength={15}
                    />
                  )}
                />
              </motion.div>

              {/* Error Message */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-caption-1 font-medium ${
                    loginError.type === 'network'
                      ? 'bg-slate-50 border border-slate-200 text-slate-600'
                      : loginError.type === 'server'
                        ? 'bg-amber-50 border border-amber-200 text-amber-700'
                        : loginError.type === 'rateLimit'
                          ? 'bg-amber-50 border border-amber-200 text-amber-700'
                          : 'bg-red-50 border border-red-200 text-red-700'
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
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-body-2 transition-colors flex items-center justify-center gap-2 ${
                  isLoading || !isFormValid
                    ? 'bg-slate-100 cursor-not-allowed text-slate-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-[0_4px_14px_rgba(66,90,213,0.25)]'
                }`}
                whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading && <Loader2 size={15} className="animate-spin" />}
                {isLoading ? '로그인 중...' : '로그인'}
              </motion.button>
            </form>

            {/* Footer Link */}
            <motion.p
              className="mt-6 text-center text-caption-1 text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              관리자 계정이 없으신가요?{' '}
              <a
                href="mailto:support@workinkorea.com"
                className="text-blue-600 font-semibold hover:underline"
              >
                고객지원
              </a>
            </motion.p>
          </motion.div>
        </div>

        {/* Help Text */}
        <motion.p
          className="text-center text-caption-2 text-slate-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          WorkInKorea © 2024 All rights reserved
        </motion.p>
      </motion.div>
    </div>
  );
}
