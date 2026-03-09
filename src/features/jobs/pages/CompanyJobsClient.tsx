'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Edit3, Plus, MapPin, FileText } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import { Header } from '@/shared/components/layout/Header';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/shared/lib/utils/utils';

function CompanyJobsClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth();

  // 인증 체크 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/company-login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
  };

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
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
                <div className="skeleton-shimmer h-4 w-56 rounded" />
              </div>
              <div className="skeleton-shimmer h-10 w-32 rounded-lg flex-shrink-0" />
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-3">
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
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 페이지 헤더 */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900">채용공고 관리</h1>
              <p className="text-[13px] sm:text-sm text-slate-500 mt-1">
                등록한 채용 공고를 관리하고 수정하세요
              </p>
            </div>
            <button
              onClick={() => router.push('/company/posts/create')}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold',
                'hover:bg-blue-700 transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'shadow-[0_4px_14px_rgba(37,99,235,0.25)] flex-shrink-0'
              )}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">새 공고 등록</span>
              <span className="sm:hidden">등록</span>
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
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
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
                <p className="text-red-500 font-medium mb-2">공고를 불러오는 데 실패했습니다.</p>
                <p className="text-[13px] text-slate-500 mb-6">
                  {postsError instanceof Error ? postsError.message : '알 수 없는 오류가 발생했습니다.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold',
                    'hover:bg-blue-700 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  )}
                >
                  다시 시도
                </button>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    전체 공고 ({posts.length}개)
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm',
                        'hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[16px] sm:text-[17px] font-bold text-slate-900 mb-3 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="space-y-2 mb-3">
                            <div className="flex flex-wrap gap-2 text-[12px] text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={16} className="flex-shrink-0" />
                                {post.work_location}
                              </span>
                              <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
                                {post.employment_type}
                              </span>
                            </div>
                            <p className="text-[12px] text-slate-500">
                              {post.salary ? `${post.salary.toLocaleString()}원` : '협의'}
                            </p>
                            <p className="text-[12px] text-slate-400">
                              {post.start_date} ~ {post.end_date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {new Date(post.end_date) > new Date() ? (
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold',
                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              )}>
                                모집중
                              </span>
                            ) : (
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold',
                                'bg-slate-100 text-slate-500 border border-slate-200'
                              )}>
                                마감
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                          className={cn(
                            'p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150',
                            'rounded-lg flex-shrink-0 focus:outline-none'
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
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full mb-4">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <p className="text-slate-600 font-medium mb-1">등록된 공고가 없습니다</p>
                <p className="text-[13px] text-slate-500 mb-6">
                  첫 번째 채용 공고를 등록하여 인재를 모집해보세요
                </p>
                <motion.button
                  onClick={() => router.push('/company/posts/create')}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold',
                    'hover:bg-blue-700 transition-colors duration-150 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={18} />
                  첫 공고 등록하기
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
