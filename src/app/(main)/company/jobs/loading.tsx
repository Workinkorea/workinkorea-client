import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';

function PostCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-3">
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
          {/* Status badge: emerald or slate */}
          <Skeleton variant="text" className="h-6 w-16 rounded-full" />
        </div>
      </div>
      {/* Bottom row: edit button */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export default function CompanyJobsLoading() {
  return (
    <Layout>
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Skeleton variant="text" className="h-7 w-32" />
          <div className="flex gap-2">
            <Skeleton variant="circle" className="w-9 h-9" />
            <Skeleton variant="circle" className="w-9 h-9" />
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-8 w-44" />
              <Skeleton variant="text" className="h-4 w-56" />
            </div>
            {/* 새 공고 등록 button */}
            <Skeleton className="h-10 w-32 rounded-lg shrink-0" />
          </div>

          {/* Posts count heading */}
          <Skeleton variant="text" className="h-5 w-28" />

          {/* 2-col posts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
