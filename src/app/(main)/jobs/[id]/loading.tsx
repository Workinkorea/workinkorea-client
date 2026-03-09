import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function JobDetailLoading() {
  return (
    <Layout>
      <HeaderClient />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back button */}
          <Skeleton variant="text" className="h-9 w-28 mb-6 rounded-lg" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
            {/* ── Left: Main Content ── */}
            <div className="space-y-4">

              {/* Hero Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <div className="flex items-start gap-4 sm:gap-6 mb-6">
                  <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-3 w-24" />
                    <Skeleton variant="text" className="h-7 w-3/4" />
                    <Skeleton variant="text" className="h-7 w-1/2" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton variant="text" className="h-6 w-20 rounded-full" />
                      <Skeleton variant="text" className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Deadline row */}
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" className="h-5 w-32 rounded-full" />
                  <Skeleton variant="text" className="h-5 w-24 rounded-full" />
                </div>
              </div>

              {/* Blue info banner (4-grid) */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center space-y-1.5">
                      <Skeleton variant="text" className="h-3 w-16 mx-auto" />
                      <Skeleton variant="text" className="h-5 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Amber recruitment period banner */}
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton variant="text" className="h-4 w-24" />
                  <Skeleton variant="text" className="h-4 w-40" />
                </div>
              </div>

              {/* Job Description Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton variant="circle" className="w-6 h-6" />
                  <Skeleton variant="text" className="h-6 w-32" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="text" className={`h-4 w-${i % 2 === 0 ? 'full' : '5/6'}`} />
                ))}
                <Skeleton variant="text" className="h-4 w-4/5" />
              </div>

              {/* Requirements Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton variant="circle" className="w-6 h-6" />
                  <Skeleton variant="text" className="h-6 w-28" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="text" className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* ── Right: Sticky Sidebar ── */}
            <div className="hidden lg:block">
              <div className="sticky top-20 space-y-4">
                {/* Apply Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="text-center space-y-1">
                    <Skeleton variant="text" className="h-4 w-24 mx-auto" />
                    <Skeleton variant="text" className="h-10 w-40 mx-auto" />
                  </div>
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>

                {/* Company Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" className="h-5 w-32" />
                      <Skeleton variant="text" className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton variant="circle" className="w-4 h-4 shrink-0" />
                        <Skeleton variant="text" className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: floating apply button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-30">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
