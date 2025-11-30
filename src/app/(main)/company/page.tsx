import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import CompanyProfileClient from '@/components/pages/CompanyProfileClient';

export const metadata: Metadata = createMetadata({
  title: '기업 프로필 - WorkInKorea',
  description: '기업 정보를 관리하고 채용 공고를 등록하세요.',
});

export default function CompanyProfilePage() {
  return <CompanyProfileClient />;
}
