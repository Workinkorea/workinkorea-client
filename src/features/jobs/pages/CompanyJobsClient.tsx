'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Edit3, Plus, MapPin, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { postsApi } from '@/features/jobs/api/postsApi';
import type { CompanyPost } from '@/shared/types/api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/shared/lib/utils/utils';

function CompanyJobsClient() {
  const t = useTranslations('jobs.manage');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // 인증 체크 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/company-login');
    }
  }, [isAuthenticated, authLoading, router]);

  // 기업 공고 목록 조회
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['myCompanyPosts'],
    queryFn: async () => {
      const response = await postsApi.getMyCompanyPosts();
      return response.company_posts;
    },
    retry: 1,
  });

  // 로딩 상태 처리
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white py-8 sm:py-12">
          <div className="page-container space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
                <div className="skeleton-shimmer h-4 w-56 rounded" />
              </div>
              <div className="skeleton-shimmer h-10 w-32 rounded-lg shrink-0" />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-line-200 rounded-lg p-4 space-y-3">
                  <div className="skeleton-shimmer h-5 w-2/3 rounded" />
                  <div className="flex gap-3 flex-wrap">
                    <div className="skeleton-shimmer h-3 w-24 rounded" />
                    <div className="skeleton-shimmer h-3 w-16 rounded" />
                    <div className="skeleton-shimmer h-3 w-20 rounded" />
                  </div>
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
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="page-container space-y-6">
          {/* 페이지 헤더 */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-title-3 sm:text-title-2 font-extrabold text-label-900">{t('title')}</h1>
              <p className="text-caption-1 sm:text-body-3 text-label-500 mt-1">
                {t('subtitle')}
              </p>
            </div>
            <button
              onClick={() => router.push('/company/posts/create')}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-body-3 font-semibold',
                'hover:bg-primary-700 transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'shadow-[0_4px_14px_rgba(37,99,235,0.25)] shrink-0'
              )}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{t('createBtn')}</span>
              <span className="sm:hidden">{t('createBtnShort')}</span>
            </button>
          </motion.div>

          {/* 공고 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {postsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white border border-line-400 rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="space-y-3">
                      <div className="skeleton-shimmer h-5 w-2/3 rounded" />
                      <div className="flex gap-3 flex-wrap">
                        <div className="skeleton-shimmer h-3 w-24 rounded" />
                        <div className="skeleton-shimmer h-3 w-16 rounded" />
                      </div>
                      <div className="skeleton-shimmer h-3 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : postsError ? (
              <div className="bg-white rounded-xl p-8 sm:p-12 shadow-sm text-center">
                <p className="text-status-error font-medium mb-2">{t('loadError')}</p>
                <p className="text-caption-1 text-label-500 mb-6">
                  {postsError instanceof Error ? postsError.message : t('unknownError')}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-body-3 font-semibold',
                    'hover:bg-primary-700 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  )}
                >
                  {tCommon('button.retry')}
                </button>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-title-5 font-semibold text-label-900">
                    {t('totalCount', { count: posts.length })}
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {posts.map((post: CompanyPost) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'bg-white border border-line-400 rounded-xl p-4 sm:p-6 shadow-sm',
                        'hover:border-primary-200 hover:shadow-md transition-all duration-200 cursor-pointer'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-body-1 sm:text-title-5 font-bold text-label-900 mb-3 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="space-y-2 mb-3">
                            <div className="flex flex-wrap gap-2 text-caption-2 text-label-600">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={16} className="shrink-0" />
                                {post.work_location}
                              </span>
                              <span className="px-2 py-1 bg-label-100 rounded text-label-600 font-medium">
                                {post.employment_type}
                              </span>
                            </div>
                            <p className="text-caption-2 text-label-500">
                              {post.salary ? `${post.salary.toLocaleString()}원` : t('negotiable')}
                            </p>
                            <p className="text-caption-2 text-label-400">
                              {post.start_date} ~ {post.end_date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {new Date(post.end_date) > new Date() ? (
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold',
                                'bg-status-correct-bg text-status-correct border border-emerald-100'
                              )}>
                                {t('statusActive')}
                              </span>
                            ) : (
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold',
                                'bg-label-100 text-label-500 border border-line-400'
                              )}>
                                {t('statusExpired')}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                          className={cn(
                            'p-2 text-label-400 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150',
                            'rounded-lg shrink-0 focus:outline-none cursor-pointer'
                          )}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit3 size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 sm:p-12 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-full mb-4">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                </div>
                <p className="text-label-600 font-medium mb-1">{t('noPostsTitle')}</p>
                <p className="text-caption-1 text-label-500 mb-6">
                  {t('noPostsSubtitle')}
                </p>
                <motion.button
                  onClick={() => router.push('/company/posts/create')}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-body-3 font-semibold',
                    'hover:bg-primary-700 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={18} />
                  {t('firstPostBtn')}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default CompanyJobsClient;
