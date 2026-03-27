'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDiagnosisStore } from '@/features/diagnosis/store/diagnosisStore';
import Layout from '@/shared/components/layout/Layout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CheckCircle, AlertCircle, Briefcase, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DiagnosisData } from '@/features/diagnosis/store/diagnosisStore';
import { diagnosisApi } from '@/features/diagnosis/api/diagnosisApi';
import { DiagnosisAnswerResponse } from '@/shared/types/api';
import { cn } from '@/shared/lib/utils/utils';
import { RecommendedJobsSection } from '@/features/diagnosis/components/RecommendedJobsSection';
import { useTranslations } from 'next-intl';

interface MatchingResult {
  score: number;
  strengths: string[];
  improvements: string[];
  recommendedJobs: string[];
}

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

const DiagnosisResultClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { diagnosisId } = useDiagnosisStore();
  const [result, setResult] = useState<MatchingResult | null>(null);
  const [diagnosisData, setDiagnosisData] = useState<Partial<DiagnosisData> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('diagnosis.result');

  // TODO(human): Implement matching score calculation logic
  const calculateMatchingScore = (data: Partial<DiagnosisData>): MatchingResult => {
    // Placeholder implementation
    let score = 50;
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendedJobs: string[] = [];

    // Example scoring logic
    if (data.currentLocation === 'korea') {
      score += 15;
      strengths.push(t('strengths.inKorea'));
    } else {
      improvements.push(t('improvements.relocation'));
    }

    if (data.koreanLevel === 'native' || data.koreanLevel === 'topik6') {
      score += 20;
      strengths.push(t('strengths.koreanFluent'));
    } else if (data.koreanLevel === 'topik1') {
      score -= 10;
      improvements.push(t('improvements.koreanImprove'));
    }

    if (data.visaStatus === 'have' || data.visaStatus === 'permanent') {
      score += 15;
      strengths.push(t('strengths.visaReady'));
    } else if (data.visaStatus === 'need') {
      improvements.push(t('improvements.visa'));
    }

    // Recommended jobs based on job field
    const jobFieldMapping: Record<string, string[]> = {
      it: t.raw('recommendedJobsByField.it') as string[],
      marketing: t.raw('recommendedJobsByField.marketing') as string[],
      design: t.raw('recommendedJobsByField.design') as string[],
      education: t.raw('recommendedJobsByField.education') as string[],
      manufacturing: t.raw('recommendedJobsByField.manufacturing') as string[],
      service: t.raw('recommendedJobsByField.service') as string[],
    };

    recommendedJobs.push(...(jobFieldMapping[data.jobField as string] || (t.raw('recommendedJobsByField.default') as string[])));

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Add generic improvements if needed
    if (improvements.length === 0) {
      improvements.push(t('improvements.keepGoing'));
    }

    // Add generic strengths if needed
    if (strengths.length < 2) {
      strengths.push(t('strengths.goalOriented'));
    }

    return {
      score,
      strengths,
      improvements,
      recommendedJobs,
    };
  };

  useEffect(() => {
    const fetchDiagnosisResult = async () => {
      try {
        // URL 쿼리 파라미터에서 ID를 가져오거나 store에서 가져옴
        const idFromQuery = searchParams.get('id');
        const id = idFromQuery ? parseInt(idFromQuery, 10) : diagnosisId;

        if (!id) {
          setError(t('notFound'));
          return;
        }

        // API 호출
        const response: DiagnosisAnswerResponse = await diagnosisApi.getDiagnosisAnswer(id);

        // 응답 데이터를 DiagnosisData 형태로 변환
        const converted = convertResponseToDiagnosisData(response);

        // 매칭 점수 계산
        const calculatedResult = calculateMatchingScore(converted);
        setDiagnosisData(converted);
        setResult(calculatedResult);
      } catch (err) {
        setError(t('fetchError'));
      }
    };

    fetchDiagnosisResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, diagnosisId]);

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
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-status-error-bg rounded-full mb-4">
              <AlertCircle className="text-status-error w-8 h-8" />
            </div>
            <p className="text-body-1 text-label-700 mb-2">{error}</p>
            <p className="text-body-3 text-label-500 mb-6">
              {t('retryHint')}
            </p>
            <motion.button
              onClick={() => router.push('/diagnosis')}
              className={cn(
                'px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg',
                'hover:bg-primary-700 transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('retry')}
            </motion.button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm text-center space-y-4">
              <div className="skeleton-shimmer rounded-full w-24 h-24 sm:w-32 sm:h-32 mx-auto" />
              <div className="skeleton-shimmer h-8 w-48 rounded mx-auto" />
              <div className="skeleton-shimmer h-4 w-64 rounded mx-auto" />
              <p className="text-caption-1 text-label-400 mt-4">{t('analyzing')}</p>
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
      <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 매칭 점수 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'bg-white rounded-2xl border border-line-400 shadow-sm p-6 sm:p-8 lg:p-10',
              'text-center mb-6 sm:mb-8'
            )}
          >
            <h1 className="text-title-3 sm:text-title-2 lg:text-title-1 font-extrabold text-label-900 mb-6">
              {t('resultTitle')}
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
                  <div className="text-title-2 sm:text-title-1 font-bold text-primary-600">{result.score}%</div>
                  <div className="text-caption-2 text-label-500 mt-1">{t('readinessLabel')}</div>
                </div>
              </div>
            </div>
            <p className="text-body-3 sm:text-body-1 text-label-700">
              {t.rich('readinessMessage', {
                score: result.score,
                bold: (chunks) => <span className="font-bold text-primary-600">{chunks}</span>,
              })}
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
                'bg-white rounded-xl border border-line-400 shadow-sm p-5 sm:p-6 lg:p-7'
              )}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-status-correct-bg rounded-lg">
                  <CheckCircle className="text-status-correct" size={20} />
                </div>
                <h2 className="text-body-1 sm:text-title-5 font-bold text-label-900">{t('strengthsTitle')}</h2>
              </div>
              <ul className="space-y-2.5">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-status-correct font-bold mt-0.5">✓</span>
                    <span className="text-caption-1 sm:text-body-3 text-label-700 leading-relaxed">{strength}</span>
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
                'bg-white rounded-xl border border-line-400 shadow-sm p-5 sm:p-6 lg:p-7'
              )}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-status-caution-bg rounded-lg">
                  <AlertCircle className="text-status-caution" size={20} />
                </div>
                <h2 className="text-body-1 sm:text-title-5 font-bold text-label-900">{t('improvementsTitle')}</h2>
              </div>
              <ul className="space-y-2.5">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-status-caution font-bold mt-0.5">!</span>
                    <span className="text-caption-1 sm:text-body-3 text-label-700 leading-relaxed">{improvement}</span>
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
              'bg-white rounded-xl border border-line-400 shadow-sm p-5 sm:p-6 lg:p-7 mb-6 sm:mb-8'
            )}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                <Briefcase className="text-primary-600" size={20} />
              </div>
              <h2 className="text-body-1 sm:text-title-5 font-bold text-label-900">{t('recommendedJobsTitle')}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {result.recommendedJobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'px-3 py-2.5 bg-primary-50 border border-blue-100 rounded-lg text-center',
                    'hover:bg-primary-100 transition-colors duration-150'
                  )}
                >
                  <span className="text-caption-2 sm:text-caption-1 font-semibold text-primary-700 line-clamp-2">
                    {job}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 추천 채용 공고 */}
          <RecommendedJobsSection diagnosisData={diagnosisData ?? undefined} />

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10',
              'text-center text-white mb-6'
            )}
          >
            <TrendingUp size={40} className="mx-auto mb-4 sm:mb-5" />
            <h2 className="text-title-4 sm:text-title-3 font-extrabold mb-2">
              {t('ctaTitle')}
            </h2>
            <p className="text-caption-1 sm:text-body-3 opacity-90 mb-6">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthenticated && (
                <motion.button
                  onClick={handleSignup}
                  className={cn(
                    'px-6 py-2.5 bg-white text-primary-600 font-semibold rounded-lg',
                    'hover:bg-label-50 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                    'text-body-3 sm:text-body-1'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('signupButton')}
                </motion.button>
              )}
              <motion.button
                onClick={handleJobSearch}
                className={cn(
                  'px-6 py-2.5 bg-white/20 backdrop-blur text-white font-semibold rounded-lg',
                  'hover:bg-white/30 transition-colors duration-150 border border-white/50 cursor-pointer',
                  'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                  'text-body-3 sm:text-body-1'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('browseJobsButton')}
              </motion.button>
            </div>
          </motion.div>

          {/* 다시 하기 */}
          <div className="text-center">
            <motion.button
              onClick={handleRestart}
              className={cn(
                'text-caption-1 sm:text-body-3 text-label-500 hover:text-label-700',
                'underline cursor-pointer font-medium'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('retryButton')}
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosisResultClient;
