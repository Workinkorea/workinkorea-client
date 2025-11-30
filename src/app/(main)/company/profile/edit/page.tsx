import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import CompanyProfileEditClient from '@/components/pages/CompanyProfileEditClient';

export const metadata: Metadata = createMetadata({
  title: '기업 프로필 수정 - WorkInKorea',
  description: '기업 정보를 수정하세요.',
});

export default function CompanyProfileEditPage() {
  return <CompanyProfileEditClient />;
}
