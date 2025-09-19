'use client';

import { useState } from 'react';
import BusinessSignupStep2 from '@/components/features/business-signup/BusinessSignupStep2';
import { SignupStep2Data } from '@/types/signup.type';
// import { useRouter } from 'next/navigation';

export default function SignupStep2Page() {
  // const router = useRouter();
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
    console.log('Step 2 data:', data);
    // router.push('/');
  };

  return (
    <BusinessSignupStep2
      initialData={formData}
      onNextAction={handleNext}
    />
  );
}