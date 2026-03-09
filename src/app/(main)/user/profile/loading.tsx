import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function UserProfileLoading() {
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

      <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              <Skeleton variant="circle" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
              <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                <Skeleton variant="text" className="h-6 w-40 mx-auto sm:mx-0" />
                <Skeleton variant="text" className="h-4 w-28 mx-auto sm:mx-0" />
                <Skeleton variant="text" className="h-4 w-56 mx-auto sm:mx-0" />
              </div>
              <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
            </div>
            {/* Profile progress bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-3 w-24" />
                <Skeleton variant="text" className="h-3 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>

          {/* Horizontal Tab Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-100">
              {['대시보드', '이력서', '스킬', '경력'].map((tab, i) => (
                <div
                  key={tab}
                  className={`flex items-center gap-2 px-5 py-3.5 shrink-0 ${i === 0 ? 'border-b-2 border-blue-600' : ''}`}
                >
                  <Skeleton variant="circle" className="w-4 h-4" />
                  <Skeleton variant="text" className={`h-4 w-${i === 0 ? '16' : '12'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <Skeleton variant="text" className="h-5 w-32 mb-2" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton variant="text" className="h-4 w-3/4" />
                      <Skeleton variant="text" className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <Skeleton variant="text" className="h-5 w-24 mb-4" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <Skeleton variant="text" className="h-5 w-28 mb-2" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="h-3 w-20" />
                      <Skeleton variant="text" className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <Skeleton variant="text" className="h-5 w-24 mb-4" />
                <Skeleton variant="circle" className="w-48 h-48 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
