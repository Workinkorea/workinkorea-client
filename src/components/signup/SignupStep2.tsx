'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/lib/utils/validation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';

export default function SignupStep2() {
  const router = useRouter();
  
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      verificationCode: ''
    }
  });

  const [formState, setFormState] = useState({
    isEmailSent: false,
    isEmailVerified: false,
    verificationCode: '',
  });

  const emailValue = watch('email');
  const codeValue = watch('verificationCode');

  const onSubmit = async () => {
    router.push('/login');
  };

  const handleSendVerificationCode = async (email: string) => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError('email', {
        type: 'manual',
        message: validationError
      });
      return;
    }

    try {
      const response = await authApi.sendEmailVerification([email]);

      setFormState(prev => ({
        ...prev,
        isEmailSent: true
      }));

      clearErrors('email');
      toast.success('인증번호가 이메일로 전송되었습니다.');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isEmailSent: true
      }));
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    if (!code || code.length !== 6) {
      setError('verificationCode', {
        type: 'manual',
        message: '6자리 인증번호를 입력해주세요.'
      });
      return;
    }

    // try {
    //   const response = await authApi.verifyEmailCode(email, code);

    //   if (response.success) {
    //     setFormState(prev => ({
    //       ...prev,
    //       isEmailVerified: true
    //     }));

    //     clearErrors('verificationCode');
    //     toast.success('이메일 인증이 완료되었습니다.');
    //   } else {
    //     setError('verificationCode', {
    //       type: 'manual',
    //       message: response.message || '인증번호가 올바르지 않습니다.'
    //     });
    //   }
    // } catch (error) {
    //   setError('verificationCode', {
    //     type: 'manual',
    //     message: '인증번호 확인 중 오류가 발생했습니다.'
    //   });
    //   console.error('Code verification error:', error);
    // }

    setFormState(prev => ({
      ...prev,
      isEmailVerified: true
    }));
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
            개인 회원가입
          </h1>
        </motion.div>

        <motion.form 
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='mb-6'>
              <FormField
                name="email"
                control={control}
                label="이메일"
                render={(field, fieldId) => (
                  <div className="flex gap-2">
                    <input
                      {...field}
                      id={fieldId}
                      type="email"
                      value={field.value || ''}
                      placeholder="example@email.com"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setFormState(prev => ({
                          ...prev,
                          isEmailSent: false,
                          isEmailVerified: false
                        }));
                        clearErrors('email');
                      }}
                      className="flex-1 border border-line-400 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <motion.button
                      type="button"
                      onClick={() => emailValue && handleSendVerificationCode(emailValue)}
                      disabled={!emailValue || validateEmail(emailValue) !== null || formState.isEmailSent}
                      className={`relative px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        emailValue && validateEmail(emailValue) === null && !formState.isEmailSent
                          ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      whileTap={emailValue && validateEmail(emailValue) === null && !formState.isEmailSent ? { scale: 0.95 } : {}}
                    >
                      {formState.isEmailSent ? '전송완료' : '인증하기'}
                    </motion.button>
                  </div>
                )}
              />
            </div>

            {formState.isEmailSent && !formState.isEmailVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <FormField
                  name="verificationCode"
                  control={control}
                  label="인증번호"
                  render={(field, fieldId) => (
                    <div className="flex gap-2">
                      <input
                        {...field}
                        id={fieldId}
                        type="text"
                        value={field.value || ''}
                        placeholder="6자리 인증번호"
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                          setFormState(prev => ({
                            ...prev,
                            verificationCode: value
                          }));
                          clearErrors('verificationCode');
                        }}
                        className="flex-1 border border-line-400 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <motion.button
                        type="button"
                        onClick={() => {
                          if (emailValue && codeValue) {
                            handleVerifyCode(emailValue, codeValue);
                          }
                        }}
                        disabled={!codeValue || codeValue.length !== 6}
                        className={`relative px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                          codeValue && codeValue.length === 6
                            ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        whileTap={codeValue && codeValue.length === 6 ? { scale: 0.95 } : {}}
                      >
                        확인
                      </motion.button>
                    </div>
                  )}
                />
              </motion.div>
            )}

            {/* {formState.isEmailVerified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  이메일 인증이 완료되었습니다.
                </div>
              </motion.div>
            )} */}
          </motion.div>

          <motion.div className="space-y-3">
            <motion.button
              type="submit"
              disabled={!formState.isEmailVerified}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                formState.isEmailVerified
                  ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
              whileTap={formState.isEmailVerified ? { scale: 0.98 } : {}}
            >
              회원가입
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}