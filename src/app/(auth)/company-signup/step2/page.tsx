'use client';

import { useState } from 'react';
import { SignupStep2Data } from '@/features/auth/types/signup.types';
import { useRouter } from 'next/navigation';
import BusinessSignupStep2 from '@/features/auth/components/BusinessSignupStep2';

export default function SignupStep2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupStep2Data>({
    userInfo: {
      businessNumber: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      email: '',
      name: '',
      company: '',
      businessNumberVerifyToken: ''
    }
  });

  const handleNext = async (data: SignupStep2Data) => {
    setFormData(data);
    router.push('/company-login?signup=success');
  };

  return (
    <BusinessSignupStep2
      initialData={formData}
      onNextAction={handleNext}
    />
  );
}