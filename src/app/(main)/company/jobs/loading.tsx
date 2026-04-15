import { Skeleton } from '@/shared/ui/Skeleton';

function PostCardSkeleton() {
  return (
    <div className="bg-white border border-line-400 rounded-xl p-4 sm:p-6 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-2/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton variant="text" className="h-3 w-28" />
            <Skeleton variant="text" className="h-3 w-16 rounded" />
          </div>
          <Skeleton variant="text" className="h-3 w-32" />
          <Skeleton variant="text" className="h-3 w-44" />
        </div>
        <div className="flex flex-col gap-2 items-end shrink-0">
          <Skeleton variant="text" className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-line-200">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export default function CompanyJobsLoading() {
  return (
    <div className="min-h-screen bg-label-50 py-8 sm:py-12">
      <div className="page-container space-y-6">

        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton variant="text" className="h-8 w-44" />
            <Skeleton variant="text" className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg shrink-0" />
        </div>

        {/* 공고 수 */}
        <Skeleton variant="text" className="h-5 w-28" />

        {/* 공고 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
