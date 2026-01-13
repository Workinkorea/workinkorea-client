'use client'

import { motion } from 'framer-motion';
import { FormField } from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import { useForm } from 'react-hook-form';
import { validatePassword } from '@/shared/lib/utils/validation';
import { useState } from 'react';
import { GoogleIcon } from '@/shared/ui/AccessibleIcon';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api/authApi';
import { tokenManager } from '@/shared/lib/utils/tokenManager';
import { API_BASE_URL } from '@/shared/api/client';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SAVED_EMAIL_KEY = 'savedUserEmail';

const getDefaultValues = (): LoginFormData => {
  if (typeof window === 'undefined') {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  try {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    return {
      email: savedEmail || '',
      password: '',
      rememberMe: !!savedEmail,
    };
  } catch (error) {
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

export default function LoginContent() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: getDefaultValues(),
  });

  const [formState, setFormState] = useState({
    showPassword: false,
    isLoading: false,
    isGoogleLoading: false,
  });

  const email = watch('email');
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

  const handleGoogleLogin = () => {
    // rememberMe 값을 localStorage에 임시 저장
    const rememberMe = watch('rememberMe');
    if (rememberMe) {
      localStorage.setItem('googleLoginRememberMe', 'true');
    } else {
      localStorage.removeItem('googleLoginRememberMe');
    }
    window.location.href = `${API_BASE_URL}/api/auth/login/google`;
  };

  const onSubmit = async (data: LoginFormData) => {
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
      const response = await authApi.login({
        email: data.email,
        password: data.password
      });

      if (response.success && response.token) {
        // 자동로그인 체크박스에 따라 localStorage 또는 sessionStorage에 저장
        // token_type을 함께 저장 (기본값: 'access')
        const tokenType = response.token_type || 'access';
        tokenManager.setToken(response.token, data.rememberMe, tokenType);

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

      let errorMessage = '로그인할 수 없어요. 다시 시도해주세요';
      let errorField: 'email' | 'password' = 'password';

      // Axios 에러 응답 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: {
              error?: string;
              detail?: string;
              message?: string;
            }
          };
          message?: string;
        };

        const status = axiosError.response?.status;
        const serverError =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message;

        // HTTP 상태 코드별 처리
        if (status === 401) {
          // 401: 인증 실패 (비밀번호 오류)
          errorMessage = '비밀번호가 일치하지 않아요';
          errorField = 'password';
        } else if (status === 404) {
          // 404: 사용자를 찾을 수 없음
          errorMessage = '등록되지 않은 이메일이에요';
          errorField = 'email';
        } else if (status === 403) {
          // 403: 접근 권한 없음 (계정 비활성화 등)
          errorMessage = '계정 정보를 확인해주세요';
          errorField = 'email';
        } else if (status === 400) {
          // 400: 잘못된 요청 (이메일 또는 비밀번호 형식 오류)
          if (serverError) {
            const errorMsg = serverError.toLowerCase();
            if (errorMsg.includes('email')) {
              errorMessage = '이메일 형식을 확인해주세요';
              errorField = 'email';
            } else if (errorMsg.includes('password')) {
              errorMessage = '비밀번호를 확인해주세요';
              errorField = 'password';
            } else {
              errorMessage = serverError;
            }
          } else {
            errorMessage = '입력 정보를 확인해주세요';
          }
        } else if (status === 429) {
          // 429: 너무 많은 요청
          errorMessage = '잠시 후 다시 시도해주세요';
          errorField = 'password';
        } else if (status && status >= 500) {
          // 500번대: 서버 오류
          errorMessage = '잠시 후 다시 시도해주세요';
          errorField = 'password';
        } else if (serverError) {
          // 서버에서 제공한 에러 메시지가 있는 경우
          const errorMsg = serverError.toLowerCase();

          if (errorMsg.includes('password') && (errorMsg.includes('incorrect') || errorMsg.includes('invalid') || errorMsg.includes('wrong'))) {
            errorMessage = '비밀번호가 일치하지 않아요';
            errorField = 'password';
          } else if (errorMsg.includes('user') && errorMsg.includes('not found')) {
            errorMessage = '등록되지 않은 이메일이에요';
            errorField = 'email';
          } else if (errorMsg.includes('email') && errorMsg.includes('not found')) {
            errorMessage = '등록되지 않은 이메일이에요';
            errorField = 'email';
          } else if (errorMsg.includes('disabled') || errorMsg.includes('suspended') || errorMsg.includes('blocked')) {
            errorMessage = '계정이 비활성화되었어요. 관리자에게 문의해주세요';
            errorField = 'email';
          } else {
            errorMessage = serverError;
          }
        }
      } else if (error instanceof Error) {
        // 네트워크 에러 또는 기타 에러 처리
        const errorMsg = error.message.toLowerCase();

        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else if (errorMsg.includes('timeout')) {
          errorMessage = '잠시 후 다시 시도해주세요';
        } else {
          errorMessage = '로그인할 수 없어요. 다시 시도해주세요';
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
            개인 로그인
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
              label="이메일"
              error={errors.email?.message}
              render={(field, fieldId) => (
                <Input
                  {...field}
                  id={fieldId}
                  type="email"
                  placeholder="example@email.com"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors('email');
                  }}
                  onBlur={(e) => handleEmailBlur(e.target.value)}
                  error={!!errors.email}
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
