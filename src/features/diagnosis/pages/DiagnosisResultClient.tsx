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
import { cn } from '@/shared/lib/utils/utils';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <AlertCircle className="text-red-500 w-8 h-8" />
            </div>
            <p className="text-base text-slate-700 mb-2">{error}</p>
            <p className="text-sm text-slate-500 mb-6">
              진단을 다시 시도하거나 처음부터 시작해보세요
            </p>
            <motion.button
              onClick={() => router.push('/diagnosis')}
              className={cn(
                'px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg',
                'hover:bg-blue-700 transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
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
        <div className="min-h-screen bg-slate-50 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm text-center space-y-4">
              <div className="skeleton-shimmer rounded-full w-24 h-24 sm:w-32 sm:h-32 mx-auto" />
              <div className="skeleton-shimmer h-8 w-48 rounded mx-auto" />
              <div className="skeleton-shimmer h-4 w-64 rounded mx-auto" />
              <p className="text-[13px] text-slate-400 mt-4">결과를 분석하는 중...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
                  <div className="skeleton-shimmer h-5 w-32 rounded" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="skeleton-shimmer h-4 w-full rounded" />
                  ))}
                </div>
              ))}
            </div>
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
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 매칭 점수 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10',
              'text-center mb-6 sm:mb-8'
            )}
          >
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold text-slate-900 mb-6">
              진단 결과가 나왔어요! 🎉
            </h1>
            <div className="inline-grid w-32 h-32 sm:w-40 sm:h-40 mb-6">
              <svg className="col-start-1 row-start-1 transform -rotate-90 w-32 h-32 sm:w-40 sm:h-40">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={352}
                  initial={{ strokeDashoffset: 352 }}
                  animate={{ strokeDashoffset: 352 - (352 * result.score) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="col-start-1 row-start-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{result.score}%</div>
                  <div className="text-xs text-slate-500 mt-1">준비도</div>
                </div>
              </div>
            </div>
            <p className="text-[14px] sm:text-base text-slate-700">
              당신의 한국 취업 준비도는 <span className="font-bold text-blue-600">{result.score}%</span>입니다!
            </p>
          </motion.div>

          {/* 강점 & 개선 사항 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* 강점 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7'
              )}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-lg">
                  <CheckCircle className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-[16px] sm:text-[17px] font-bold text-slate-900">당신의 강점</h2>
              </div>
              <ul className="space-y-2.5">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 개선 사항 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                'bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7'
              )}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-50 rounded-lg">
                  <AlertCircle className="text-amber-600" size={20} />
                </div>
                <h2 className="text-[16px] sm:text-[17px] font-bold text-slate-900">개선할 점</h2>
              </div>
              <ul className="space-y-2.5">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-0.5">!</span>
                    <span className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">{improvement}</span>
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
            className={cn(
              'bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7 mb-6 sm:mb-8'
            )}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                <Briefcase className="text-blue-600" size={20} />
              </div>
              <h2 className="text-[16px] sm:text-[17px] font-bold text-slate-900">추천 직무</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {result.recommendedJobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-center',
                    'hover:bg-blue-100 transition-colors duration-150'
                  )}
                >
                  <span className="text-[12px] sm:text-[13px] font-semibold text-blue-700 line-clamp-2">
                    {job}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10',
              'text-center text-white mb-6'
            )}
          >
            <TrendingUp size={40} className="mx-auto mb-4 sm:mb-5" />
            <h2 className="text-[20px] sm:text-[22px] font-extrabold mb-2">
              지금 바로 시작하세요!
            </h2>
            <p className="text-[13px] sm:text-sm opacity-90 mb-6">
              회원가입하고 당신에게 맞는 채용 공고를 확인해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthenticated && (
                <motion.button
                  onClick={handleSignup}
                  className={cn(
                    'px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-lg',
                    'hover:bg-slate-50 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                    'text-sm sm:text-base'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  회원가입하기
                </motion.button>
              )}
              <motion.button
                onClick={handleJobSearch}
                className={cn(
                  'px-6 py-2.5 bg-white/20 backdrop-blur text-white font-semibold rounded-lg',
                  'hover:bg-white/30 transition-colors duration-150 border border-white/50 cursor-pointer',
                  'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                  'text-sm sm:text-base'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                채용 공고 둘러보기
              </motion.button>
            </div>
          </motion.div>

          {/* 다시 하기 */}
          <div className="text-center">
            <motion.button
              onClick={handleRestart}
              className={cn(
                'text-[13px] sm:text-sm text-slate-500 hover:text-slate-700',
                'underline cursor-pointer font-medium'
              )}
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
