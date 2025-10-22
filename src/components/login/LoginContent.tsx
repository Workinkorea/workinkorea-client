'use client'

import { motion } from 'framer-motion';
import { FormField } from '../ui/FormField';
import Input from '../ui/Input';
import { useForm } from 'react-hook-form';
import { validatePassword } from '@/lib/utils/authNumber';
import { useState } from 'react';
import { GoogleIcon } from '@/components/ui/AccessibleIcon';
import { useAuth } from '@/hooks/useAuth';

export default function LoginContent() {
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

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/login/google';
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
                {formState.isGoogleLoading ? '로그인 중...' : 'Google로 시작하기'}
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
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};
