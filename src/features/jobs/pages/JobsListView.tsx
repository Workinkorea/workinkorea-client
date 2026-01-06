import Layout from '@/shared/components/layout/Layout';
import HeaderClient from '@/shared/components/layout/HeaderClient';
import JobCard from '@/features/jobs/components/JobCard';
import JobsPaginationClient from '@/features/jobs/components/JobsPaginationClient';
import type { CompanyPost } from '@/shared/types/api';

interface JobsListViewProps {
  initialPosts: CompanyPost[];
  total: number;
  currentPage: number;
}

export default function JobsListView({ initialPosts, total, currentPage }: JobsListViewProps) {
  const limit = 12;
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

          {/* 공고 목록 */}
          {initialPosts && initialPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialPosts.map((post) => (
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
          ) : (
            <div className="text-center py-20">
              <p className="text-label-500 text-body-2">등록된 공고가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
