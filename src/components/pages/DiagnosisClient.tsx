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

const TOTAL_STEPS = 4;

const DiagnosisClient = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, userType, logout } = useAuth({ required: false });
  const { currentStep, diagnosisData, setStep, updateData } = useDiagnosisStore();

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

  const handleSession4Next = (data: Partial<DiagnosisData>) => {
    updateData(data);
    router.push('/diagnosis/result');
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
