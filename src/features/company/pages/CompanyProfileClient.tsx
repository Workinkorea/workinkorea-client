'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
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
  Briefcase,
  TrendingUp,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';
import { FetchError } from '@/shared/api/fetchClient';
import Layout from '@/shared/components/layout/Layout';
import { profileApi } from '../api/profileCompany';
import { postsApi } from '@/features/jobs/api/postsApi';
import type { CompanyPost } from '@/shared/types/api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';
import { isPostExpired } from '@/shared/lib/utils/formatDate';

type TodoTab = 'unread' | 'accepted' | 'interview' | 'evaluated';

const CompanyProfileClient = () => {
  const t = useTranslations('company.dashboard');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('redirected') === '1') {
      toast.error('해당 페이지에 접근 권한이 없습니다.');
      router.replace('/company', { scroll: false });
    }
  }, [searchParams, router]);

  // 대시보드 내 모든 "공고 등록" CTA가 동일한 handler 를 사용하도록 통일.
  // 이전에 일부 CTA 가 네비게이션을 트리거하지 못하던 이슈(ISSUE-101) 회귀 방지.
  const handleCreateJob = useCallback(() => {
    router.push('/company/posts/create');
  }, [router]);

  const handleManageJobs = useCallback(() => {
    router.push('/company/jobs');
  }, [router]);

  const [activeTodoTab, setActiveTodoTab] = useState<TodoTab>('unread');

  const TODO_TABS: { key: TodoTab; label: string; count: number }[] = [
    { key: 'unread',    label: t('tabUnread'),    count: 0 },
    { key: 'accepted',  label: t('tabAccepted'),  count: 0 },
    { key: 'interview', label: t('tabInterview'), count: 0 },
    { key: 'evaluated', label: t('tabEvaluated'), count: 0 },
  ];

  const EMPTY_TODO: Record<TodoTab, string> = {
    unread:    t('emptyUnread'),
    accepted:  t('emptyAccepted'),
    interview: t('emptyInterview'),
    evaluated: t('emptyEvaluated'),
  };

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading, error, isError } = useQuery({
    queryKey: ['companyProfile'],
    queryFn:  () => profileApi.getProfileCompany(),
    retry:    false,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['myCompanyPosts'],
    queryFn:  async () => {
      const response = await postsApi.getMyCompanyPosts();
      return response.company_posts;
    },
    enabled: !!profile,
    retry:   1,
  });

  // 세션 만료 등으로 인증 실패 시 재로그인 유도
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/company-login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isError && error instanceof FetchError) {
      if (error.status === 404 || error.status === 500) {
        router.replace('/company/profile/edit');
      }
    }
  }, [isError, error, router]);

  const posts: CompanyPost[] = postsData ?? [];
  // start == end 시드 데이터는 마감으로 처리하지 않음 (ISSUE-114)
  const activePosts = posts.filter((p: CompanyPost) => !isPostExpired(p.start_date, p.end_date));
  const expiredPosts = posts.filter((p: CompanyPost) => isPostExpired(p.start_date, p.end_date));

  // ── 에러: 403 ─────────────────────────────────────────────────────────────
  if (isError && error instanceof FetchError && error.status === 403) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-sm">
            <p className="text-slate-800 font-semibold mb-2">{t('accessDenied')}</p>
            <p className="text-body-3 text-slate-500">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── 로딩 스켈레톤 ──────────────────────────────────────────────────────────
  if (authLoading || profileLoading || !profile) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-100">
          <div className="bg-white border-b border-slate-100 px-6 py-5">
            <div className="max-w-[1100px] mx-auto flex items-center justify-between">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-3 w-20 rounded" />
                <div className="skeleton-shimmer h-6 w-40 rounded" />
              </div>
              <div className="skeleton-shimmer h-10 w-36 rounded-lg" />
            </div>
          </div>
          <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[0,1,2,3].map(i => <div key={i} className="skeleton-shimmer h-24 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-[1fr_320px] gap-5">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-64 rounded-xl" />
                <div className="skeleton-shimmer h-52 rounded-xl" />
              </div>
              <div className="space-y-4">
                <div className="skeleton-shimmer h-40 rounded-xl" />
                <div className="skeleton-shimmer h-36 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── 메인 렌더링 ────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-screen bg-slate-100">

        {/* ── 대시보드 상단 바 ───────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-caption-3 font-semibold text-blue-600 uppercase tracking-widest leading-none mb-0.5">
                  {t('dashboardLabel')}
                </p>
                <h1 className="text-body-2 font-extrabold text-slate-900 truncate leading-tight">
                  {profile.company_name || t('companyFallback')}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManageJobs}
                className={cn(
                  'hidden sm:inline-flex items-center gap-1.5 px-4 py-2',
                  'border border-slate-200 rounded-lg text-caption-1 font-semibold text-slate-600',
                  'hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer',
                )}
              >
                <Briefcase size={14} />
                {t('manageJobs')}
              </button>
              <motion.button
                type="button"
                onClick={handleCreateJob}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2',
                  'bg-blue-600 text-white text-caption-1 font-semibold rounded-lg',
                  'hover:bg-blue-700 transition-colors cursor-pointer',
                  'shadow-[0_4px_14px_rgba(66,90,213,0.25)]',
                  'focus:outline-none',
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={15} />
                {t('createPostBtn')}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 py-5">

          {/* ── 요약 통계 카드 4개 ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              {
                icon: <Briefcase size={18} className="text-blue-600" />,
                bg: 'bg-blue-50',
                value: activePosts.length,
                label: t('activePostsCount'),
                action: () => router.push('/company/jobs'),
              },
              {
                icon: <Users size={18} className="text-emerald-500" />,
                bg: 'bg-emerald-50',
                value: 0,
                label: '전체 지원자',
                action: undefined,
              },
              {
                icon: <Bell size={18} className="text-amber-500" />,
                bg: 'bg-amber-50',
                value: 0,
                label: '미검토 지원',
                action: undefined,
              },
              {
                icon: <Eye size={18} className="text-violet-600" />,
                bg: 'bg-violet-50',
                value: posts.length,
                label: t('totalPostsCount'),
                action: undefined,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={cn(
                  'bg-white border border-slate-200 rounded-xl p-4',
                  stat.action && 'cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all',
                )}
                onClick={stat.action}
                whileHover={stat.action ? { y: -2 } : undefined}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.bg)}>
                    {stat.icon}
                  </div>
                  {stat.action && <ChevronRight size={14} className="text-slate-300" />}
                </div>
                <p className="text-title-2 font-extrabold text-slate-900 leading-none mb-1">{stat.value}</p>
                <p className="text-caption-2 text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── 2컬럼 메인 레이아웃 ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

            {/* ── 좌측 메인 영역 ─────────────────────────────────────────── */}
            <div className="space-y-4 min-w-0">

              {/* 진행중 공고 섹션 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <button
                    onClick={() => router.push('/company/jobs')}
                    className="flex items-center gap-1.5 text-body-3 font-bold text-slate-900 hover:text-blue-600 transition-colors group cursor-pointer"
                  >
                    진행중인 채용 공고
                    <span className="text-blue-600 font-extrabold ml-0.5">{activePosts.length}</span>
                    <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateJob}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5',
                      'bg-blue-600 text-white text-caption-2 font-semibold rounded-lg',
                      'hover:bg-blue-700 transition-colors cursor-pointer',
                    )}
                  >
                    <PenSquare size={12} />
                    {t('createPostBtnSmall')}
                  </button>
                </div>

                <div className="divide-y divide-slate-50">
                  {postsLoading ? (
                    <div className="p-4 space-y-3">
                      {[0,1,2].map(i => (
                        <div key={i} className="flex items-center justify-between py-2">
                          <div className="space-y-1.5 flex-1 mr-4">
                            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                            <div className="skeleton-shimmer h-3 w-1/3 rounded" />
                          </div>
                          <div className="skeleton-shimmer h-6 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : activePosts.length > 0 ? (
                    activePosts.slice(0, 5).map(post => {
                      const daysLeft = post.end_date
                        ? Math.ceil((new Date(post.end_date).getTime() - Date.now()) / 86400000)
                        : 0;
                      return (
                        <motion.button
                          key={post.id}
                          onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                          className="w-full flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3.5 hover:bg-slate-50 transition-colors group cursor-pointer text-left"
                          whileHover={{ x: 2 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={14} className="text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-caption-1 font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </p>
                            <p className="text-caption-3 text-slate-400 mt-0.5">{post.employment_type}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="hidden sm:block text-right">
                              <p className="text-caption-3 font-semibold text-slate-500">
                                미검토 <span className="text-blue-600 font-bold">0</span>명
                              </p>
                            </div>
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption-3 font-semibold',
                              daysLeft <= 3
                                ? 'bg-red-50 text-red-500'
                                : 'bg-emerald-50 text-emerald-500',
                            )}>
                              <Clock size={10} />
                              D-{daysLeft}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText size={22} className="text-slate-300" />
                      </div>
                      <p className="text-caption-1 text-slate-500 mb-4">{t('noActivePosts')}</p>
                      <button
                        type="button"
                        onClick={handleCreateJob}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-4 py-2',
                          'bg-blue-600 text-white text-caption-1 font-semibold rounded-lg',
                          'hover:bg-blue-700 transition-colors cursor-pointer',
                        )}
                      >
                        <Plus size={14} />
                        {t('firstPostBtn')}
                      </button>
                    </div>
                  )}
                </div>

                {activePosts.length > 5 && (
                  <div className="border-t border-slate-100 px-5 py-2.5">
                    <button
                      onClick={() => router.push('/company/jobs')}
                      className="w-full text-caption-2 font-semibold text-slate-400 hover:text-blue-600 transition-colors text-center cursor-pointer py-0.5"
                    >
                      전체 {activePosts.length}개 보기 →
                    </button>
                  </div>
                )}
              </div>

              {/* 지원 현황 섹션 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <span className="text-body-3 font-bold text-slate-900">{t('myTasksTitle')}</span>
                </div>

                {/* 지원 단계 탭 */}
                <div className="flex items-center gap-1.5 px-5 pt-4 pb-2 flex-wrap">
                  {TODO_TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTodoTab(tab.key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-caption-2 font-semibold border transition-colors cursor-pointer',
                        activeTodoTab === tab.key
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50',
                      )}
                    >
                      {tab.label}
                      <span className={cn(
                        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-caption-3 font-bold',
                        activeTodoTab === tab.key ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400',
                      )}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="px-5 pb-5 pt-3">
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl">
                    <Users size={28} className="text-slate-300 mb-3" />
                    <p className="text-caption-1 text-slate-400 mb-4">{EMPTY_TODO[activeTodoTab]}</p>
                    <button className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-1.5',
                      'border border-slate-200 text-caption-2 font-semibold text-slate-600 rounded-lg bg-white',
                      'hover:bg-slate-50 transition-colors cursor-pointer',
                    )}>
                      <Users size={13} />
                      {t('manageBtn')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 마감된 공고 (있을 때만) */}
              {expiredPosts.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-body-3 font-bold text-slate-900">
                      마감된 공고
                      <span className="text-slate-400 font-semibold ml-0.5">{expiredPosts.length}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {expiredPosts.slice(0, 3).map(post => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                        className="w-full flex items-center gap-4 px-5 py-3 opacity-60 hover:opacity-100 hover:bg-slate-50 transition text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={13} className="text-slate-400" />
                        </div>
                        <p className="text-caption-1 text-slate-600 truncate flex-1">{post.title}</p>
                        <span className="text-caption-3 text-slate-400 shrink-0">마감</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── 우측 사이드바 ──────────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* 채용공고 등록 CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute bottom-2 -right-2 w-12 h-12 rounded-full bg-white/5" />
                <div className="relative">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <p className="text-body-3 font-extrabold text-white mb-1">
                    인재를 찾고 계신가요?
                  </p>
                  <p className="text-caption-2 text-blue-200 mb-4 leading-relaxed">
                    채용 공고를 등록하고<br />최적의 후보자를 만나보세요
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateJob}
                    className={cn(
                      'w-full py-2 bg-white text-blue-700 text-caption-1 font-bold rounded-lg',
                      'hover:bg-blue-50 transition-colors cursor-pointer',
                    )}
                  >
                    + 채용 공고 등록
                  </button>
                </div>
              </div>

              {/* 인재풀 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-body-3 font-bold text-slate-900">
                    {t('talentPoolTitle')}
                    <span className="text-blue-600 font-extrabold">0</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div className="p-4">
                  <div className="bg-blue-50 rounded-lg flex flex-col items-center py-5 text-center">
                    <Search size={20} className="text-blue-300 mb-2" />
                    <p className="text-caption-2 text-slate-500 mb-3 leading-relaxed whitespace-pre-line">
                      {t('talentPoolCta')}
                    </p>
                    <button className="inline-flex items-center gap-1 text-caption-2 font-semibold text-blue-600 hover:underline transition-colors cursor-pointer">
                      <Search size={12} />
                      {t('talentSearch')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 기업 정보 카드 */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-caption-1 font-bold text-slate-900">기업 정보</p>
                  <button
                    onClick={() => router.push('/company/profile/edit')}
                    className="text-caption-3 text-blue-600 hover:underline cursor-pointer"
                  >
                    {t('editProfile')}
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.address && (
                    <div className="flex items-start gap-2 text-caption-2 text-slate-500">
                      <MapPin size={13} className="text-slate-300 mt-0.5 shrink-0" />
                      <span className="leading-relaxed line-clamp-2">{profile.address}</span>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center gap-2 text-caption-2 text-slate-500">
                      <Phone size={13} className="text-slate-300 shrink-0" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                  {profile.website_url && (
                    <div className="flex items-center gap-2 text-caption-2 text-slate-500">
                      <Globe size={13} className="text-slate-300 shrink-0" />
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

              {/* 서비스 이용 현황 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
                  <span className="text-caption-1 font-bold text-slate-900">{t('productsTitle')}</span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { icon: <FileText size={13} />, label: t('recruitAd'),  status: '미이용' },
                    { icon: <Users    size={13} />, label: t('talentPool'), status: '미이용' },
                    { icon: <Package  size={13} />, label: t('aptitude'),   status: '미이용' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2 text-caption-2 text-slate-500">
                        <span className="text-slate-300">{item.icon}</span>
                        {item.label}
                      </div>
                      <button className={cn(
                        'px-2.5 py-1 border border-slate-200 rounded',
                        'text-caption-3 font-semibold text-slate-500 bg-white',
                        'hover:bg-slate-50 transition-colors cursor-pointer',
                      )}>
                        {t('buyBtn')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 프로모 배너 */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 size={15} className="text-blue-500 shrink-0" />
                  <p className="text-caption-1 font-semibold text-slate-700 leading-snug">
                    {t('promoTitle')}
                  </p>
                </div>
                <p className="text-caption-2 text-slate-500 mb-3 leading-relaxed whitespace-pre-line">
                  {t('promoSubtitle')}
                </p>
                <button className={cn(
                  'w-full py-2 bg-blue-600 text-white text-caption-2 font-semibold rounded-lg',
                  'hover:bg-blue-700 transition-colors cursor-pointer',
                )}>
                  {t('promoBtn')}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileClient;
