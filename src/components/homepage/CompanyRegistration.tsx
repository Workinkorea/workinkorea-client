'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface CompanyRegistrationProps {
  className?: string;
}

export const CompanyRegistration = ({
  className = ''
}: CompanyRegistrationProps) => {
  const router = useRouter();

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <div className="text-right mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">기업회원 로그인</h2>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => router.push('/company-login')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer">
            로그인
          </button>
          <button 
            onClick={() => router.push('/company-signup/step1')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
            회원가입
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          아이디/비밀번호를 잊으셨나요?
        </p>
      </div>
    </div>
  );
};

export default CompanyRegistration;