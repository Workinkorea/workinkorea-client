import { Skeleton } from '@/shared/ui/Skeleton';

export default function Loading() {
  return (
    <div>
      {/* Hero Section 스켈레톤 */}
      <section className="bg-white min-h-[calc(100vh-65px)] sm:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 검색바 */}
        <Skeleton className="w-full max-w-2xl h-14 rounded-2xl mb-12 sm:mb-16" />

        {/* 타이틀 영역 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Skeleton className="h-12 sm:h-16 w-48 sm:w-64" />
          <Skeleton variant="text" className="h-6 sm:h-8 w-44 sm:w-56" />
          <Skeleton variant="text" className="h-4 sm:h-5 w-60 sm:w-80 mt-1" />
        </div>

        {/* CTA 버튼 */}
        <Skeleton className="h-12 w-32 rounded-full" />
      </section>

      {/* Services Section 스켈레톤 */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-14 lg:mb-16 space-y-3">
            <Skeleton className="h-7 w-24 rounded-full mx-auto" />
            <Skeleton variant="text" className="h-8 sm:h-10 w-64 sm:w-80 mx-auto" />
            <Skeleton variant="text" className="h-4 sm:h-5 w-72 sm:w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border-2 border-primary-200 p-6 sm:p-7 lg:p-8 space-y-5">
                <div className="flex justify-center">
                  <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl" />
                </div>
                <Skeleton variant="text" className="h-5 w-36 mx-auto" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-4 w-full" />
                  <Skeleton variant="text" className="h-4 w-5/6" />
                  <Skeleton variant="text" className="h-4 w-4/5" />
                </div>
                <Skeleton variant="text" className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JobCategories Section 스켈레톤 */}
      <section className="bg-white border-t border-line-100 py-12 sm:py-16 lg:py-20">
        <div className="page-container">
          <div className="text-center mb-8 sm:mb-12 space-y-2.5">
            <Skeleton className="h-6 w-24 rounded-full mx-auto" />
            <Skeleton variant="text" className="h-8 sm:h-9 w-40 sm:w-52 mx-auto" />
            <Skeleton variant="text" className="h-4 sm:h-5 w-56 sm:w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-line-200 rounded-xl px-3 py-4 sm:py-5 flex flex-col items-center gap-2.5"
              >
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton variant="text" className="h-3.5 w-10 sm:w-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PopularJobs Section 스켈레톤 */}
      <section className="bg-white py-12 md:py-16">
        <div className="page-container">
          <div className="text-center mb-8 md:mb-12 space-y-3">
            <Skeleton variant="text" className="h-7 md:h-8 w-24 mx-auto" />
            <Skeleton variant="text" className="h-4 md:h-5 w-56 md:w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-line-200 rounded-xl p-4 md:p-6">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton variant="text" className="h-4 w-24" />
                      <Skeleton variant="text" className="h-3 w-14" />
                    </div>
                  </div>
                </div>
                <Skeleton variant="text" className="h-5 w-3/4 mb-3 md:mb-4" />
                <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                  <Skeleton variant="text" className="h-3.5 w-full" />
                  <Skeleton variant="text" className="h-4 w-24" />
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Skeleton className="h-10 w-36 rounded-lg mx-auto" />
          </div>
        </div>
      </section>

      {/* CTA Section 스켈레톤 */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16 sm:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5">
          <Skeleton className="h-10 sm:h-12 lg:h-14 w-40 sm:w-52 mx-auto bg-white/20" />
          <Skeleton variant="text" className="h-4 sm:h-5 w-56 sm:w-80 mx-auto bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
            <Skeleton className="h-11 sm:h-12 w-full sm:w-36 rounded-lg bg-white/30" />
            <Skeleton className="h-11 sm:h-12 w-full sm:w-36 rounded-lg bg-white/20" />
          </div>
        </div>
      </section>
    </div>
  );
}
