'use client';

import { useState } from 'react';
import { SignupStep2Data } from '@/types/signup.type';
import { useRouter } from 'next/navigation';
import BusinessSignupStep2 from '@/components/business-signup/BusinessSignupStep2';

export default function SignupStep2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupStep2Data>({
    userInfo: {
      businessNumber: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      phoneNumber: '',
      email: '',
      name: '',
      company: '',
      businessNumberVerifyToken: ''
    }
  });

  const handleNext = async (data: SignupStep2Data) => {
    setFormData(data);
    // TODO: 회원가입 API 호출
    router.push('/company-login?signup=success');
  };

  return (
    <BusinessSignupStep2
      initialData={formData}
      onNextAction={handleNext}
    />
  );
}