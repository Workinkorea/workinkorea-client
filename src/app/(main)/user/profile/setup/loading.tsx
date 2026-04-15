import { Skeleton } from '@/shared/ui/Skeleton';

export default function ProfileSetupLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <Skeleton variant="text" className="h-8 w-48 mx-auto" />
        <Skeleton variant="text" className="h-4 w-64 mx-auto" />
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-11 w-full rounded-lg mt-4" />
        </div>
      </div>
    </div>
  );
}
