'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bookmark, X, ChevronDown, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/shared/components/layout/Layout';
import JobCard from '@/features/jobs/components/JobCard';
import JobsPaginationClient from '@/features/jobs/components/JobsPaginationClient';
import { useCompanyPosts } from '@/features/jobs/hooks/useCompanyPosts';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { CompanyPostsResponse } from '@/shared/types/api';
import { useTranslations } from 'next-intl';

interface JobsListViewProps {
  initialData: CompanyPostsResponse;
  currentPage: number;
  initialQ?: string;
  initialType?: string;
  initialSort?: string;
}

export default function JobsListView({
  initialData,
  currentPage,
  initialQ = '',
  initialType = 'all',
  initialSort = 'latest',
}: JobsListViewProps) {
  const t = useTranslations('jobs.list');
  const tCommon = useTranslations('common.button');

  const EMPLOYMENT_TYPES = [
    { value: 'all',    label: t('all') },
    { value: '정규직', label: t('regular') },
    { value: '계약직', label: t('contract') },
    { value: '파트타임', label: t('partTime') },
    { value: '인턴',  label: t('intern') },
  ];

  const SORT_OPTIONS = [
    { label: t('sortLatest'),     value: 'latest' },
    { label: t('sortSalaryDesc'), value: 'salary_desc' },
    { label: t('sortSalaryAsc'),  value: 'salary_asc' },
  ];

  const limit = 12;
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedType, setSelectedType] = useState(initialType);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showSidebarFilters, setShowSidebarFilters] = useState(false);

  const { data, isLoading, error } = useCompanyPosts(currentPage, limit, initialData);
  const { bookmarks, isBookmarked } = useBookmarks();
  const { isAuthenticated } = useAuth();

  // ISSUE-60: 기업 세션에서 로딩 스켈레톤이 무한히 표시되는 문제 방지
  // 10초 후에도 로딩 중이면 강제로 로딩 해제
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setLoadingTimedOut(false);
      return;
    }
    const timer = setTimeout(() => setLoadingTimedOut(true), 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleBookmarkToggle = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/login-select?callbackUrl=/jobs');
      return;
    }
    setShowBookmarksOnly(v => !v);
  }, [isAuthenticated, router]);

  const posts = data?.company_posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const pushURL = useCallback(
    (q: string, type: string, sort: string) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (type !== 'all') params.set('type', type);
      if (sort !== 'latest') params.set('sort', sort);
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, pathname]
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    pushURL(q, selectedType, sortBy);
  };

  const handleType = (type: string) => {
    setSelectedType(type);
    pushURL(searchQuery, type, sortBy);
    setShowSidebarFilters(false);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    pushURL(searchQuery, selectedType, sort);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSortBy('latest');
    setShowBookmarksOnly(false);
    setShowSidebarFilters(false);
    router.replace(pathname, { scroll: false });
  };

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (showBookmarksOnly) {
      result = result.filter(p => isBookmarked(p.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.work_location?.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(p => p.employment_type === selectedType);
    }

    if (sortBy === 'salary_desc') {
      result.sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0));
    } else if (sortBy === 'salary_asc') {
      result.sort((a, b) => (a.salary ?? 0) - (b.salary ?? 0));
    }

    return result;
  }, [posts, searchQuery, selectedType, sortBy, showBookmarksOnly, isBookmarked]);

  const isFiltered = searchQuery.trim() !== '' || selectedType !== 'all' || showBookmarksOnly;

  // ISSUE-60: 타임아웃 발생 시 로딩 상태 해제 (기업 세션 무한 스켈레톤 방지)
  const showLoading = isLoading && !loadingTimedOut;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Page Header with Search */}
        <div className="bg-white border-b border-slate-100">
          <div className="page-container py-6 sm:py-8">
            {/* Title Section */}
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-title-3 sm:text-title-2 lg:text-title-1 font-extrabold text-slate-900 mb-2">
                  {t('title')}
                </h1>
                <p className="text-caption-1 sm:text-body-3 text-slate-600">
                  {t('subtitle')}
                </p>
              </div>

              {/* Desktop Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-body-3 font-semibold transition-all cursor-pointer shrink-0 ${
                  showBookmarksOnly
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_14px_rgba(66,90,213,0.25)]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <Bookmark size={16} className={showBookmarksOnly ? 'fill-white' : ''} />
                {t('saved')} {bookmarks.length > 0 && <span>({bookmarks.length})</span>}
              </button>

              {/* Mobile Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`sm:hidden p-2.5 rounded-lg border transition-colors cursor-pointer ${
                  showBookmarksOnly
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
                aria-label={t('savedOnly')}
              >
                <Bookmark size={18} className={showBookmarksOnly ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-100 transition-all bg-white">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 min-w-0 text-body-3 text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="page-container py-6 sm:py-8">

          {/* Mobile: Horizontal Filter Bar */}
          <div className="lg:hidden mb-6 space-y-3">
            {/* Employment Type Chips */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-2 w-max">
                {EMPLOYMENT_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleType(value)}
                    className={`px-3 py-1.5 rounded-full text-caption-2 font-semibold border whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      selectedType === value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Tabs - Mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className={`px-3.5 py-2 text-caption-2 font-semibold rounded-lg border whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    sortBy === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Reset Filter Button */}
            {isFiltered && (
              <button
                onClick={handleReset}
                className="w-full py-2 text-body-3 font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              >
                {t('resetFilter')}
              </button>
            )}
          </div>

          {/* Desktop: Sidebar + Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Desktop Sidebar - Hidden on mobile/tablet */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-[calc(65px+73px+20px)] h-fit space-y-5">
                {/* Employment Type Filter */}
                <div>
                  <h3 className="text-caption-1 font-bold text-slate-900 mb-3">{t('employmentType')}</h3>
                  <div className="space-y-1.5">
                    {EMPLOYMENT_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleType(value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-caption-1 font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          selectedType === value
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-caption-1 font-bold text-slate-900 mb-3">{t('sort')}</h3>
                  <select
                    value={sortBy}
                    onChange={e => handleSort(e.target.value)}
                    className="w-full text-caption-1 font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 bg-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bookmark Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleBookmarkToggle}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer text-body-3 font-semibold ${
                      showBookmarksOnly
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <Bookmark size={16} className={showBookmarksOnly ? 'fill-blue-700' : ''} />
                    {t('savedOnly')}
                  </button>
                </div>

                {/* Reset Button */}
                {isFiltered && (
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleReset}
                      className="w-full py-2 text-caption-1 font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      {t('resetFilter')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div>
              {/* Results Header: Count + Sort Tabs */}
              {!showLoading && !error && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                  <p className="text-body-2 font-semibold text-slate-900">
                    {isFiltered
                      ? t('filteredCount', { count: filteredPosts.length })
                      : t('totalCount', { count: total })}
                  </p>

                  {/* Sort Tabs - Desktop */}
                  <div className="hidden sm:flex items-center gap-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleSort(opt.value)}
                        className={`px-3.5 py-2 text-caption-1 font-semibold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          sortBy === opt.value
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Skeleton Loading */}
              {showLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 overflow-hidden">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 skeleton-shimmer rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 skeleton-shimmer rounded w-3/4" />
                          <div className="h-2.5 skeleton-shimmer rounded w-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2.5 mb-4">
                        <div className="h-3 skeleton-shimmer rounded w-full" />
                        <div className="h-3 skeleton-shimmer rounded w-5/6" />
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        <div className="h-5 skeleton-shimmer rounded-full w-16 shrink-0" />
                        <div className="h-5 skeleton-shimmer rounded-full w-20 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-slate-900 text-body-1 font-semibold mb-2">{t('loadError')}</p>
                  <p className="text-slate-600 text-body-3 mb-6">{t('loadErrorSub')}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-body-3 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {tCommon('refresh')}
                  </button>
                </div>
              )}

              {/* Job Grid */}
              {!showLoading && !error && filteredPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredPosts.map(post => (
                      <JobCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination - Only show if not filtered */}
                  {!isFiltered && totalPages > 1 && (
                    <div className="mt-8 sm:mt-12">
                      <JobsPaginationClient currentPage={currentPage} totalPages={totalPages} />
                    </div>
                  )}
                </>
              ) : !showLoading && !error ? (
                <div className="text-center py-16 sm:py-24">
                  {showBookmarksOnly && bookmarks.length === 0 ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Bookmark size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-body-1 font-bold mb-2">{t('noSaved')}</h3>
                      <p className="text-slate-600 text-body-3 mb-6">{t('noSavedDesc')}</p>
                      <Link
                        href="/jobs"
                        onClick={() => setShowBookmarksOnly(false)}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-body-3 font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        {t('browseJobs')}
                      </Link>
                    </>
                  ) : isFiltered ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Search size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-body-1 font-bold mb-2">{t('noResults')}</h3>
                      <p className="text-slate-600 text-body-3 mb-6">{t('noResultsSub')}</p>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-body-3 font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        {t('resetFilter')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Briefcase size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-body-1 font-bold mb-2">{t('comingSoon')}</h3>
                      <p className="text-slate-600 text-body-3">{t('comingSoonSub')}</p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
