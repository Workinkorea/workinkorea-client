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

  const email = watch('email');
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
      if (!email) setError('email', { type: 'manual', message: '이메일을 입력해주세요.' });
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
          errorField = STATUS_ERRORS[status].field;
          errorMessage = STATUS_ERRORS[status].message;
        } else if (status === 400) {
          const msg = serverError.toLowerCase();
          if (msg.includes('email')) {
            errorField = 'email';
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
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[400px] w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-title-2 text-slate-900 mb-8">기업 로그인</h1>
        </motion.div>

        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
                <label htmlFor={fieldId} className="ml-2 block text-sm text-slate-900">
                  이메일 저장
                </label>
              </div>
            )}
          />

          <div className="space-y-3">
            <motion.button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                isLoading || !isFormValid
                  ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
              whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? '기업 로그인 중...' : '기업 로그인'}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push('/company-signup/step1')}
              className="w-full py-3 px-4 border border-slate-200 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              회원가입
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
