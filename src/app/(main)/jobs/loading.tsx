import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
        <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
      </div>
      <Skeleton variant="text" className="h-5 w-5/6 mb-3" />
      <div className="space-y-1.5 mb-4">
        <Skeleton variant="text" className="h-3 w-2/3" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="text" className="h-6 w-16 rounded-full" />
        <Skeleton variant="text" className="h-6 w-20 rounded-full" />
        <Skeleton variant="text" className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export default function JobsLoading() {
  return (
    <Layout>
      <HeaderClient />

      {/* Page Header with Search (bg-white border-b) */}
      <div className="bg-white border-b border-slate-100">
        <div className="page-container py-6 sm:py-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" className="h-8 w-36" />
              <Skeleton variant="text" className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-28 rounded-lg hidden sm:block" />
          </div>
          {/* Search bar */}
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-slate-50">
        <div className="page-container py-6 sm:py-8">

          {/* Mobile: horizontal filter chips */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" className="h-7 w-16 rounded-full shrink-0" />
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="text" className="h-8 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Desktop: sidebar + main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

            {/* Sidebar (desktop only) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                <div className="space-y-3">
                  <Skeleton variant="text" className="h-4 w-20" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} variant="text" className="h-8 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <Skeleton variant="text" className="h-4 w-16" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Main jobs area */}
            <div className="space-y-4">
              <Skeleton variant="text" className="h-4 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
