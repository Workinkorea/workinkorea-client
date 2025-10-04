'use client'

import { motion } from 'framer-motion';
import { FormField } from '../ui/FormField';
import Input from '../ui/Input';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { validatePassword } from '@/lib/utils/authNumber';
import { useState } from 'react';
import { GoogleIcon } from '@/components/ui/AccessibleIcon';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: 'onChange',
  });

  const [formState, setFormState] = useState({
    showPassword: false,
    isLoading: false,
    isGoogleLoading: false,
  });

  const password = watch('password');

  const handlePasswordBlur = (password: string) => {
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError('password', {
          type: 'manual',
          message: passwordError
        });
      } else {
        clearErrors('password');
      }
    } else {
      clearErrors('password');
    }
  };

  const isFormValid =
    password &&
    password.length >= 8 &&
    !errors.businessNumber &&
    !errors.password;

  const handleGoogleLogin = async () => {
    try {
      setFormState(prev => ({ ...prev, isGoogleLoading: true }));

      const response = await fetch(`${API_BASE_URL}/api/auth/login/google`);

      if (!response.ok) {
        throw new Error('Failed to get Google login URL');
      }

      const data = await response.json();
      const googleAuthUrl = data.url || data.authUrl || data;

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        googleAuthUrl,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { accessToken } = event.data;
          login(accessToken);
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setFormState(prev => ({ ...prev, isGoogleLoading: false }));
          router.push('/');
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.error('Google login failed:', event.data.error);
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setFormState(prev => ({ ...prev, isGoogleLoading: false }));
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Google login error:', error);
      setFormState(prev => ({ ...prev, isGoogleLoading: false }));
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
          <h1 className="text-title-2 text-label-900 mb-8">
            개인 로그인
          </h1>
        </motion.div>

        <motion.form 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <FormField
              name="email"
              control={control}
              label="이메일"
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  type="text"
                  maxLength={50}
                />
              )}
            />
          </div>

          <div>
            <FormField
              name="password"
              control={control}
              label="비밀번호"
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  variant="password"
                  placeholder="••••••••••"
                  error={!!errors.password}
                  showPassword={formState.showPassword}
                  onTogglePassword={() => setFormState(prev => ({ 
                    ...prev, 
                    showPassword: !prev.showPassword 
                  }))}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors('password');
                  }}
                  onBlur={(e) => handlePasswordBlur(e.target.value)}
                  maxLength={15}
                />
              )}
            />
          </div>

          <div>
            <FormField
              name="rememberMe"
              control={control}
              render={(field, fieldId) => (
                <div className="flex items-center">
                  <input
                    id={fieldId}
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 focus:ring-primary border-line-200 rounded cursor-pointer"
                    name={field.name}
                    ref={field.ref}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                  />
                  <label htmlFor={fieldId} className="ml-2 block text-sm text-gray-900">
                    로그인정보 저장
                  </label>
                </div>
              )}
            />
          </div>

          <motion.div className="space-y-3">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={formState.isGoogleLoading}
              className="w-full py-2 border border-line-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
              aria-label="Google 계정으로 로그인"
            >
              <GoogleIcon label="Google 로고" size="md" />

              <span className="text-gray-600 font-medium ml-2">
                {formState.isGoogleLoading ? '로그인 중...' : 'Google로 로그인'}
              </span>
            </motion.button>

            <motion.button
              type="submit"
              disabled={formState.isLoading || !isFormValid}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                formState.isLoading || !isFormValid
                  ? 'bg-gray-300 cursor-not-allowed text-white'
                  : 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
              }`}
              whileTap={isFormValid && !formState.isLoading ? { scale: 0.98 } : {}}
            >
              {formState.isLoading ? '로그인 중...' : '로그인'}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push('/signup/step1')}
              className="w-full py-3 px-4 border border-line-200 text-primary-300 rounded-lg font-medium text-sm hover:bg-primary-300 hover:text-white transition-colors cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              회원가입
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};
