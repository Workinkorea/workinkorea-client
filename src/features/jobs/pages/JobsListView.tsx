'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/shared/components/layout/Layout';
import { HeaderClient } from '@/shared/components/layout/HeaderClient';
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

  const { data, isLoading, error } = useCompanyPosts(currentPage, limit, initialData);
  const { bookmarks, isBookmarked } = useBookmarks();

  const posts = data?.company_posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const pushURL = useCallback((q: string, type: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type !== '전체') params.set('type', type);
    if (sort !== 'latest') params.set('sort', sort);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router, pathname]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    pushURL(q, selectedType, sortBy);
  };

  const handleType = (type: string) => {
    setSelectedType(type);
    pushURL(searchQuery, type, sortBy);
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
      <HeaderClient />
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-[22px] md:text-[32px] font-extrabold text-slate-900 mb-2">
                채용 공고
              </h1>
              <p className="text-[13px] md:text-[15px] text-slate-600">
                한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요
              </p>
            </div>
            {/* 북마크 모아보기 */}
            <button
              onClick={() => setShowBookmarksOnly(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                showBookmarksOnly
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <Bookmark size={15} className={showBookmarksOnly ? 'fill-white' : ''} />
              저장 {bookmarks.length > 0 && <span>({bookmarks.length})</span>}
            </button>
          </div>

          {/* 검색 & 필터 바 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="직무명, 근무지 검색..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                <SlidersHorizontal size={15} />
                <span className="text-xs font-medium">필터</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {EMPLOYMENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => handleType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />

              <select
                value={sortBy}
                onChange={e => handleSort(e.target.value)}
                className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 결과 수 */}
          {!isLoading && !error && (
            <p className="text-sm text-slate-500 mb-4">
              {isFiltered ? `검색 결과 ${filteredPosts.length}개` : `총 ${total}개의 공고`}
            </p>
          )}

          {/* 스켈레톤 로딩 */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-100 rounded-full w-16" />
                    <div className="h-6 bg-slate-100 rounded-full w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-20">
              <p className="text-slate-900 text-base font-semibold mb-2">공고를 불러올 수 없어요</p>
              <p className="text-slate-600 text-[15px] mb-4">네트워크 연결을 확인하고 다시 시도해주세요</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                새로고침
              </button>
            </div>
          )}

          {/* 공고 목록 */}
          {!isLoading && !error && filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <JobCard key={post.id} post={post} />
                ))}
              </div>

              {!isFiltered && totalPages > 1 && (
                <JobsPaginationClient currentPage={currentPage} totalPages={totalPages} />
              )}
            </>
          ) : !isLoading && !error ? (
            <div className="text-center py-20">
              {showBookmarksOnly && bookmarks.length === 0 ? (
                <>
                  <Bookmark size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600 text-[15px] mb-2">저장한 공고가 없습니다</p>
                  <Link href="/jobs" onClick={() => setShowBookmarksOnly(false)} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    공고 둘러보기
                  </Link>
                </>
              ) : isFiltered ? (
                <>
                  <p className="text-slate-600 text-[15px] mb-2">검색 결과가 없습니다</p>
                  <button onClick={handleReset} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    필터 초기화
                  </button>
                </>
              ) : (
                <>
                  <p className="text-slate-600 text-[15px] mb-2">새로운 채용 공고를 준비 중이에요</p>
                  <p className="text-slate-500 text-sm">곧 다양한 기회를 만나보실 수 있어요</p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
