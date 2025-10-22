'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BusinessSignupStep1 from '@/components/business-signup/BusinessSignupStep1';
import { SignupStep1Data } from '@/types/signup.type';

export default function SignupStep1Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupStep1Data>({
    agreements: {
      all: false,
      termsOfService: false,
      privacyPolicy: false,
      personalInfo: false,
      thirdParty: false,
      marketing: false,
    }
  });

  const handleNext = (data: SignupStep1Data) => {
    const { termsOfService, privacyPolicy, personalInfo, thirdParty } = data.agreements;
    if (!termsOfService || !privacyPolicy || !personalInfo || !thirdParty) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }

    setFormData(data);
    localStorage.setItem('signup_step1', JSON.stringify(data));

    router.push('/company-signup/step2');
  };

  const handleViewTerms = (termType: string) => {
    const termsUrlMap: { [key: string]: string } = {
      '서비스 이용약관': 'https://github.com/Workinkorea/workinkorea-client',
      '개인정보 수집 및 이용': 'https://github.com/Workinkorea/workinkorea-client',
      '개인정보 제공 및 위탁': 'https://github.com/Workinkorea/workinkorea-client',
      '개인정보 조회': 'https://github.com/Workinkorea/workinkorea-client'
    };

    const url = termsUrlMap[termType];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // 약관을 찾을 수 없는 경우 사용자에게 알림
      alert('약관 페이지를 찾을 수 없습니다. 관리자에게 문의해주세요.');
    }
  };

  return (
    <BusinessSignupStep1
      initialData={formData}
      onNextAction={handleNext}
      onViewTermsAction={handleViewTerms}
    />
  );
}