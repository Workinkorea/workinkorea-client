import { Suspense } from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import CompanyProfileClient from '@/features/company/pages/CompanyProfileClient';
import { CompanyDashboardSkeleton } from '@/shared/ui/SkeletonCards';

export const metadata: Metadata = createMetadata({
  title: '기업 대시보드 - WorkInKorea',
  description: '채용 공고와 지원자 현황을 한눈에 관리하세요.',
});

export default function CompanyDashboardPage() {
  return (
    <Suspense fallback={<CompanyDashboardSkeleton />}>
      <CompanyProfileClient />
    </Suspense>
  );
}
