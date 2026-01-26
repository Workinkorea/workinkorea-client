import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import CompanyPostEditClient from '@/features/jobs/pages/CompanyPostEditClient';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 수정 - WorkInKorea',
  description: '채용 공고를 수정하세요.',
});

export default async function CompanyPostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyPostEditClient postId={id} />;
}
