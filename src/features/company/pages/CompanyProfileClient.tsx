'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  PenSquare,
  ChevronRight,
  Search,
  Users,
  Building2,
  MapPin,
  Phone,
  Globe,
  FileText,
  Package,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { FetchError } from '@/shared/api/fetchClient';
import Layout from '@/shared/components/layout/Layout';
import { Header } from '@/shared/components/layout/Header';
import { profileApi } from '../api/profileCompany';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

type TodoTab = 'unread' | 'accepted' | 'interview' | 'evaluated';

const TODO_TABS: { key: TodoTab; label: string }[] = [
  { key: 'unread', label: '미열람' },
  { key: 'accepted', label: '제안 수락' },
  { key: 'interview', label: '면접' },
  { key: 'evaluated', label: '평가' },
];

const EMPTY_MESSAGES: Record<TodoTab, string> = {
  unread: '미열람 후보자가 없어요.',
  accepted: '제안 수락한 후보자가 없어요.',
  interview: '면접 예정 후보자가 없어요.',
  evaluated: '평가 완료된 후보자가 없어요.',
};

const CompanyProfileClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TodoTab>('unread');
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth();

  const { data: profile, isLoading: profileLoading, error, isError } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany(),
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/company-login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isError && error instanceof FetchError) {
      if (error.status === 404 || error.status === 500) {
        router.replace('/company/profile/edit');
      }
    }
  }, [isError, error, router]);

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['myCompanyPosts'],
    queryFn: async () => {
      const response = await postsApi.getMyCompanyPosts();
      return response.company_posts;
    },
    enabled: !!profile,
    retry: 1,
  });

  const handleLogout = async () => { await logout(); };

  const posts = postsData ?? [];
  const activePosts = posts.filter(p => new Date(p.end_date) > new Date());

  // 403 에러
  if (isError && error instanceof FetchError && error.status === 403) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md">
            <p className="text-slate-900 font-semibold mb-2">접근 권한이 없습니다</p>
            <p className="text-sm text-slate-500">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 로딩 스켈레톤
  if (authLoading || profileLoading || !profile) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="skeleton-shimmer rounded-xl h-28" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
              <div className="space-y-5">
                <div className="skeleton-shimmer rounded-xl h-56" />
                <div className="skeleton-shimmer rounded-xl h-40" />
                <div className="skeleton-shimmer rounded-xl h-48" />
              </div>
              <div className="space-y-4">
                <div className="skeleton-shimmer rounded-xl h-72" />
                <div className="skeleton-shimmer rounded-xl h-44" />
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

      <div className="min-h-screen bg-slate-50">

        {/* ── 배너 ── */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-30 select-none pointer-events-none">
              <span className="text-[40px]">📋</span>
              <span className="text-[32px]">👤</span>
            </div>
            <div className="text-center">
              <h1 className="text-[21px] font-extrabold text-slate-900 tracking-tight">
                채용의 모든 과정을{' '}
                <span className="text-blue-600">한 곳에서!</span>
              </h1>
              <p className="text-[13px] text-slate-400 mt-1">
                WorkinKorea 외국인 채용 플랫폼
              </p>
            </div>
            <div className="flex items-center gap-3 opacity-30 select-none pointer-events-none">
              <span className="text-[32px]">💼</span>
              <span className="text-[40px]">🔍</span>
            </div>
          </div>
        </div>

        {/* ── 메인 레이아웃 ── */}
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

          {/* ── 중앙 컨텐츠 ── */}
          <div className="space-y-4">

            {/* 진행중 공고 */}
            <motion.div
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <button
                  onClick={() => router.push('/company/jobs')}
                  className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900 hover:text-blue-600 transition-colors group cursor-pointer"
                >
                  진행중 공고
                  <span className="text-blue-600 font-extrabold">{activePosts.length}</span>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </button>
                <button
                  onClick={() => router.push('/company/posts/create')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <PenSquare size={13} />
                  공고 등록
                </button>
              </div>

              <div className="p-4">
                {postsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 skeleton-shimmer rounded-lg" />
                    ))}
                  </div>
                ) : activePosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePosts.slice(0, 4).map(post => (
                      <button
                        key={post.id}
                        onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                        className="text-left border border-slate-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
                      >
                        <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">{post.employment_type}</span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            미열람 후보자{' '}
                            <span className="text-blue-600 font-black">0</span> 명
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-9 text-center">
                    <FileText size={30} className="text-slate-200 mb-3" />
                    <p className="text-[13px] text-slate-400 mb-3">
                      진행중인 공고가 없어요
                    </p>
                    <button
                      onClick={() => router.push('/company/posts/create')}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-600 text-[12px] font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <PenSquare size={13} />
                      첫 공고 등록하기
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 진행중 인재풀 */}
            <motion.div
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900">
                  진행중 인재풀
                  <span className="text-blue-600 font-extrabold">0</span>
                  <ChevronRight size={15} className="text-slate-300" />
                </div>
              </div>
              <div className="p-4">
                <div className="bg-blue-50 rounded-lg flex flex-col items-center justify-center py-7 text-center">
                  <p className="text-[13px] text-slate-500 mb-2 leading-relaxed">
                    딱 맞는 우수한<br />인재를 찾아보세요!
                  </p>
                  <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:underline transition-colors cursor-pointer">
                    <Search size={13} />
                    인재 검색
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 내 할일 */}
            <motion.div
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
            >
              <div className="px-5 py-3.5 border-b border-slate-100">
                <span className="text-[14px] font-bold text-slate-900">내 할일</span>
              </div>

              {/* 탭 */}
              <div className="flex items-center gap-2 px-5 pt-4 flex-wrap">
                {TODO_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors cursor-pointer',
                      activeTab === tab.key
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {tab.label} 0
                  </button>
                ))}
              </div>

              {/* 내용 */}
              <div className="px-5 pb-5 pt-4">
                <div className="flex flex-col items-center justify-center py-9 text-center">
                  <Users size={30} className="text-slate-200 mb-3" />
                  <p className="text-[13px] text-slate-400 mb-4">
                    {EMPTY_MESSAGES[activeTab]}
                  </p>
                  <button className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 text-[12px] font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <Users size={13} />
                    후보자 관리
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── 오른쪽 사이드바 ── */}
          <div className="space-y-4">

            {/* 기업 정보 카드 */}
            <motion.div
              className="bg-white border border-slate-200 rounded-xl p-5"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              {/* 로고 + 기업명 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 truncate">
                    기업 #{profile.company_id}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{profile.industry_type}</p>
                </div>
              </div>

              {/* 담당자 */}
              {profile.representative_name && (
                <p className="text-[12px] text-slate-500 mb-1">
                  담당자{' '}
                  <span className="font-semibold text-slate-700">{profile.representative_name}</span>
                </p>
              )}

              {/* CTA */}
              <button
                onClick={() => router.push('/company/posts/create')}
                className="text-[12px] font-semibold text-blue-600 hover:underline mb-4 block cursor-pointer"
              >
                공고 등록으로 채용을 시작해보세요.
              </button>

              {/* 구분선 + 스탯 */}
              <div className="border-t border-slate-100 pt-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-[22px] font-extrabold text-slate-900">{activePosts.length}</p>
                    <p className="text-[11px] text-slate-400">진행 공고</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[22px] font-extrabold text-slate-900">{posts.length}</p>
                    <p className="text-[11px] text-slate-400">전체 공고</p>
                  </div>
                </div>

                {/* 기업 정보 */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-[12px] text-slate-500">
                    <MapPin size={12} className="text-slate-300 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{profile.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <Phone size={12} className="text-slate-300 shrink-0" />
                    <span>{profile.phone_number}</span>
                  </div>
                  {profile.website_url && (
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <Globe size={12} className="text-slate-300 shrink-0" />
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {profile.website_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 프로필 수정 */}
              <button
                onClick={() => router.push('/company/profile/edit')}
                className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                프로필 편집
              </button>
            </motion.div>

            {/* 이용중인 상품 */}
            <motion.div
              className="bg-white border border-slate-200 rounded-xl p-5"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-slate-900">이용중인 상품</span>
                <ChevronRight size={15} className="text-slate-300" />
              </div>
              <div className="space-y-3">
                {[
                  { icon: <FileText size={13} />, label: '채용 광고' },
                  { icon: <Users size={13} />, label: '인재풀' },
                  { icon: <Package size={13} />, label: '인적성' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="text-slate-300">{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-slate-300">-</span>
                      <button className="px-2.5 py-1 border border-slate-200 rounded text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                        구매
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 하단 프로모 */}
            <motion.div
              className="bg-blue-50 border border-blue-100 rounded-xl p-5"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.26 }}
            >
              <p className="text-[13px] font-semibold text-slate-700 mb-1.5 leading-snug">
                적합한 인재를 찾지 못하셨나요?
              </p>
              <p className="text-[12px] text-slate-500 mb-3 leading-relaxed">
                <span className="text-blue-600 font-semibold">인재풀 60건 (30일)</span> 상품으로
                우수한 인재를 찾아보세요!
              </p>
              <button className="w-full py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                인재풀 이용하기
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileClient;
