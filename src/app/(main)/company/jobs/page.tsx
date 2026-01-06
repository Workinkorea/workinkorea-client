import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import CompanyJobsClient from '@/features/jobs/pages/CompanyJobsClient';

export const metadata: Metadata = createMetadata({
  title: '채용공고 관리 - WorkInKorea',
  description: '등록한 채용 공고를 관리하세요.',
});

export default function CompanyJobsPage() {
  return <CompanyJobsClient />;
}
