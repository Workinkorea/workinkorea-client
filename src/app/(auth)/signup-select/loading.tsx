import { Skeleton } from '@/shared/ui/Skeleton';

export default function SignupSelectLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <Skeleton variant="text" className="h-8 w-48 mx-auto" />
          <Skeleton variant="text" className="h-4 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-8 space-y-4">
              <Skeleton className="w-16 h-16 rounded-xl mx-auto" />
              <Skeleton variant="text" className="h-6 w-32 mx-auto" />
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
