import { Skeleton } from '@/shared/ui/Skeleton';

export default function FaqLoading() {
  return (
    <div className="py-8 space-y-4">
      <Skeleton variant="text" className="h-8 w-48" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-5/6" />
    </div>
  );
}
