import { Skeleton } from '@/shared/ui/Skeleton';

export default function CompanyLandingLoading() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <div className="space-y-5">
            <Skeleton className="h-24 rounded-xl" />
            <div className="space-y-2">
              <Skeleton variant="text" className="h-5 w-48" />
              <Skeleton variant="text" className="h-3 w-64" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-44 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
