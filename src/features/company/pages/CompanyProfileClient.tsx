'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Edit3, Plus, MapPin, Users, Calendar, Building } from 'lucide-react';
import { FetchError } from '@/shared/api/fetchClient';
import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
import { profileApi } from '../api/profileCompany';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

const CompanyProfileClient: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'settings'>('overview');
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth();

  // 기업 프로필 조회
  const { data: profile, isLoading: profileLoading, error, isError } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany(),
    retry: false, // 에러 발생 시 재시도 하지 않음
  });

  // 인증 체크 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/company-login');
    }
  }, [isAuthenticated, authLoading, router]);

  // 프로필 조회 실패 시(404 Not Found 또는 500 Server Error) 프로필 작성 페이지로 리다이렉트
  useEffect(() => {
    if (isError && error instanceof FetchError) {
      const status = error.status;
      // 404: 프로필 없음, 500: 서버 오류 (기존 데이터 로드 실패 시 작성 페이지로 이동)
      if (status === 404 || status === 500) {
        router.replace('/company/profile/edit');
      }
    }
  }, [isError, error, router]);

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
    enabled: !!profile, // 프로필이 로드된 후에만 공고 조회
    retry: 1,
  });

  // 로딩 상태 처리 (프로필이 없거나 로딩 중일 때)
  if (authLoading || profileLoading || !profile) {
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg h-96"></div>
                <div className="bg-white rounded-lg h-96"></div>
              </div>
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
              <h1 className="text-title-2 font-bold text-label-900">기업 프로필</h1>
              <p className="text-body-3 text-label-500 mt-1">
                기업 정보를 관리하고 채용 공고를 등록하세요
              </p>
            </div>
          </motion.div>

          {/* 프로필 헤더 */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                  {profile.company_id}
                </div>
                <div>
                  <h2 className="text-title-3 font-bold text-label-900 mb-2">
                    기업 #{profile.company_id}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-body-3 text-label-600 flex items-center gap-2">
                      <Building size={16} />
                      {profile.industry_type} • {profile.company_type}
                    </p>
                    <p className="text-body-3 text-label-600 flex items-center gap-2">
                      <Users size={16} />
                      {profile.employee_count}명
                    </p>
                    <p className="text-body-3 text-label-600 flex items-center gap-2">
                      <MapPin size={16} />
                      {profile.address}
                    </p>
                    <p className="text-body-3 text-label-600 flex items-center gap-2">
                      <Calendar size={16} />
                      설립일: {profile.establishment_date}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/company/profile/edit')}
                className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors cursor-pointer"
              >
                <Edit3 size={16} />
                프로필 편집
              </button>
            </div>
          </motion.div>

          {/* 탭 네비게이션 */}
          <motion.div
            className="bg-white rounded-lg p-2 shadow-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-2">
              {[
                { key: 'overview', label: '개요' },
                { key: 'posts', label: '채용 공고' },
                { key: 'settings', label: '설정' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-body-3 font-medium transition-all cursor-pointer ${activeTab === tab.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-label-700 hover:bg-component-alternative'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 탭 컨텐츠 */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* 기업 정보 */}
                <div className="bg-white rounded-lg p-6 shadow-normal">
                  <h3 className="text-title-4 font-semibold text-label-900 mb-4">
                    기업 정보
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-caption-2 text-label-500">이메일</p>
                      <p className="text-body-3 text-label-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-caption-2 text-label-500">전화번호</p>
                      <p className="text-body-3 text-label-900">{profile.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-caption-2 text-label-500">웹사이트</p>
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-3 text-primary-500 hover:underline"
                      >
                        {profile.website_url}
                      </a>
                    </div>
                    <div>
                      <p className="text-caption-2 text-label-500">보험</p>
                      <p className="text-body-3 text-label-900">{profile.insurance}</p>
                    </div>
                  </div>
                </div>

                {/* 채용 통계 */}
                <div className="bg-white rounded-lg p-6 shadow-normal">
                  <h3 className="text-title-4 font-semibold text-label-900 mb-4">
                    채용 통계
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                      <div>
                        <p className="text-caption-2 text-label-500">총 공고</p>
                        <p className="text-title-3 font-bold text-primary-700">{posts?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-component-alternative rounded-lg">
                      <div>
                        <p className="text-caption-2 text-label-500">진행 중인 공고</p>
                        <p className="text-title-3 font-bold text-label-900">
                          {posts?.filter(p => new Date(p.end_date) > new Date()).length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-lg p-6 shadow-normal">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-title-4 font-semibold text-label-900">
                      채용 공고 관리
                    </h3>
                    <button
                      onClick={() => router.push('/company/posts/create')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                      새 공고 등록
                    </button>
                  </div>

                  {postsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : postsError ? (
                    <div className="text-center py-12">
                      <p className="text-label-900 font-semibold mb-2">공고를 불러올 수 없어요</p>
                      <p className="text-caption-2 text-label-500 mb-4">
                        네트워크 연결을 확인하고 다시 시도해주세요
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                      >
                        새로고침
                      </button>
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <div className="space-y-4">
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
                      <p className="text-label-600 mb-2">첫 채용 공고를 등록해보세요</p>
                      <p className="text-caption-2 text-label-500 mb-4">훌륭한 인재를 만날 수 있어요</p>
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
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-lg p-6 shadow-normal">
                  <h3 className="text-title-4 font-semibold text-label-900 mb-4">
                    계정 설정
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full text-left p-3 border border-line-400 rounded-lg text-body-3 text-label-700 hover:bg-component-alternative transition-colors cursor-pointer">
                      비밀번호 변경
                    </button>
                    <button className="w-full text-left p-3 border border-status-error rounded-lg text-body-3 text-status-error hover:bg-component-alternative transition-colors cursor-pointer">
                      계정 삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileClient;