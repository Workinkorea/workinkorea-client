import { Skeleton } from '@/shared/ui/Skeleton';

export default function MainLoading() {
  return (
    <div>
      {/* Hero Section skeleton */}
      <section className="bg-white min-h-[calc(100vh-65px)] sm:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Skeleton className="w-full max-w-2xl h-14 rounded-2xl mb-12 sm:mb-16" />
        <div className="flex flex-col items-center gap-3 mb-8">
          <Skeleton className="h-12 sm:h-16 w-48 sm:w-64" />
          <Skeleton variant="text" className="h-6 sm:h-8 w-44 sm:w-56" />
          <Skeleton variant="text" className="h-4 sm:h-5 w-60 sm:w-80 mt-1" />
        </div>
        <Skeleton className="h-12 w-32 rounded-full" />
      </section>

      {/* Card grid skeleton */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <Skeleton className="h-7 w-24 rounded-full mx-auto" />
            <Skeleton variant="text" className="h-8 sm:h-10 w-64 sm:w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6 space-y-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton variant="text" className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-4 w-full" />
                  <Skeleton variant="text" className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
