import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import CompanyProfileClient from '@/features/company/pages/CompanyProfileClient';
import { CompanyLandingPage } from '@/features/company/pages/CompanyLandingPage';
import { CompanyDashboardSkeleton } from '@/shared/ui/SkeletonCards';

export const metadata: Metadata = createMetadata({
  title: '기업 채용 - WorkInKorea',
  description: '외국인 인재를 채용하고 싶은 기업을 위한 글로벌 채용 플랫폼입니다.',
});

export default async function CompanyPage() {
  const cookieStore = await cookies();
  const userType = cookieStore.get('userType')?.value;

  // 기업 회원으로 로그인된 경우 → 대시보드
  if (userType === 'company') {
    return (
      <Suspense fallback={<CompanyDashboardSkeleton />}>
        <CompanyProfileClient />
      </Suspense>
    );
  }

  // 비로그인 또는 다른 유형 → 기업 랜딩 페이지
  return <CompanyLandingPage />;
}
