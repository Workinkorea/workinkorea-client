'use client';

/**
 * [UX 개선 요약]
 * 1. Primary CTA 노출: '새 채용 공고 등록' 버튼을 페이지 진입 즉시 우측 상단에 고정 배치
 *    → 사용자가 스크롤 없이 핵심 액션을 찾을 수 있도록 인지 부하 감소
 * 2. 탭 네비게이션 + URL 동기화: ?tab=posts (기본) / ?tab=profile
 *    → 뒤로가기·공유·북마크 시 탭 상태가 유지됨 (URL 직접 접근 가능)
 *    → '관리 중인 공고'와 '기업 정보'를 분리해 정보 과부하 제거
 * 3. AnimatePresence: 탭 전환 시 fade + slide 애니메이션으로 전환 맥락 제공
 * 4. 공고 카드 호버: border-blue-200 + shadow로 클릭 가능성 명시
 * 5. 빈 상태(Empty State): 첫 공고 등록 유도 CTA를 중앙에 배치해 전환율 향상
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { FetchError } from '@/shared/api/fetchClient';
import Layout from '@/shared/components/layout/Layout';
import { profileApi } from '../api/profileCompany';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

// ── 탭 타입 및 상수 ───────────────────────────────────────────────────────────
// URL query param 값과 1:1 대응해 직접 링크 접근이 가능합니다.
type DashboardTab = 'posts' | 'profile';

const DASHBOARD_TABS: { key: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { key: 'posts',   label: '관리 중인 공고', icon: <Briefcase size={14} /> },
  { key: 'profile', label: '기업 정보',      icon: <Building2  size={14} /> },
];

// ── 내 할일 탭 상수 ───────────────────────────────────────────────────────────
type TodoTab = 'unread' | 'accepted' | 'interview' | 'evaluated';

const TODO_TABS: { key: TodoTab; label: string }[] = [
  { key: 'unread',    label: '미열람' },
  { key: 'accepted',  label: '제안 수락' },
  { key: 'interview', label: '면접' },
  { key: 'evaluated', label: '평가' },
];

const EMPTY_TODO: Record<TodoTab, string> = {
  unread:    '미열람 후보자가 없어요.',
  accepted:  '제안 수락한 후보자가 없어요.',
  interview: '면접 예정 후보자가 없어요.',
  evaluated: '평가 완료된 후보자가 없어요.',
};

// ── 탭 전환 애니메이션 ─────────────────────────────────────────────────────────
const tabVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
const CompanyProfileClient = () => {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 탭 상태를 읽습니다. 기본값은 'posts'.
  // → router.push로 URL이 변경되면 컴포넌트가 자동으로 리렌더링됩니다.
  const activeTab = (searchParams.get('tab') as DashboardTab) ?? 'posts';

  const [activeTodoTab, setActiveTodoTab] = useState<TodoTab>('unread');

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // 기업 프로필 조회
  const { data: profile, isLoading: profileLoading, error, isError } = useQuery({
    queryKey: ['companyProfile'],
    queryFn:  () => profileApi.getProfileCompany(),
    retry:    false,
  });

  // 내 공고 목록 조회 (프로필 로드 후 활성화)
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['myCompanyPosts'],
    queryFn:  async () => {
      const response = await postsApi.getMyCompanyPosts();
      return response.company_posts;
    },
    enabled: !!profile,
    retry:   1,
  });

  // 비인증 사용자 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/company-login');
  }, [isAuthenticated, authLoading, router]);

  // 프로필 미등록 시 편집 페이지로 리다이렉트
  useEffect(() => {
    if (isError && error instanceof FetchError) {
      if (error.status === 404 || error.status === 500) {
        router.replace('/company/profile/edit');
      }
    }
  }, [isError, error, router]);

  // URL 쿼리 파라미터를 업데이트해 탭 전환합니다.
  // scroll: false → 탭 전환 시 스크롤 위치를 유지해 UX 안정성 확보
  const setTab = (tab: DashboardTab) => {
    router.push(`${pathname}?tab=${tab}`, { scroll: false });
  };

  const posts       = postsData ?? [];
  const activePosts = posts.filter(p => new Date(p.end_date) > new Date());

  // ── 에러: 403 접근 권한 없음 ─────────────────────────────────────────────
  if (isError && error instanceof FetchError && error.status === 403) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-sm">
            <p className="text-slate-900 font-semibold mb-2">접근 권한이 없습니다</p>
            <p className="text-sm text-slate-500">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── 로딩 스켈레톤 ────────────────────────────────────────────────────────
  if (authLoading || profileLoading || !profile) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          {/* 헤더 스켈레톤 */}
          <div className="bg-white border-b border-slate-100 px-6 py-5">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-3 w-20 rounded" />
                <div className="skeleton-shimmer h-6 w-32 rounded" />
              </div>
              <div className="skeleton-shimmer h-10 w-36 rounded-lg" />
            </div>
            <div className="max-w-5xl mx-auto mt-4 flex gap-0">
              <div className="skeleton-shimmer h-10 w-32" />
              <div className="skeleton-shimmer h-10 w-24 opacity-60" />
            </div>
          </div>
          {/* 콘텐츠 스켈레톤 */}
          <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
            <div className="skeleton-shimmer h-52 rounded-xl" />
            <div className="skeleton-shimmer h-36 rounded-xl" />
            <div className="skeleton-shimmer h-44 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  // ── 메인 렌더링 ──────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-screen bg-white">

        {/* ── 대시보드 헤더: 기업명 + CTA + 탭 ─────────────────────────────
            UX 근거: 페이지의 최상단(시선이 처음 닿는 곳)에 핵심 액션을 배치합니다.
            shadow-blue CTA 버튼은 배경과 대비를 높여 클릭을 유도합니다.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 pt-5 pb-0 flex items-center justify-between">
            <div>
              {/* 역할 레이블: 현재 컨텍스트를 명시해 방향 감각 제공 */}
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                기업 대시보드
              </p>
              <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">
                기업 #{profile.company_id}
              </h1>
            </div>

            {/* Primary CTA: 가장 중요한 액션을 blue-shadow로 강조 */}
            <motion.button
              onClick={() => router.push('/company/posts/create')}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5',
                'bg-blue-600 text-white text-sm font-semibold rounded-lg',
                'hover:bg-blue-700 transition-colors cursor-pointer',
                'shadow-[0_4px_14px_rgba(37,99,235,0.25)]',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={16} />
              새 채용 공고 등록
            </motion.button>
          </div>

          {/* ── 탭 네비게이션 ─────────────────────────────────────────────
              UX 근거: 두 개의 관심사(공고 관리 / 기업 정보)를 분리해
              한 화면에 너무 많은 정보를 표시하지 않습니다 (정보 과부하 방지).
              URL query param 동기화: 뒤로가기·새로고침에도 탭이 유지됩니다.
          ────────────────────────────────────────────────────────────────── */}
          <div className="max-w-5xl mx-auto px-6 mt-4">
            <div className="flex border-b-2 border-slate-100">
              {DASHBOARD_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-5 py-3 text-sm font-medium',
                    'border-b-2 -mb-[2px] transition-colors cursor-pointer',
                    activeTab === tab.key
                      ? 'text-blue-600 border-blue-600 font-semibold'
                      : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300',
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {/* 공고 탭에 진행 공고 수 뱃지 표시 */}
                  {tab.key === 'posts' && activePosts.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 text-[11px] font-bold rounded-full">
                      {activePosts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 탭 콘텐츠 영역 ──────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          <AnimatePresence mode="wait">

            {/* ────────────────────────────────────────────────────────────
                탭 1: 관리 중인 공고 (기본)
            ──────────────────────────────────────────────────────────── */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* 진행중 공고 섹션 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    {/* 공고 목록 전체 보기 링크 */}
                    <button
                      onClick={() => router.push('/company/jobs')}
                      className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900 hover:text-blue-600 transition-colors group cursor-pointer"
                    >
                      진행중 공고
                      <span className="text-blue-600 font-extrabold">{activePosts.length}</span>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </button>
                    {/* 보조 공고 등록 버튼 (섹션 레벨) */}
                    <button
                      onClick={() => router.push('/company/posts/create')}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3.5 py-1.5',
                        'bg-blue-600 text-white text-[12px] font-semibold rounded-lg',
                        'hover:bg-blue-700 transition-colors cursor-pointer',
                      )}
                    >
                      <PenSquare size={13} />
                      공고 등록
                    </button>
                  </div>

                  <div className="p-4">
                    {postsLoading ? (
                      /* 공고 로딩 스켈레톤: 실제 카드 레이아웃과 동일한 구조 */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[0, 1].map(i => (
                          <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-3">
                            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                            <div className="flex justify-between">
                              <div className="skeleton-shimmer h-3 w-16 rounded" />
                              <div className="skeleton-shimmer h-3 w-20 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activePosts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activePosts.slice(0, 4).map(post => (
                          <motion.button
                            key={post.id}
                            onClick={() => router.push(`/company/posts/edit/${post.id}`)}
                            className={cn(
                              'text-left border border-slate-200 rounded-lg p-4',
                              'hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer',
                            )}
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">{post.employment_type}</span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                미열람{' '}
                                <span className="text-blue-600 font-black">0</span> 명
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      /* Empty State: 첫 공고 등록 유도 CTA
                         UX 근거: 빈 상태에서도 다음 행동을 명시해 사용자 이탈 방지 */
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                          <FileText size={22} className="text-slate-300" />
                        </div>
                        <p className="text-[13px] text-slate-500 mb-4">
                          진행중인 공고가 없어요
                        </p>
                        <button
                          onClick={() => router.push('/company/posts/create')}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-4 py-2',
                            'bg-blue-600 text-white text-[13px] font-semibold rounded-lg',
                            'hover:bg-blue-700 transition-colors cursor-pointer',
                          )}
                        >
                          <Plus size={14} />
                          첫 공고 등록하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 인재풀 섹션 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
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
                </div>

                {/* 내 할일 섹션
                    UX 근거: pill 탭으로 채용 프로세스 단계를 시각적으로 분리 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <span className="text-[14px] font-bold text-slate-900">내 할일</span>
                  </div>
                  {/* 상태별 pill 탭 */}
                  <div className="flex items-center gap-2 px-5 pt-4 flex-wrap">
                    {TODO_TABS.map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTodoTab(tab.key)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors cursor-pointer',
                          activeTodoTab === tab.key
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                        )}
                      >
                        {tab.label} 0
                      </button>
                    ))}
                  </div>
                  <div className="px-5 pb-5 pt-4">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Users size={28} className="text-slate-200 mb-3" />
                      <p className="text-[13px] text-slate-400 mb-4">{EMPTY_TODO[activeTodoTab]}</p>
                      <button className={cn(
                        'inline-flex items-center gap-1.5 px-4 py-1.5',
                        'border border-slate-200 text-[12px] font-semibold text-slate-600 rounded-lg',
                        'hover:bg-slate-50 transition-colors cursor-pointer',
                      )}>
                        <Users size={13} />
                        후보자 관리
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ────────────────────────────────────────────────────────────
                탭 2: 기업 정보
                UX 근거: 기업 설정 정보는 별도 탭으로 분리해 공고 관리 흐름을
                방해하지 않도록 합니다 (Separation of Concerns).
            ──────────────────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* 기업 정보 카드 */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  {/* 로고 + 기업명 */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 size={22} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-slate-900 truncate">
                        기업 #{profile.company_id}
                      </p>
                      <p className="text-[12px] text-slate-400 truncate">{profile.industry_type}</p>
                    </div>
                  </div>

                  {/* 통계 */}
                  <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-[26px] font-extrabold text-slate-900">{activePosts.length}</p>
                      <p className="text-[11px] text-slate-400">진행 공고</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[26px] font-extrabold text-slate-900">{posts.length}</p>
                      <p className="text-[11px] text-slate-400">전체 공고</p>
                    </div>
                  </div>

                  {/* 기업 상세 정보 */}
                  <div className="space-y-2.5 pb-5 border-b border-slate-100">
                    <div className="flex items-start gap-2 text-[13px] text-slate-600">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{profile.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-600">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{profile.phone_number}</span>
                    </div>
                    {profile.website_url && (
                      <div className="flex items-center gap-2 text-[13px] text-slate-600">
                        <Globe size={14} className="text-slate-400 shrink-0" />
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

                  {/* 프로필 편집 버튼 */}
                  <button
                    onClick={() => router.push('/company/profile/edit')}
                    className={cn(
                      'mt-4 w-full py-2.5 border border-slate-200 rounded-lg',
                      'text-[13px] font-semibold text-slate-600',
                      'hover:bg-slate-50 transition-colors cursor-pointer',
                    )}
                  >
                    프로필 편집
                  </button>
                </div>

                {/* 이용중인 상품 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-slate-900">이용중인 상품</span>
                    <ChevronRight size={15} className="text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: <FileText size={13} />, label: '채용 광고' },
                      { icon: <Users    size={13} />, label: '인재풀'   },
                      { icon: <Package  size={13} />, label: '인적성'   },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] text-slate-500">
                          <span className="text-slate-300">{item.icon}</span>
                          {item.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-slate-300">-</span>
                          <button className={cn(
                            'px-2.5 py-1 border border-slate-200 rounded',
                            'text-[11px] font-semibold text-slate-500',
                            'hover:bg-slate-50 transition-colors cursor-pointer',
                          )}>
                            구매
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 프로모 배너 */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="text-[13px] font-semibold text-slate-700 mb-1.5 leading-snug">
                    적합한 인재를 찾지 못하셨나요?
                  </p>
                  <p className="text-[12px] text-slate-500 mb-3 leading-relaxed">
                    <span className="text-blue-600 font-semibold">인재풀 60건 (30일)</span> 상품으로
                    우수한 인재를 찾아보세요!
                  </p>
                  <button className={cn(
                    'w-full py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg',
                    'hover:bg-blue-700 transition-colors cursor-pointer',
                  )}>
                    인재풀 이용하기
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfileClient;
