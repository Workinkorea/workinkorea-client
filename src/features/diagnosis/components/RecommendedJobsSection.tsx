'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import { postsApi } from '@/features/jobs/api/postsApi';
import JobCard from '@/features/jobs/components/JobCard';
import { cn } from '@/shared/lib/utils/utils';
import type { DiagnosisData } from '@/features/diagnosis/store/diagnosisStore';

interface RecommendedJobsSectionProps {
  diagnosisData?: Partial<DiagnosisData>;
}

export function RecommendedJobsSection({ diagnosisData }: RecommendedJobsSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommended-jobs', diagnosisData?.jobField, diagnosisData?.employmentType],
    queryFn: () => postsApi.getPublicCompanyPosts({ page: 1, limit: 8 }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Filter by employmentType if available, then pick up to 4
  const jobs = (() => {
    const posts = data?.company_posts ?? [];
    if (!diagnosisData?.employmentType) return posts.slice(0, 4);
    const filtered = posts.filter(
      (p) => p.employment_type === diagnosisData.employmentType
    );
    return (filtered.length > 0 ? filtered : posts).slice(0, 4);
  })();

  // Don't render section on API error or if no posts
  if (isError || (!isLoading && jobs.length === 0)) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="mb-6 sm:mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
            <Briefcase className="text-blue-600" size={18} />
          </div>
          <h2 className="text-[16px] sm:text-[17px] font-bold text-slate-900">추천 채용 공고</h2>
        </div>
        <Link
          href="/jobs"
          className="text-caption-2 sm:text-caption-1 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
        >
          전체 보기
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Job Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="skeleton-shimmer w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton-shimmer h-3 w-20 rounded" />
                  <div className="skeleton-shimmer h-3 w-12 rounded" />
                </div>
              </div>
              <div className="skeleton-shimmer h-5 w-full rounded" />
              <div className="skeleton-shimmer h-4 w-3/4 rounded" />
              <div className="skeleton-shimmer h-5 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className={cn(
            'flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0',
            'sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0',
            'lg:grid-cols-4'
          )}>
            {jobs.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="min-w-[260px] sm:min-w-0"
              >
                <JobCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-5 sm:mt-6 text-center">
            <Link href="/jobs">
              <motion.span
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white',
                  'rounded-xl font-semibold text-sm cursor-pointer',
                  'hover:bg-blue-700 transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                이 공고들에 바로 지원하기
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </div>
        </>
      )}
    </motion.section>
  );
}
