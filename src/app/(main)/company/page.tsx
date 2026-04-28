import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { CompanyLandingPage } from '@/features/company/pages/CompanyLandingPage';

export const metadata: Metadata = createMetadata({
  title: '기업 채용 - WorkInKorea',
  description: '외국인 인재를 채용하고 싶은 기업을 위한 글로벌 채용 플랫폼입니다.',
});

export default function CompanyPage() {
  return <CompanyLandingPage />;
}
