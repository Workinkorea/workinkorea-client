'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupStep2Data, Step2Form } from '@/types/signup.type';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { formatBusinessNumber, isValidBusinessNumber, validateConfirmPassword, validatePassword, validatePhoneNumber } from '@/lib/utils/authNumber';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';

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
    formState: { errors, isValid },
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

    setFormState(prev => ({
      ...prev,
      isBusinessNumberVerified: true,
      businessNumberMessage: '사업자등록번호 인증이 완료되었습니다.',
      businessNumberVerifyToken: 'temp_token_' + Date.now(),
      companyInfo: {
        company: '테스트 회사명',
        owner: '홍길동'
      }
    }));
    
    clearErrors('businessNumber');
    
    toast.success('사업자등록번호 인증이 완료되었습니다.');
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
    if (!isValid) {
      alert('모든 항목을 올바르게 입력해주세요.');
      return;
    }

    const companySignupData = {
      company_number: data.businessNumber.replace(/[^0-9]/g, ''),
      company_name: data.company,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phoneNumber.replace(/[^0-9]/g, ''),
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
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : '회원가입 중 오류가 발생했습니다.';
      toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.');
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

  // useEffect(() => {
  //   const handleScroll = throttle(() => {
  //     const headerHeight = 60;
  //     const progressSectionHeight = 200;
  //     const scrollY = window.scrollY;

  //     setIsProgressBarSticky(scrollY > headerHeight);

  //     const shouldShowToast = scrollY > progressSectionHeight;

  //     if (shouldShowToast && !showProgressToast) {
  //       setShowProgressToast(true);

  //       const progress = calculateProgress();
  
  //       const toastId = toast.custom(
  //         () => (
  //           <div className="w-full max-w-[540px] mobile:max-w-[448px] mx-auto px-4 mt-14">
  //             <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
  //               <span className="text-body-3 text-primary-500">{progress}%</span>
  //             </div>
  //           </div>
  //         ),
  //         {
  //           duration: Infinity,
  //           position: 'top-center',
  //           unstyled: true,
  //         }
  //       );
  //       setCurrentToastId(toastId);
  //     } else if (!shouldShowToast && showProgressToast) {
  //       setShowProgressToast(false);
  //       if (currentToastId) {
  //         toast.dismiss(currentToastId);
  //         setCurrentToastId(null);
  //       }
  //     }
  //   }, 16);

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     if (currentToastId) {
  //       toast.dismiss(currentToastId);
  //     }
  //   };
  // }, [showProgressToast, currentToastId, calculateProgress]);

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
                    readOnly={!!formState.companyInfo?.company}
                    className={formState.companyInfo?.company
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : ""
                    }
                  />
                )}
              />

              <FormField
                name="name"
                control={control}
                label="대표자명"
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    placeholder="대표자명 입력"
                    error={!!errors.name}
                  />
                )}
              />

              <FormField
                name="phoneNumber"
                control={control}
                label="대표자 휴대폰 번호"
                error={errors.phoneNumber?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    type="tel"
                    placeholder="010-0000-0000"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const formatted = value.length > 3
                        ? value.length > 7
                          ? `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
                          : `${value.slice(0, 3)}-${value.slice(3, 7)}`
                        : value;
                      field.onChange(formatted);
                    }}
                    onBlur={(e) => {
                      const phoneError = validatePhoneNumber(e.target.value);
                      if (phoneError) {
                        setError('phoneNumber', {
                          type: 'manual',
                          message: phoneError
                        });
                      } else {
                        clearErrors('phoneNumber');
                      }
                    }}
                    maxLength={13}
                    error={!!errors.phoneNumber}
                  />
                )}
              />

              <FormField
                name="email"
                control={control}
                label="대표자 이메일"
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