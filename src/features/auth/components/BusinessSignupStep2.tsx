'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SignupStep2Data, Step2Form } from '@/features/auth/types/signup.types';
import { useForm } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { RadioGroup } from '@/shared/ui/Radio';
import { formatBusinessNumber, isValidBusinessNumber, validateConfirmPassword, validatePassword } from '@/shared/lib/utils/validation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/authApi';
import { formatPhoneByType, validatePhoneType, getPhonePlaceholder, PhoneType } from '@/shared/lib/utils/phoneUtils';
import { extractErrorMessage, logError, getErrorStatus } from '@/shared/lib/utils/errorHandler';
import { useTranslations } from 'next-intl';

interface BusinessSignupStep2Props {
  initialData?: SignupStep2Data;
  onNextAction: (data: SignupStep2Data) => void;
};

export default function BusinessSignupStep2({
  initialData,
  onNextAction,
}: BusinessSignupStep2Props) {
  const t = useTranslations('auth.companySignup');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
    isVerifying: false,
    businessNumberMessage: '',
    passwordMatchMessage: '',
    businessNumberVerifyToken: '',
    companyInfo: null as { company: string; owner: string } | null,
    phoneType: 'MOBILE' as PhoneType,
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
        message: t('errorBizNumberRequired'),
      });
      return;
    }

    setFormState(prev => ({ ...prev, isVerifying: true }));

    try {
      const response = await authApi.verifyBusinessNumber(businessNumber);

      if (response.status_code === 'OK' && response.data && response.data.length > 0) {
        const businessData = response.data[0];

        // 계속사업자인지 확인
        if (businessData.b_stt_cd !== '01') {
          setError('businessNumber', {
            type: 'manual',
            message: t('errorBizStatus', { status: businessData.b_stt }),
          });
          toast.error(t('errorBizStatus', { status: businessData.b_stt }));
          return;
        }

        setFormState(prev => ({
          ...prev,
          isBusinessNumberVerified: true,
          businessNumberMessage: t('bizVerifiedMsg'),
          businessNumberVerifyToken: `verified_${businessNumber}_${Date.now()}`,
          companyInfo: {
            company: businessData.tax_type || '',
            owner: businessData.b_stt || '',
          },
        }));

        clearErrors('businessNumber');
        toast.success(t('toastBizVerified'));
      } else {
        setError('businessNumber', {
          type: 'manual',
          message: t('toastBizInvalid'),
        });
        toast.error(t('toastBizInvalid'));
      }
    } catch (error) {
      setError('businessNumber', {
        type: 'manual',
        message: t('toastBizError'),
      });
      toast.error(t('toastBizError'));
    } finally {
      setFormState(prev => ({ ...prev, isVerifying: false }));
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

      toast.success(t('toastSuccess'));

      const transformedData = {
        userInfo: {
          ...data,
          businessNumberVerifyToken: formState.businessNumberVerifyToken,
        }
      };

      onNextAction(transformedData);
    } catch (error: unknown) {
      logError(error, 'BusinessSignupStep2.onSubmit');
      const rawMessage = extractErrorMessage(error, '');
      const status = getErrorStatus(error);

      if (status === 400 && rawMessage.toLowerCase().includes('already exists')) {
        setError('email', {
          type: 'manual',
          message: t('toastEmailDuplicate'),
        });
        toast.error(t('toastEmailDuplicate'));
      } else {
        toast.error(rawMessage || t('toastError'));
      }
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
          <h1 className="text-title-2 sm:text-title-1 text-slate-900 text-center mb-4 leading-tight">
            <p>{t('title')}</p>
          </h1>
          <div className="flex items-center justify-between text-body-3">
            <div />
            <span className="text-blue-600">{currentProgress}%</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${currentProgress}%` }}></div>
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
                label={t('bizNumber')}
                error={errors.businessNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id={fieldId}
                        type="text"
                        className="flex-1"
                        placeholder={t('bizNumberPlaceholder')}
                        maxLength={12}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          const formattedValue = formatBusinessNumber(value);
                          field.onChange(formattedValue);
                          setFormState(prev => ({
                            ...prev,
                            isBusinessNumberVerified: false,
                            businessNumberMessage: '',
                            companyInfo: null,
                          }));
                          clearErrors('businessNumber');
                        }}
                      />
                      <Button
                        type="button"
                        variant={formState.isBusinessNumberVerified ? 'outline' : 'primary'}
                        size="md"
                        isLoading={formState.isVerifying}
                        disabled={!field.value || !isValidBusinessNumber(field.value) || formState.isVerifying || formState.isBusinessNumberVerified}
                        onClick={() => field.value && handleBusinessNumberCheck(field.value)}
                        className="whitespace-nowrap"
                      >
                        {formState.isVerifying ? t('verifying') : formState.isBusinessNumberVerified ? t('verified') : t('verify')}
                      </Button>
                    </div>
                    <p className='text-right text-caption-2 underline hover:text-slate-700 cursor-pointer'
                      onClick={() => window.open(
                        "https://github.com/Workinkorea/workinkorea-client",
                        "_blank"
                      )}
                    >
                      {t('forgotBizNumber')}
                    </p>
                  </div>
                )}
              />

              {formState.isBusinessNumberVerified && formState.businessNumberMessage && (
                <p className="text-caption-3 text-blue-600 mt-1">
                  {formState.businessNumberMessage}
                </p>
              )}
            </div>

            <div className='mb-6 space-y-4'>
              <FormField
                name="company"
                control={control}
                label={t('companyLabel')}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    placeholder={t('companyPlaceholder')}
                    error={!!errors.company}
                  />
                )}
              />

              <FormField
                name="name"
                control={control}
                label={t('managerName')}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    placeholder={t('managerNamePlaceholder')}
                    error={!!errors.name}
                  />
                )}
              />

              <FormField
                name="phoneNumber"
                control={control}
                label={t('managerPhone')}
                error={errors.phoneNumber?.message}
                render={(field, fieldId) => (
                  <div className="space-y-3">
                    {/* Phone Type Selection */}
                    <RadioGroup
                      name="phoneType"
                      layout="horizontal"
                      size="sm"
                      value={formState.phoneType}
                      onChange={(value) => {
                        setFormState(prev => ({ ...prev, phoneType: value as PhoneType }));
                        field.onChange('');
                        clearErrors('phoneNumber');
                      }}
                      options={[
                        { value: 'MOBILE', label: t('mobile') },
                        { value: 'LANDLINE', label: t('landline') },
                      ]}
                    />

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
                      <p className="text-caption-3 text-slate-500">
                        {formState.phoneType === 'MOBILE'
                          ? t('phoneHintMobile')
                          : t('phoneHintLandline')}
                      </p>
                    )}
                  </div>
                )}
              />

              <FormField
                name="email"
                control={control}
                label={t('managerEmail')}
                error={errors.email?.message}
                render={(field, fieldId) => (
                  <div className="space-y-1.5">
                    <Input
                      {...field}
                      id={fieldId}
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      maxLength={320}
                      onBlur={(e) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(e.target.value)) {
                          setError('email', {
                            type: 'manual',
                            message: t('errorEmailFormat'),
                          });
                        } else {
                          clearErrors('email');
                        }
                      }}
                      error={!!errors.email}
                    />
                    <p className="text-caption-2 text-slate-500 flex items-center gap-1">
                      <span className="text-blue-500">ℹ</span>
                      {t('emailLoginHint')}
                    </p>
                  </div>
                )}
              />
            </div>

            <div className='mb-1'>
              <FormField
                name="password"
                control={control}
                label={t('passwordLabel')}
                error={errors.password?.message}
                render={(field, fieldId) => (
                  <Input
                    {...field}
                    id={fieldId}
                    variant="password"
                    placeholder={t('passwordPlaceholder')}
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
                    placeholder={t('confirmPasswordPlaceholder')}
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
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isFormValid}
                className="w-full"
              >
                {t('signupButton')}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}