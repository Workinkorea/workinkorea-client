import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import CompanyPostCreateClient from '@/components/pages/CompanyPostCreateClient';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 등록 - WorkInKorea',
  description: '새로운 채용 공고를 등록하세요.',
});

export default function CompanyPostCreatePage() {
  return <CompanyPostCreateClient />;
}
