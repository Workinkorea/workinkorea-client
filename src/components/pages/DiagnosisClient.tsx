'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { ProgressBar } from '@/components/diagnosis/ProgressBar';
import { Session1BasicInfo } from '@/components/diagnosis/Session1BasicInfo';
import { Session2CareerSkills } from '@/components/diagnosis/Session2CareerSkills';
import { Session3Preferences } from '@/components/diagnosis/Session3Preferences';
import { Session4Matching } from '@/components/diagnosis/Session4Matching';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { DiagnosisData } from '@/store/diagnosisStore';
import { diagnosisApi } from '@/lib/api/diagnosis';
import { DiagnosisAnswerRequest } from '@/lib/api/types';
import { useState } from 'react';

const TOTAL_STEPS = 4;

const DiagnosisClient = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, userType, logout } = useAuth({ required: false });
  const { currentStep, diagnosisData, setStep, updateData, setDiagnosisId } = useDiagnosisStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSession1Next = (data: Partial<DiagnosisData>) => {
    updateData(data);
    setStep(2);
  };

  const handleSession2Next = (data: Partial<DiagnosisData>) => {
    updateData(data);
    setStep(3);
  };

  const handleSession3Next = (data: Partial<DiagnosisData>) => {
    updateData(data);
    setStep(4);
  };

  const convertToApiRequest = (data: Partial<DiagnosisData>): DiagnosisAnswerRequest => {
    const languagesStr = data.languages?.map(l => `${l.language}(${l.level})`).join(', ') || '';
    const challengesStr = data.challenges?.join(', ') || '';

    return {
      total_score: 0,
      q1_answer: data.currentLocation || '',
      q2_answer: data.koreanLevel || '',
      q3_answer: data.visaStatus || '',
      q4_answer: data.workExperience || '',
      q5_answer: data.jobField || '',
      q6_answer: data.education || '',
      q7_answer: languagesStr,
      q8_answer: data.desiredSalary || '',
      q9_answer: data.employmentType || '',
      q10_answer: data.companySize || '',
      q11_answer: data.startDate || '',
      q12_answer: challengesStr,
      q13_answer: data.email || '',
      q14_answer: '',
      q15_answer: '',
    };
  };

  const handleSession4Next = async (data: Partial<DiagnosisData>) => {
    updateData(data);
    setIsSubmitting(true);

    try {
      const finalData = { ...diagnosisData, ...data };
      const apiRequest = convertToApiRequest(finalData);

      const response = await diagnosisApi.submitAnswer(apiRequest);

      // Save diagnosis ID to store
      setDiagnosisId(response.id);

      // Redirect to result page with ID
      router.push(`/diagnosis/result?id=${response.id}`);
    } catch (error) {
      console.error('Failed to submit diagnosis:', error);
      alert('진단 결과 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, currentStep - 1));
  };

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-background-alternative py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-title-2 font-bold text-label-900 mb-2">
              한국 취업 자가진단
            </h1>
            <p className="text-body-2 text-label-500">
              당신에게 딱 맞는 직업을 찾기 위한 몇 가지 질문에 답해주세요
            </p>
          </motion.div>

          <div className="bg-white rounded-lg shadow-normal p-6 md:p-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Session1BasicInfo
                  key="session1"
                  initialData={diagnosisData}
                  onNext={handleSession1Next}
                />
              )}
              {currentStep === 2 && (
                <Session2CareerSkills
                  key="session2"
                  initialData={diagnosisData}
                  onNext={handleSession2Next}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <Session3Preferences
                  key="session3"
                  initialData={diagnosisData}
                  onNext={handleSession3Next}
                  onBack={handleBack}
                />
              )}
              {currentStep === 4 && (
                <Session4Matching
                  key="session4"
                  initialData={diagnosisData}
                  onNext={handleSession4Next}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosisClient;
