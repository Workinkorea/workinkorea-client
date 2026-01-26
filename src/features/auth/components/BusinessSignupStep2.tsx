'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupStep2Data, Step2Form } from '@/features/auth/types/signup.types';
import { useForm } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import { formatBusinessNumber, isValidBusinessNumber, validateConfirmPassword, validatePassword } from '@/shared/lib/utils/validation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/authApi';
import { formatPhoneByType, validatePhoneType, getPhonePlaceholder, PhoneType } from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';

interface BusinessSignupStep2Props {
  initialData?: SignupStep2Data;
  onNextAction: (data: SignupStep2Data) => void;
};

export default function BusinessSignupStep2({
  initialData, 
  onNextAction,
}: BusinessSignupStep2Props) {

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<Step2Form>({
    mode: 'onChange',
    defaultValues: initialData?.userInfo ?? {
      businessNumber: '',
      password: '',
      confirmPassword: '',
      company: '',
      name: '',
      phoneNumber: '',
      email: '',
    }
  });

  const [formState, setFormState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isBusinessNumberVerified: false,
    businessNumberMessage: '',
    passwordMatchMessage: '',
    businessNumberVerifyToken: '',
    companyInfo: null as { company: string; owner: string } | null,
    phoneType: 'MOBILE' as PhoneType,  // Default to mobile
  });

  const businessNumber = watch('businessNumber');
  const name = watch('name');
  const phoneNumber = watch('phoneNumber');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

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
    }
  };

  const handleConfirmPasswordBlur = (confirmPassword: string) => {
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(password, confirmPassword);
      if (confirmError) {
        setError('confirmPassword', {
          type: 'manual',
          message: confirmError
        });
      } else {
        clearErrors('confirmPassword');
      }
    }
  };

  const handleBusinessNumberCheck = async (businessNumber: string) => {
    if (!isValidBusinessNumber(businessNumber)) {
      setError('businessNumber', {
        type: 'manual',
        message: '사업자등록번호 10자리를 입력해주세요.'
      });
      return;
    }

    try {
      const response = await authApi.verifyBusinessNumber(businessNumber);

      if (response.status_code === 'OK' && response.data && response.data.length > 0) {
        const businessData = response.data[0];

        // 계속사업자인지 확인
        if (businessData.b_stt_cd !== '01') {
          setError('businessNumber', {
            type: 'manual',
            message: `해당 사업자는 ${businessData.b_stt} 상태입니다.`
          });
          toast.error(`사업자 상태: ${businessData.b_stt}`);
          return;
        }

        setFormState(prev => ({
          ...prev,
          isBusinessNumberVerified: true,
          businessNumberMessage: '사업자등록번호 인증이 완료되었습니다.',
          businessNumberVerifyToken: `verified_${businessNumber}_${Date.now()}`,
          companyInfo: {
            company: businessData.tax_type || '',
            owner: businessData.b_stt || ''
          }
        }));

        clearErrors('businessNumber');
        toast.success('사업자등록번호 인증이 완료되었습니다.');
      } else {
        setError('businessNumber', {
          type: 'manual',
          message: '유효하지 않은 사업자등록번호입니다.'
        });
        toast.error('유효하지 않은 사업자등록번호입니다.');
      }
    } catch (error) {
      console.error('Business number verification failed:', error);
      setError('businessNumber', {
        type: 'manual',
        message: '사업자등록번호 인증에 실패했습니다.'
      });
      toast.error('사업자등록번호 인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const company = watch('company');

  const isFormValid =
    businessNumber &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 8 &&
    !errors.businessNumber &&
    !errors.password &&
    !errors.confirmPassword &&
    formState.isBusinessNumberVerified &&
    company &&
    name &&
    phoneNumber &&
    phoneNumber.length >= 12 &&
    email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    !errors.company &&
    !errors.name &&
    !errors.phoneNumber &&
    !errors.email;

  const onSubmit = async (data: Step2Form) => {
    const companySignupData = {
      company_number: data.businessNumber.replace(/[^0-9]/g, ''),
      company_name: data.company,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phoneNumber.replace(/[^0-9]/g, ''),
      phone_type: formState.phoneType,  // Add phone type
    };

    try {
      await authApi.companySignup(companySignupData);

      toast.success('기업 회원가입이 완료되었습니다. 로그인 해주세요.');

      const transformedData = {
        userInfo: {
          ...data,
          businessNumberVerifyToken: formState.businessNumberVerifyToken,
        }
      };

      onNextAction(transformedData);
    } catch (error: unknown) {
      logError(error, 'BusinessSignupStep2.onSubmit');
      const errorMessage = extractErrorMessage(error, '회원가입 중 오류가 발생했습니다.');
      toast.error(errorMessage);
    }
  };

  const calculateProgress = useCallback(() => {
    let progress = 0;

    if (formState.isBusinessNumberVerified) {
      progress += 20;
    }

    if (password && password.length >= 8 && !errors.password) {
      progress += 15;
    }

    if (confirmPassword && confirmPassword === password && !errors.confirmPassword) {
      progress += 15;
    }

    if (company && !errors.company) {
      progress += 15;
    }

    if (name && !errors.name) {
      progress += 10;
    }

    if (phoneNumber && phoneNumber.length >= 12 && !errors.phoneNumber) {
      progress += 15;
    }

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.email) {
      progress += 10;
    }

    return Math.min(progress, 100);
  }, [formState.isBusinessNumberVerified, password, confirmPassword, company, name, phoneNumber, email, errors]);

  const currentProgress = useMemo(() => calculateProgress(), [calculateProgress]);

  return (
    <div className="h-full">

      <div className="px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display-2 mobile:text-title-2 text-label-900 text-center mb-4 leading-tight">
            <p>기업 회원가입</p>
          </h1>
          <div className="flex items-center justify-between text-body-2 mobile:text-body-3">
            <div />
            <span className="text-primary-500">{currentProgress}%</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-component-alternative rounded-full h-2">
              <div className="bg-primary-300 h-2 rounded-full" style={{ width: `${currentProgress}%` }}></div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='mb-6'>
              <FormField
                name="businessNumber"
                control={control}
                label="사업자등록번호 (ID)"
                error={errors.businessNumber?.message}
                render={(field, fieldId) => (
                  <div className="flex gap-2">
                    <input
                      {...field}
                      id={fieldId}
                      type="text"
                      className="flex-1 border border-line-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="-제외 10자리 입력"
                      maxLength={12}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formattedValue = formatBusinessNumber(value);
                        field.onChange(formattedValue);
                        setFormState(prev => ({
                          ...prev,
                          isBusinessNumberVerified: false,
                          businessNumberMessage: '',
                          companyInfo: null
                        }));
                        clearErrors('businessNumber');
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => field.value && handleBusinessNumberCheck(field.value)}
                      disabled={!field.value || !isValidBusinessNumber(field.value)}
                      className={`relative px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        field.value && isValidBusinessNumber(field.value)
                          ? formState.isBusinessNumberVerified 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      whileTap={field.value && isValidBusinessNumber(field.value) && !formState.isBusinessNumberVerified ? { scale: 0.95 } : {}}
                    >
                      {formState.isBusinessNumberVerified ? '인증완료' : '인증하기'}
                    </motion.button>
                    <p className='absolute top-0 right-0 underline text-caption-1 hover:text-label-700 cursor-pointer'
                      onClick={() => window.open(
                        "https://github.com/Workinkorea/workinkorea-client",
                        "_blank"
                      )}
                    >
                      사업자번호가 기억나지 않아요
                    </p>
                  </div>
                )}
              />

              {formState.isBusinessNumberVerified && formState.businessNumberMessage && (
                <p className="text-caption-2 text-primary-500 mt-1">
                  {formState.businessNumberMessage}
                </p>
              )}
            </div>

            <div className='mb-6 space-y-4'>
              <FormField
                name="company"
                control={control}
                label="기업명"
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    placeholder="기업명 입력"
                    error={!!errors.company}
                  />
                )}
              />

              <FormField
                name="name"
                control={control}
                label="담당자명"
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    placeholder="담당자명 입력"
                    error={!!errors.name}
                  />
                )}
              />

              <FormField
                name="phoneNumber"
                control={control}
                label="담당자 전화번호"
                error={errors.phoneNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-3">
                    {/* Phone Type Selection */}
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="phoneType"
                          value="MOBILE"
                          checked={formState.phoneType === 'MOBILE'}
                          onChange={() => {
                            setFormState(prev => ({ ...prev, phoneType: 'MOBILE' }));
                            field.onChange('');  // Reset phone number when type changes
                            clearErrors('phoneNumber');
                          }}
                          className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-body-3 text-label-700">휴대전화</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="phoneType"
                          value="LANDLINE"
                          checked={formState.phoneType === 'LANDLINE'}
                          onChange={() => {
                            setFormState(prev => ({ ...prev, phoneType: 'LANDLINE' }));
                            field.onChange('');  // Reset phone number when type changes
                            clearErrors('phoneNumber');
                          }}
                          className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-body-3 text-label-700">일반전화</span>
                      </label>
                    </div>

                    {/* Phone Number Input */}
                    <Input
                      {...field}
                      id={fieldId}
                      type="tel"
                      placeholder={getPhonePlaceholder(formState.phoneType)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = formatPhoneByType(value, formState.phoneType);
                        field.onChange(formatted);
                      }}
                      onBlur={(e) => {
                        const phoneError = validatePhoneType(e.target.value, formState.phoneType);
                        if (phoneError) {
                          setError('phoneNumber', {
                            type: 'manual',
                            message: phoneError
                          });
                        } else {
                          clearErrors('phoneNumber');
                        }
                      }}
                      maxLength={formState.phoneType === 'MOBILE' ? 13 : 13}
                      error={!!errors.phoneNumber}
                    />

                    {/* Helper Text */}
                    {!errors.phoneNumber && field.value && (
                      <p className="text-caption-2 text-label-500">
                        {formState.phoneType === 'MOBILE'
                          ? '휴대전화: 010, 011, 016-019로 시작'
                          : '일반전화: 지역번호(예: 02, 031, 051) 포함'}
                      </p>
                    )}
                  </div>
                )}
              />

              <FormField
                name="email"
                control={control}
                label="담당자 이메일"
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    type="email"
                    placeholder="이메일 입력"
                    onBlur={(e) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(e.target.value)) {
                        setError('email', {
                          type: 'manual',
                          message: '이메일 형식이 올바르지 않습니다.'
                        });
                      } else {
                        clearErrors('email');
                      }
                    }}
                    error={!!errors.email}
                  />
                )}
              />
            </div>

            <div className='mb-1'>
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
                    placeholder="8~15자리/영문, 숫자, 특수문자 조합 입력"
                    error={!!errors.password}
                    showPassword={formState.showPassword}
                    onTogglePassword={() => setFormState(prev => ({
                      ...prev,
                      showPassword: !prev.showPassword
                    }))}
                    onBlur={(e) => handlePasswordBlur(e.target.value)}
                    maxLength={15}
                  />
                )}
              />
            </div>

            <div className='mb-6'>
              <FormField
                name="confirmPassword"
                control={control}
                error={errors.confirmPassword?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    variant="password"
                    placeholder="8~15자리/영문, 숫자, 특수문자 조합 재입력"
                    error={!!errors.confirmPassword}
                    showPassword={formState.showConfirmPassword}
                    onTogglePassword={() => setFormState(prev => ({
                      ...prev,
                      showConfirmPassword: !prev.showConfirmPassword
                    }))}
                    onBlur={(e) => handleConfirmPasswordBlur(e.target.value)}
                    maxLength={15}
                  />
                )}
              />
            </div>

            <motion.div 
              className="mt-8 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isFormValid
                    ? 'bg-primary-300 text-white hover:bg-primary-400 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                가입하기
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}