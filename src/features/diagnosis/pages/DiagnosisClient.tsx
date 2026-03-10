'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiagnosisStore } from '@/features/diagnosis/store/diagnosisStore';
import { DiagnosisStepProgress } from '@/features/diagnosis/components/DiagnosisStepProgress';
import { Session1BasicInfo } from '@/features/diagnosis/components/Session1BasicInfo';
import { Session2CareerSkills } from '@/features/diagnosis/components/Session2CareerSkills';
import { Session3Preferences } from '@/features/diagnosis/components/Session3Preferences';
import { Session4Matching } from '@/features/diagnosis/components/Session4Matching';
import Layout from '@/shared/components/layout/Layout';
import { Header } from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DiagnosisData } from '@/features/diagnosis/store/diagnosisStore';
import { diagnosisApi } from '@/features/diagnosis/api/diagnosisApi';
import { DiagnosisAnswerRequest } from '@/shared/types/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/utils';

const TOTAL_STEPS = 4;

const DiagnosisClient = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, userType, logout } = useAuth();
  const { currentStep, diagnosisData, setStep, updateData, setDiagnosisId, reset } = useDiagnosisStore();
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

      setDiagnosisId(response.id);
      reset(); // sessionStorage 임시 저장 데이터 초기화
      router.push(`/diagnosis/result?id=${response.id}`);
    } catch (error) {
      toast.error('진단 결과 제출에 실패했습니다. 다시 시도해주세요.');
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
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold text-slate-900 mb-2">
              한국 취업 자가진단
            </h1>
            <p className="text-[13px] sm:text-sm text-slate-500">
              당신에게 딱 맞는 직업을 찾기 위한 맞춤형 진단을 시작해보세요
            </p>
          </motion.div>

          {/* Progress Indicator (Mobile: horizontal scroll, Desktop: full) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6',
              'overflow-x-auto sm:overflow-visible'
            )}
          >
            <DiagnosisStepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </motion.div>

          {/* Question Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              'bg-white border border-slate-200 rounded-xl shadow-sm',
              'p-5 sm:p-7 lg:p-8'
            )}
          >
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
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosisClient;
