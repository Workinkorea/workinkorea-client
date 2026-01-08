'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Edit3, Plus, MapPin } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

const CompanyJobsClient: React.FC = () => {
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
      try {
        const response = await postsApi.getMyCompanyPosts();
        return response.company_posts;
      } catch (error) {
        console.error('Failed to fetch company posts:', error);
        throw error;
      }
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
        <div className="min-h-screen bg-background-alternative py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-lg h-64"></div>
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
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 페이지 헤더 */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-title-2 font-bold text-label-900">채용공고 관리</h1>
              <p className="text-body-3 text-label-500 mt-1">
                등록한 채용 공고를 관리하고 수정하세요
              </p>
            </div>
            <button
              onClick={() => router.push('/company/posts/create')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              새 공고 등록
            </button>
          </motion.div>

          {/* 공고 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-normal">
              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : postsError ? (
                <div className="text-center py-12">
                  <p className="text-status-error mb-4">공고를 불러오는 데 실패했습니다.</p>
                  <p className="text-caption-2 text-label-500 mb-4">
                    {postsError instanceof Error ? postsError.message : '알 수 없는 오류가 발생했습니다.'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    다시 시도
                  </button>
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-title-4 font-semibold text-label-900">
                      전체 공고 ({posts.length}개)
                    </h3>
                  </div>
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-line-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-body-2 font-semibold text-label-900 mb-2">
                            {post.title}
                          </h4>
                          <div className="flex flex-wrap gap-3 text-caption-2 text-label-600">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {post.work_location}
                            </span>
                            <span>{post.employment_type}</span>
                            <span>
                              {post.salary ? `${post.salary.toLocaleString()}원` : '협의'}
                            </span>
                          </div>
                          <p className="text-caption-2 text-label-500 mt-2">
                            모집기간: {post.start_date} ~ {post.end_date}
                          </p>
                          <div className="mt-2">
                            {new Date(post.end_date) > new Date() ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-caption-2 bg-primary-50 text-primary-700">
                                모집중
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-caption-2 bg-gray-100 text-label-500">
                                마감
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                          className="text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-label-500 mb-4">등록된 공고가 없습니다.</p>
                  <button
                    onClick={() => router.push('/company/posts/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                    첫 공고 등록하기
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyJobsClient;
