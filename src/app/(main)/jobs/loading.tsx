import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import Layout from '@/shared/components/layout/Layout';
import { JobListSkeleton } from '@/shared/ui/SkeletonCards';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function JobsLoading() {
  return (
    <Layout>
      <HeaderClient />
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-6 flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-8 w-40" />
              <Skeleton variant="text" className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>

          {/* 검색 & 필터 바 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="text" className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>

          <Skeleton variant="text" className="h-4 w-32 mb-4" />
          <JobListSkeleton count={6} />
        </div>
      </div>
    </Layout>
  );
}
