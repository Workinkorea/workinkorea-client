import Layout from '@/shared/components/layout/Layout';
import { FormPageSkeleton } from '@/shared/ui/SkeletonCards';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function ResumeEditLoading() {
  return (
    <Layout>
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="page-container h-16 flex items-center justify-between">
          <Skeleton variant="text" className="h-7 w-32" />
          <div className="flex gap-2">
            <Skeleton variant="circle" className="w-9 h-9" />
            <Skeleton variant="circle" className="w-9 h-9" />
          </div>
        </div>
      </div>
      <FormPageSkeleton rows={8} />
    </Layout>
  );
}
