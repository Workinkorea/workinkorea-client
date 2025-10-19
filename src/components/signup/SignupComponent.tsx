'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { useRouter } from 'next/navigation';
import { SelectSearchInput } from '@/components/ui/SelectSearchInput';
import { COUNTRIES } from '@/constants/countries';
import { validateEmail } from '@/lib/utils/validation';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

export default function SignupComponent() {
  const router = useRouter();

  const [formState, setFormState] = useState({
    isEmailSent: false,
    isEmailVerified: false,
    verificationCode: '',
  });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: '',
      birth: '',
      country: '',
      email: '',
      verificationCode: '',
    }
  });

  const emailValue = watch('email');
  const codeValue = watch('verificationCode');

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
      await authApi.sendEmailVerification([email]);

      setFormState(prev => ({
        ...prev,
        isEmailSent: true
      }));

      clearErrors('email');
      toast.success('인증번호가 이메일로 전송되었습니다.');
    } catch {
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
  }

  const onSubmit = async (data: any) => {
    console.log(data);
    router.push('/login');
  };

  return (
    <div className='w-full flex'>
      <div className='w-full h-full bg-blue-400'>
        약관동의 넣으면됨
      </div>
      <div className="flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
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
              className="space-y-4"
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
                        className="flex-1 border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="flex-1 border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <FormField
                name="name"
                control={control}
                label="이름 (영문)"
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="Hong Gildong"
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              <FormField
                name="birth"
                control={control}
                label="생년월일"
                render={(field, fieldId) => (
                  <input
                    {...field}
                    id={fieldId}
                    type="text"
                    value={field.value || ''}
                    placeholder="YYYYMMDD"
                    maxLength={8}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    className="w-full border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
              />

              <FormField
                name="country"
                control={control}
                label="국적"
                render={(field) => (
                  <SelectSearchInput
                    options={COUNTRIES}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="국적을 선택하세요"
                  />
                )}
              />
            </motion.div>

            <motion.div className="space-y-3 mt-6">
              <motion.button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-primary-300 text-white hover:bg-primary-400 cursor-pointer transition-colors"
                disabled={true}
                whileTap={{ scale: 0.98 }}
              >
                회원가입
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}