import { Skeleton } from '@/shared/ui/Skeleton';

export default function CompanySignupLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Skeleton variant="text" className="h-8 w-48 mx-auto" />
        <Skeleton variant="text" className="h-4 w-64 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
