'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDiagnosisStore } from '@/features/diagnosis/store/diagnosisStore';
import Layout from '@/shared/components/layout/Layout';
import { Header } from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CheckCircle, AlertCircle, Briefcase, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DiagnosisData } from '@/features/diagnosis/store/diagnosisStore';
import { diagnosisApi } from '@/features/diagnosis/api/diagnosisApi';
import { DiagnosisAnswerResponse } from '@/shared/types/api';

interface MatchingResult {
  score: number;
  strengths: string[];
  improvements: string[];
  recommendedJobs: string[];
}

const DiagnosisResultClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, userType, logout } = useAuth();
  const { diagnosisId } = useDiagnosisStore();
  const [result, setResult] = useState<MatchingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosisResult = async () => {
      try {
        // URL 쿼리 파라미터에서 ID를 가져오거나 store에서 가져옴
        const idFromQuery = searchParams.get('id');
        const id = idFromQuery ? parseInt(idFromQuery, 10) : diagnosisId;

        if (!id) {
          setError('진단 결과를 찾을 수 없습니다.');
          return;
        }

        // API 호출
        const response: DiagnosisAnswerResponse = await diagnosisApi.getDiagnosisAnswer(id);

        // 응답 데이터를 DiagnosisData 형태로 변환
        const diagnosisData = convertResponseToDiagnosisData(response);

        // 매칭 점수 계산
        const calculatedResult = calculateMatchingScore(diagnosisData);
        setResult(calculatedResult);
      } catch (err) {
        console.error('Failed to fetch diagnosis result:', err);
        setError('진단 결과를 불러오는데 실패했습니다.');
      }
    };

    fetchDiagnosisResult();
  }, [searchParams, diagnosisId]);

  const handleLogout = async () => {
    await logout();
  };

  const handleRestart = () => {
    router.push('/diagnosis');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleJobSearch = () => {
    router.push('/jobs');
  };

  if (error) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-body-1 text-slate-700">{error}</p>
            <motion.button
              onClick={() => router.push('/diagnosis')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              다시 진단하기
            </motion.button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-body-2 text-slate-500">결과를 분석하는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 매칭 점수 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center"
          >
            <h1 className="text-[20px] md:text-title-2 font-bold text-slate-900 mb-4">
              진단 결과가 나왔어요! 🎉
            </h1>
            <div className="relative inline-block">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * result.score) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600">{result.score}%</div>
                  <div className="text-caption-1 text-slate-500">준비도</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-body-1 text-slate-700">
              당신의 한국 취업 준비도는 <span className="font-bold text-blue-600">{result.score}%</span>입니다!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 강점 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-emerald-500" size={24} />
                <h2 className="text-[17px] md:text-title-4 font-bold text-slate-900">당신의 강점</h2>
              </div>
              <ul className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-500 text-xl leading-6 flex-shrink-0">✓</span>
                    <span className="text-body-2 text-slate-700 leading-6">{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 개선 사항 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-amber-500" size={24} />
                <h2 className="text-[17px] md:text-title-4 font-bold text-slate-900">개선할 점</h2>
              </div>
              <ul className="space-y-3">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl leading-6 flex-shrink-0">!</span>
                    <span className="text-body-2 text-slate-700 leading-6">{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 추천 직무 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="text-blue-600" size={24} />
              <h2 className="text-[17px] md:text-title-4 font-bold text-slate-900">추천 직무</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.recommendedJobs.map((job, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"
                >
                  <span className="text-body-2 font-medium text-blue-700">{job}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg shadow-lg p-8 text-center text-white"
          >
            <TrendingUp size={48} className="mx-auto mb-4" />
            <h2 className="text-[18px] md:text-title-3 font-bold mb-2">
              지금 바로 시작하세요!
            </h2>
            <p className="text-body-2 mb-6 opacity-90">
              회원가입하고 맞춤 공고를 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <motion.button
                  onClick={handleSignup}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-all shadow-md cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  회원가입하고 맞춤 공고 받기
                </motion.button>
              )}
              <motion.button
                onClick={handleJobSearch}
                className="px-8 py-3 bg-white/20 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/30 transition-all border-2 border-white cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                채용 공고 둘러보기
              </motion.button>
            </div>
          </motion.div>

          {/* 다시 하기 */}
          <div className="mt-6 text-center">
            <motion.button
              onClick={handleRestart}
              className="text-body-2 text-slate-500 hover:text-slate-700 underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              진단 다시 하기
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// TODO(human): Map API response questions to DiagnosisData fields
function convertResponseToDiagnosisData(response: DiagnosisAnswerResponse): Partial<DiagnosisData> {
  // This is a placeholder mapping. Update based on actual question-to-field mapping
  return {
    currentLocation: response.q1_answer,
    koreanLevel: response.q2_answer,
    visaStatus: response.q3_answer,
    workExperience: response.q4_answer,
    jobField: response.q5_answer,
    education: response.q6_answer,
    desiredSalary: response.q7_answer,
    employmentType: response.q8_answer,
    companySize: response.q9_answer,
    startDate: response.q10_answer,
    // Add more mappings as needed
  };
}

// TODO(human): Implement matching score calculation logic
function calculateMatchingScore(data: Partial<DiagnosisData>): MatchingResult {
  // Placeholder implementation
  let score = 50;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendedJobs: string[] = [];

  // Example scoring logic
  if (data.currentLocation === 'korea') {
    score += 15;
    strengths.push('한국에 이미 거주하고 계셔서 즉시 근무가 가능합니다');
  } else {
    improvements.push('한국 입국 및 정착 준비가 필요합니다');
  }

  if (data.koreanLevel === 'native' || data.koreanLevel === 'topik6') {
    score += 20;
    strengths.push('뛰어난 한국어 실력으로 원활한 업무 소통이 가능합니다');
  } else if (data.koreanLevel === 'topik1') {
    score -= 10;
    improvements.push('한국어 실력 향상이 필요합니다');
  }

  if (data.visaStatus === 'have' || data.visaStatus === 'permanent') {
    score += 15;
    strengths.push('비자 문제가 없어 바로 취업이 가능합니다');
  } else if (data.visaStatus === 'need') {
    improvements.push('취업 비자 지원이 가능한 회사를 찾아야 합니다');
  }

  // Recommended jobs based on job field
  const jobFieldMapping: Record<string, string[]> = {
    it: ['웹 개발자', '소프트웨어 엔지니어', 'DevOps', '데이터 분석가'],
    marketing: ['마케팅 매니저', '디지털 마케터', '영업 담당자', 'SNS 마케터'],
    design: ['UI/UX 디자이너', '그래픽 디자이너', '브랜드 디자이너', '일러스트레이터'],
    education: ['한국어 강사', '교육 컨텐츠 개발자', '학원 강사', '기업 교육 담당자'],
    manufacturing: ['생산 관리', '품질 관리', '기계 엔지니어', '공정 엔지니어'],
    service: ['호텔 매니저', '레스토랑 관리자', '고객 서비스', '관광 가이드'],
  };

  recommendedJobs.push(...(jobFieldMapping[data.jobField as string] || ['일반 사무직', '영업직', '서비스직', '기술직']));

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Add generic improvements if needed
  if (improvements.length === 0) {
    improvements.push('현재 상태를 유지하며 꾸준히 준비하세요');
  }

  // Add generic strengths if needed
  if (strengths.length < 2) {
    strengths.push('취업을 위한 명확한 목표와 계획을 가지고 있습니다');
  }

  return {
    score,
    strengths,
    improvements,
    recommendedJobs,
  };
}

export default DiagnosisResultClient;
