'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bookmark, X, ChevronDown, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/shared/components/layout/Layout';
import JobCard from '@/features/jobs/components/JobCard';
import JobsPaginationClient from '@/features/jobs/components/JobsPaginationClient';
import { useCompanyPosts } from '@/features/jobs/hooks/useCompanyPosts';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import type { CompanyPostsResponse } from '@/shared/types/api';

interface JobsListViewProps {
  initialData: CompanyPostsResponse;
  currentPage: number;
  initialQ?: string;
  initialType?: string;
  initialSort?: string;
}

const EMPLOYMENT_TYPES = ['전체', '정규직', '계약직', '파트타임', '인턴'];
const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '급여 높은 순', value: 'salary_desc' },
  { label: '급여 낮은 순', value: 'salary_asc' },
];

export default function JobsListView({
  initialData,
  currentPage,
  initialQ = '',
  initialType = '전체',
  initialSort = 'latest',
}: JobsListViewProps) {
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

  const posts = data?.company_posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const pushURL = useCallback(
    (q: string, type: string, sort: string) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (type !== '전체') params.set('type', type);
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
    setSelectedType('전체');
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

    if (selectedType !== '전체') {
      result = result.filter(p => p.employment_type === selectedType);
    }

    if (sortBy === 'salary_desc') {
      result.sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0));
    } else if (sortBy === 'salary_asc') {
      result.sort((a, b) => (a.salary ?? 0) - (b.salary ?? 0));
    }

    return result;
  }, [posts, searchQuery, selectedType, sortBy, showBookmarksOnly, isBookmarked]);

  const isFiltered = searchQuery.trim() !== '' || selectedType !== '전체' || showBookmarksOnly;

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
                  채용 공고
                </h1>
                <p className="text-caption-1 sm:text-body-3 text-slate-600">
                  한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요
                </p>
              </div>

              {/* Desktop Bookmark Button */}
              <button
                onClick={() => setShowBookmarksOnly(v => !v)}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  showBookmarksOnly
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <Bookmark size={16} className={showBookmarksOnly ? 'fill-white' : ''} />
                저장 {bookmarks.length > 0 && <span>({bookmarks.length})</span>}
              </button>

              {/* Mobile Bookmark Button */}
              <button
                onClick={() => setShowBookmarksOnly(v => !v)}
                className={`sm:hidden p-2.5 rounded-lg border transition-colors cursor-pointer ${
                  showBookmarksOnly
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
                aria-label="저장된 공고"
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
                placeholder="직무명, 근무지 검색..."
                className="flex-1 min-w-0 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
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
                {EMPLOYMENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => handleType(type)}
                    className={`px-3 py-1.5 rounded-full text-caption-2 font-semibold border whitespace-nowrap transition-all cursor-pointer ${
                      selectedType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {type}
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
                  className={`px-3.5 py-2 text-caption-2 font-semibold rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
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
                className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              >
                필터 초기화
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
                  <h3 className="text-caption-1 font-bold text-slate-900 mb-3">고용 형태</h3>
                  <div className="space-y-1.5">
                    {EMPLOYMENT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => handleType(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-caption-1 font-medium transition-all cursor-pointer ${
                          selectedType === type
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-caption-1 font-bold text-slate-900 mb-3">정렬</h3>
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
                    onClick={() => setShowBookmarksOnly(v => !v)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer text-sm font-semibold ${
                      showBookmarksOnly
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <Bookmark size={16} className={showBookmarksOnly ? 'fill-blue-700' : ''} />
                    저장한 공고만 보기
                  </button>
                </div>

                {/* Reset Button */}
                {isFiltered && (
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleReset}
                      className="w-full py-2 text-caption-1 font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      필터 초기화
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div>
              {/* Results Header: Count + Sort Tabs */}
              {!isLoading && !error && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                  <p className="text-body-2 font-semibold text-slate-900">
                    <span className="text-blue-600">
                      {isFiltered ? filteredPosts.length : total}
                    </span>
                    <span className="text-slate-600 ml-1">
                      개의 {isFiltered ? '검색 결과' : '채용공고'}
                    </span>
                  </p>

                  {/* Sort Tabs - Desktop */}
                  <div className="hidden sm:flex items-center gap-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleSort(opt.value)}
                        className={`px-3.5 py-2 text-caption-1 font-semibold rounded-lg border transition-all cursor-pointer ${
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
              {isLoading && (
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
                  <p className="text-slate-900 text-base font-semibold mb-2">공고를 불러올 수 없어요</p>
                  <p className="text-slate-600 text-body-3 mb-6">네트워크 연결을 확인하고 다시 시도해주세요</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    새로고침
                  </button>
                </div>
              )}

              {/* Job Grid */}
              {!isLoading && !error && filteredPosts.length > 0 ? (
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
              ) : !isLoading && !error ? (
                <div className="text-center py-16 sm:py-24">
                  {showBookmarksOnly && bookmarks.length === 0 ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Bookmark size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-body-1 font-bold mb-2">저장한 공고가 없습니다</h3>
                      <p className="text-slate-600 text-body-3 mb-6">관심 있는 공고를 북마크에 저장해보세요</p>
                      <Link
                        href="/jobs"
                        onClick={() => setShowBookmarksOnly(false)}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        공고 둘러보기
                      </Link>
                    </>
                  ) : isFiltered ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Search size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-[16px] font-bold mb-2">검색 결과가 없습니다</h3>
                      <p className="text-slate-600 text-[14px] mb-6">다른 조건으로 검색해보세요</p>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        필터 초기화
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-center">
                        <Briefcase size={56} className="text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 text-body-1 font-bold mb-2">아직 등록된 공고가 없습니다</h3>
                      <p className="text-slate-600 text-body-3">새로운 채용 기회를 곧 만나보실 수 있어요</p>
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
