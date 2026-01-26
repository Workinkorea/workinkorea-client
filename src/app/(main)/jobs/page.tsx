import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import JobsListView from '@/features/jobs/pages/JobsListView';
import { getCompanyPosts } from '@/features/jobs/api/postsApi';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const initialData = await getCompanyPosts(currentPage);

  return (
    <JobsListView
      initialData={initialData}
      currentPage={currentPage}
    />
  );
}
