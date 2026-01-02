import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import JobsListView from '@/components/pages/JobsListView';
import { createServerAdminApi } from '@/lib/api/server';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

async function getJobs(page: number = 1, limit: number = 12) {
  try {
    const adminApi = await createServerAdminApi();
    return await adminApi.getCompanyPosts(page, limit);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return { company_posts: [], total: 0 };
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const { company_posts, total } = await getJobs(currentPage);

  return (
    <JobsListView
      initialPosts={company_posts}
      total={total}
      currentPage={currentPage}
    />
  );
}
