import { Suspense } from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import CompanyProfileClient from '@/features/company/pages/CompanyProfileClient';
import { CompanyDashboardSkeleton } from '@/shared/ui/SkeletonCards';

export const metadata: Metadata = createMetadata({
  title: '기업 대시보드 - WorkInKorea',
  description: '기업 정보를 관리하고 채용 공고를 등록하세요.',
});

/**
 * useSearchParams()는 Suspense boundary 내에서 호출해야 SSR 경고 없이 동작합니다.
 * CompanyProfileClient 내부에서 URL 탭 동기화를 사용하므로 여기서 Suspense로 감쌉니다.
 */
export default function CompanyProfilePage() {
  return (
    <Suspense fallback={<CompanyDashboardSkeleton />}>
      <CompanyProfileClient />
    </Suspense>
  );
}
