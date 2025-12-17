'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { validatePassword } from '@/lib/utils/authNumber';
import { authApi } from '@/lib/api/auth';
import { tokenManager } from '@/lib/utils/tokenManager';
// import { formatBusinessNumber, isValidBusinessNumber, removeBusinessNumberHyphen } from '@/lib/utils/authNumber'; // 사업자등록번호 방식에서 사용

interface BusinessLoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  // businessNumber: string;
}

const SAVED_EMAIL_KEY = 'savedBusinessEmail';
// const SAVED_BUSINESS_NUMBER_KEY = 'savedBusinessNumber';

const getDefaultValues = (): BusinessLoginFormData => {
  if (typeof window === 'undefined') {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  try {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    // const savedBusinessNumber = localStorage.getItem(SAVED_BUSINESS_NUMBER_KEY);

    return {
      email: savedEmail || '',
      // businessNumber: savedBusinessNumber ? formatBusinessNumber(savedBusinessNumber) : '',
      password: '',
      rememberMe: !!savedEmail,
    };
  } catch (error) {
    // localStorage 접근 실패 시 기본값 반환
    if (process.env.NODE_ENV === 'development') {
      console.warn('localStorage access failed:', error);
    }
    return {
      email: '',
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

  const email = watch('email');
  // const businessNumber = watch('businessNumber');
  const password = watch('password');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = (email: string) => {
    if (email) {
      if (!isValidEmail(email)) {
        setError('email', {
          type: 'manual',
          message: '올바른 이메일 형식을 입력해주세요.'
        });
      } else {
        clearErrors('email');
      }
    } else {
      clearErrors('email');
    }
  };

  // const handleBusinessNumberBlur = (businessNumber: string) => {
  //   if (businessNumber) {
  //     if (!isValidBusinessNumber(businessNumber)) {
  //       setError('businessNumber', {
  //         type: 'manual',
  //         message: '사업자등록번호 10자리를 입력해주세요.'
  //       });
  //     } else {
  //       clearErrors('businessNumber');
  //     }
  //   } else {
  //     clearErrors('businessNumber');
  //   }
  // };

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
    email &&
    password &&
    isValidEmail(email) &&
    password.length >= 8 &&
    !errors.email &&
    !errors.password;

  // const isFormValid =
  //   businessNumber &&
  //   password &&
  //   isValidBusinessNumber(businessNumber) &&
  //   password.length >= 8 &&
  //   !errors.businessNumber &&
  //   !errors.password;

  const onSubmit = async (data: BusinessLoginFormData) => {
    if (!isFormValid) {
      if (!email) {
        setError('email', {
          type: 'manual',
          message: '이메일을 입력해주세요.'
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

    if (formState.isLoading) {
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));
    clearErrors();

    try {
      const response = await authApi.companyLogin({
        username: data.email,
        password: data.password
      });

      // 새로운 방식: access_token과 token_type을 직접 받음
      if (response.access_token) {
        const tokenType = response.token_type || 'access_company';
        tokenManager.setCompanyAccessToken(response.access_token, data.rememberMe, tokenType);

        if (data.rememberMe) {
          localStorage.setItem(SAVED_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(SAVED_EMAIL_KEY);
        }

        // 홈으로 리다이렉트
        router.push('/');
      }
      // 기존 방식 (하위 호환성): URL에서 token 파싱
      else if (response.url) {
        const url = new URL(response.url);
        const token = url.searchParams.get('token');

        if (token) {
          // 자동로그인 체크박스에 따라 localStorage 또는 sessionStorage에 저장
          const tokenType = response.token_type || 'access_company';
          tokenManager.setCompanyAccessToken(token, data.rememberMe, tokenType);
        }

        if (data.rememberMe) {
          localStorage.setItem(SAVED_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(SAVED_EMAIL_KEY);
        }

        // 홈으로 리다이렉트
        router.push('/');
      } else {
        setError('password', {
          type: 'manual',
          message: '로그인 응답이 올바르지 않습니다.'
        });
        setFormState(prev => ({ ...prev, isLoading: false }));
      }

    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }

      let errorMessage = '기업 로그인 중 오류가 발생했습니다.';
      let errorField: 'email' | 'password' = 'password';

      // Axios 에러 응답 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        const serverError = axiosError.response?.data?.error;

        if (serverError) {
          const errorMsg = serverError.toLowerCase();

          // 서버에서 반환하는 에러 메시지를 한글로 변환
          if (errorMsg.includes('password is incorrect') || errorMsg.includes('invalid password')) {
            errorMessage = '비밀번호가 일치하지 않습니다.';
            errorField = 'password';
          } else if (errorMsg.includes('user not found') || errorMsg.includes('not found') || errorMsg.includes('company not found')) {
            errorMessage = '등록되지 않은 이메일입니다.';
            errorField = 'email';
          } else if (errorMsg.includes('account disabled') || errorMsg.includes('forbidden')) {
            errorMessage = '계정이 비활성화되었거나 접근 권한이 없습니다.';
            errorField = 'email';
          } else {
            errorMessage = serverError;
          }
        }
      } else if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        // HTTP 상태 코드 기반 에러 처리 (fallback)
        if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('user not found')) {
          errorMessage = '등록되지 않은 이메일입니다.';
          errorField = 'email';
        } else if (errorMsg.includes('401') || errorMsg.includes('unauthorized') || errorMsg.includes('invalid password')) {
          errorMessage = '비밀번호가 일치하지 않습니다.';
          errorField = 'password';
        } else if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
          errorMessage = '계정이 비활성화되었거나 접근 권한이 없습니다.';
          errorField = 'email';
        }
      }

      setError(errorField, {
        type: 'manual',
        message: errorMessage
      });
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
            기업 로그인
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
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors('email');
                  }}
                  onBlur={(e) => handleEmailBlur(e.target.value)}
                  error={!!errors.email}
                />
              )}
            />
          </div>

          {/* 사업자등록번호 방식 (주석 처리) */}
          {/* <div>
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
          </div> */}

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
                    이메일 저장
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
              {formState.isLoading ? '기업 로그인 중...' : '기업 로그인'}
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