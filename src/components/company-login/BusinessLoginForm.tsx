'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { formatBusinessNumber, isValidBusinessNumber, removeBusinessNumberHyphen, validatePassword } from '@/lib/utils/authNumber';

interface BusinessLoginFormData {
  businessNumber: string;
  password: string;
  rememberMe: boolean;
}

const SAVED_BUSINESS_NUMBER_KEY = 'savedBusinessNumber';

const getDefaultValues = (): BusinessLoginFormData => {
  if (typeof window === 'undefined') {
    return {
      businessNumber: '',
      password: '',
      rememberMe: false,
    };
  }

  try {
    const savedBusinessNumber = localStorage.getItem(SAVED_BUSINESS_NUMBER_KEY);
    
    return {
      businessNumber: savedBusinessNumber ? formatBusinessNumber(savedBusinessNumber) : '',
      password: '',
      rememberMe: !!savedBusinessNumber,
    };
  } catch (error) {
    // localStorage 접근 실패 시 기본값 반환
    if (process.env.NODE_ENV === 'development') {
      console.warn('localStorage access failed:', error);
    }
    return {
      businessNumber: '',
      password: '',
      rememberMe: false,
    };
  }
};

export default function BusinessLoginForm() {
  const router = useRouter();
  
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

  const [formState, setFormState] = useState({
    showPassword: false,
    isLoading: false,
  });

  const businessNumber = watch('businessNumber');
  const password = watch('password');

  const handleBusinessNumberBlur = (businessNumber: string) => {
    if (businessNumber) {
      if (!isValidBusinessNumber(businessNumber)) {
        setError('businessNumber', {
          type: 'manual',
          message: '사업자등록번호 10자리를 입력해주세요.'
        });
      } else {
        clearErrors('businessNumber');
      }
    } else {
      clearErrors('businessNumber');
    }
  };

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
    businessNumber &&
    password &&
    isValidBusinessNumber(businessNumber) &&
    password.length >= 8 &&
    !errors.businessNumber &&
    !errors.password;

  const onSubmit = async (data: BusinessLoginFormData) => {
    if (!isFormValid) {
      if (!businessNumber) {
        setError('businessNumber', {
          type: 'manual',
          message: '사업자등록번호를 입력해주세요.'
        });
      }
      if (!password) {
        setError('password', {
          type: 'manual',
          message: '비밀번호를 입력해주세요.'
        });
      }
      return;
    }

    const cleanBusinessNumber = removeBusinessNumberHyphen(data.businessNumber);
    
    if (cleanBusinessNumber.length < 10) {
      setError('businessNumber', {
        type: 'manual',
        message: '사업자등록번호 10자리를 입력해주세요.'
      });
      return;
    }

    if (cleanBusinessNumber === data.password) {
      setError('password', {
        type: 'manual',
        message: '가입하지 않은 사업자번호에요. 아래 회원가입을 해 주세요.'
      });
      return;
    }

    if (formState.isLoading) {
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));
    clearErrors();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.rememberMe) {
        localStorage.setItem(SAVED_BUSINESS_NUMBER_KEY, cleanBusinessNumber);
      } else {
        localStorage.removeItem(SAVED_BUSINESS_NUMBER_KEY);
      }

      router.push('/');

    } catch (error: unknown) {
      // 프로덕션에서는 에러 로깅 서비스로 전송
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }

      setError('password', {
        type: 'manual',
        message: '사업자 로그인 중 오류가 발생했습니다.'
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
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
            사업자 로그인
          </h1>
        </motion.div>

        <motion.form 
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <FormField
              name="businessNumber"
              control={control}
              label="사업자등록번호 (사업자 ID)"
              error={errors.businessNumber?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  type="text"
                  placeholder="509-86-01634"
                  maxLength={12}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const formattedValue = formatBusinessNumber(value);
                    field.onChange(formattedValue);
                    clearErrors('businessNumber');
                  }}
                  onBlur={(e) => handleBusinessNumberBlur(e.target.value)}
                  error={!!errors.businessNumber}
                />
              )}
            />
          </div>

          <div>
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
                    사업자번호 저장
                  </label>
                </div>
              )}
            />
          </div>

          <motion.div className="space-y-3">
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
              {formState.isLoading ? '사업자 로그인 중...' : '사업자 로그인'}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push('/company-signup/step1')}
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
}