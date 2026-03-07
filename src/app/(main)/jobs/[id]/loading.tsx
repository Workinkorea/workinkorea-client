import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import Layout from '@/shared/components/layout/Layout';
import { JobDetailSkeleton } from '@/shared/ui/SkeletonCards';

export default function JobDetailLoading() {
  return (
    <Layout>
      <HeaderClient />
      <JobDetailSkeleton />
    </Layout>
  );
}
