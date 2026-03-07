import { TableSkeleton } from '@/shared/ui/SkeletonCards';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <TableSkeleton rows={10} />
    </div>
  );
}
