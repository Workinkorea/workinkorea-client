'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import JobCard from '@/features/jobs/components/JobCard';
import { Skeleton } from '@/shared/ui/Skeleton';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import type { CompanyPost } from '@/shared/types/api';

/**
 * ISSUE-110: /user/bookmarks — 클라이언트 localStorage 북마크 목록.
 * 서버 북마크 엔드포인트 구현(ISSUE-109) 전까지는 localStorage 기준으로 표시.
 */
function UserBookmarksClient() {
  const t = useTranslations('user.bookmarks');
  const { bookmarks } = useBookmarks();

  // 전체 공고에서 북마크된 id 만 필터. 서버 쪽 GET /api/posts/company/bookmarks 미구현.
  const { data, isLoading } = useQuery({
    queryKey: ['public-jobs', 'all', 1],
    queryFn: () => postsApi.getPublicCompanyPosts({ page: 1, limit: 100 }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const allPosts = data?.company_posts ?? [];
  const bookmarkedPosts = allPosts.filter((p: CompanyPost) => bookmarks.includes(p.id));

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="page-container space-y-6">
          <div>
            <h1 className="text-title-3 sm:text-title-2 font-extrabold text-slate-900">
              {t('title')}
            </h1>
            <p className="text-caption-1 sm:text-body-3 text-slate-500 mt-1">
              {t('subtitle', { count: bookmarks.length })}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : bookmarkedPosts.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-12 text-center">
              <Bookmark className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="text-body-3 font-semibold text-slate-700 mb-1">{t('emptyTitle')}</p>
              <p className="text-caption-1 text-slate-500 mb-6">{t('emptySubtitle')}</p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-body-3 font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('browseJobs')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {bookmarkedPosts.map((post: CompanyPost) => (
                <JobCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserBookmarksClient;
