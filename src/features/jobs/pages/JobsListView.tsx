'use client';

import Layout from '@/shared/components/layout/Layout';
import HeaderClient from '@/shared/components/layout/HeaderClient';
import JobCard from '@/features/jobs/components/JobCard';
import JobsPaginationClient from '@/features/jobs/components/JobsPaginationClient';
import { useCompanyPosts } from '@/features/jobs/hooks/useCompanyPosts';
import type { CompanyPost, CompanyPostsResponse } from '@/shared/types/api';

interface JobsListViewProps {
  initialData: CompanyPostsResponse;
  currentPage: number;
}

export default function JobsListView({ initialData, currentPage }: JobsListViewProps) {
  const limit = 12;

  // TanStack Query: Hydrate with SSR data
  const { data, isLoading, error } = useCompanyPosts(currentPage, limit, initialData);

  const posts = data?.company_posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <HeaderClient />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-title-1 font-bold text-label-900 mb-2">
              채용 공고
            </h1>
            <p className="text-body-2 text-label-600">
              한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요
            </p>
            <p className="text-body-3 text-label-500 mt-2">
              총 {total}개의 공고
            </p>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-label-600 text-body-2">공고를 불러오는 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 text-body-2">
                공고를 불러오는 중 오류가 발생했습니다.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 공고 목록 */}
          {!isLoading && !error && posts && posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <JobCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <JobsPaginationClient
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : !isLoading && !error ? (
            <div className="text-center py-20">
              <p className="text-label-500 text-body-2">등록된 공고가 없습니다.</p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
