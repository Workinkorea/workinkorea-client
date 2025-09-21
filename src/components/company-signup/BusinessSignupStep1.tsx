'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SignupStep1Data } from '@/types/signup.type';

interface BusinessSignupStep1Props {
  initialData?: SignupStep1Data;
  onNextAction: (data: SignupStep1Data) => void;
  onViewTermsAction: (termType: string) => void;
}

export default function BusinessSignupStep1({ 
  initialData, 
  onNextAction, 
  onViewTermsAction 
}: BusinessSignupStep1Props) {
  const [agreements, setAgreements] = useState(
    initialData?.agreements || {
      all: false,
      termsOfService: false,
      privacyPolicy: false,
      personalInfo: false,
      thirdParty: false,
      marketing: false,
    }
  );

  useEffect(() => {
    if (initialData?.agreements) {
      setAgreements(initialData.agreements);
    }
  }, [initialData]);

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      termsOfService: checked,
      privacyPolicy: checked,
      personalInfo: checked,
      thirdParty: checked,
      marketing: checked,
    });
  };

  const handleIndividualAgreement = (key: keyof Omit<typeof agreements, 'all'>, checked: boolean) => {
    const newAgreements = {
      ...agreements,
      [key]: checked,
    };

    const allChecked = Object.entries(newAgreements)
      .filter(([k]) => k !== 'all')
      .every(([, value]) => value);

    setAgreements({
      ...newAgreements,
      all: allChecked,
    });
  };

  const isRequiredAgreementsChecked = 
    agreements.termsOfService && 
    agreements.privacyPolicy && 
    agreements.personalInfo &&
    agreements.thirdParty;

  const getProgressPercentage = () => {
    const checkedCount = [
      agreements.termsOfService,
      agreements.privacyPolicy,
      agreements.personalInfo,
      agreements.thirdParty
    ].filter(Boolean).length;

    if (checkedCount === 0) return 0;
    if (checkedCount === 1) return 15;
    if (checkedCount === 2) return 35;
    if (checkedCount === 3) return 65;
    return 100;
  };
  
  const progressPercentage = getProgressPercentage();

  const handleNext = () => {
    if (!isRequiredAgreementsChecked) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }
    onNextAction({ agreements });
  };

  const handleViewTerms = (type: string) => {
    onViewTermsAction(type);
  };

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
            <p>회원가입 정보동의</p>
          </h1>
          <div className="flex items-center justify-between text-body-2 mobile:text-body-3">
            <div />
            <span className="text-primary-500">{progressPercentage}%</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-component-alternative rounded-full h-2">
              <div className="bg-primary-300 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="pb-4 border-b border-line-400"
          whileTap={{ scale: 0.98 }}
        >
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={agreements.all}
                onChange={(e) => handleAllAgreement(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                {agreements.all && (
                  <motion.svg
                    className="w-4 h-4 text-component-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-title-3 text-label-900">전체 동의</span>
          </label>
        </motion.div>

        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-between pt-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="flex items-center cursor-pointer flex-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreements.termsOfService}
                  onChange={(e) => handleIndividualAgreement('termsOfService', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                  {agreements.termsOfService && (
                    <motion.svg
                      className="w-4 h-4 text-component-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-body-1 text-label-700">
                서비스 이용약관 동의 (필수)
              </span>
            </label>
            <button 
              onClick={() => handleViewTerms('서비스 이용약관')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label className="flex items-center cursor-pointer flex-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreements.privacyPolicy}
                  onChange={(e) => handleIndividualAgreement('privacyPolicy', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                  {agreements.privacyPolicy && (
                    <motion.svg
                      className="w-4 h-4 text-component-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-body-1 text-label-700">
                개인(신용)정보 수집 및 이용동의 (필수)
              </span>
            </label>
            <button 
              onClick={() => handleViewTerms('개인정보 수집 및 이용')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label className="flex items-center cursor-pointer flex-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreements.personalInfo}
                  onChange={(e) => handleIndividualAgreement('personalInfo', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                  {agreements.personalInfo && (
                    <motion.svg
                      className="w-4 h-4 text-component-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-body-1 text-label-700">
                개인(신용)정보 제공 및 위탁동의 (필수)
              </span>
            </label>
            <button 
              onClick={() => handleViewTerms('개인정보 제공 및 위탁')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <label className="flex items-center cursor-pointer flex-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreements.thirdParty}
                  onChange={(e) => handleIndividualAgreement('thirdParty', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                  {agreements.thirdParty && (
                    <motion.svg
                      className="w-4 h-4 text-component-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-body-1 text-label-700">
                개인(신용)정보 조회 동의 (필수)
              </span>
            </label>
            <button 
              onClick={() => handleViewTerms('개인정보 조회')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <label className="flex items-center cursor-pointer flex-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) => handleIndividualAgreement('marketing', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200`}>
                  {agreements.marketing && (
                    <motion.svg
                      className="w-4 h-4 text-component-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-body-1 text-label-700">
                마케팅 활용 및 광고성 정보 수신동의
              </span>
            </label>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={handleNext}
            disabled={!isRequiredAgreementsChecked}
            className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isRequiredAgreementsChecked
                ? 'bg-primary-300 hover:bg-primary-400 shadow-lg cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            whileTap={{ scale: isRequiredAgreementsChecked ? 0.98 : 1 }}
            whileHover={{ scale: isRequiredAgreementsChecked ? 1.02 : 1 }}
          >
            다음
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}