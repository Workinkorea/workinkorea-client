import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import UserApplicationsClient from '@/features/jobs/pages/UserApplicationsClient';

export const metadata: Metadata = createMetadata({
  title: '지원 내역 - WorkInKorea',
  description: '내가 지원한 채용공고를 확인하세요.',
});

export default function UserApplicationsPage() {
  return <UserApplicationsClient />;
}
