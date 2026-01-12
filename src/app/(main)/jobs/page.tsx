import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import JobsListView from '@/features/jobs/pages/JobsListView';
import { createServerAdminApi } from '@/shared/api/server';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

async function getJobs(page: number = 1, limit: number = 12) {
  try {
    const adminApi = await createServerAdminApi();
    const data = await adminApi.getCompanyPosts(page, limit);

    // Ensure the response matches CompanyPostsResponse structure
    return {
      company_posts: data.company_posts || [],
      total: data.total || 0,
      page,
      limit,
      total_pages: Math.ceil((data.total || 0) / limit),
    };
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return {
      company_posts: [],
      total: 0,
      page,
      limit,
      total_pages: 0,
    };
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const initialData = await getJobs(currentPage);

  return (
    <JobsListView
      initialData={initialData}
      currentPage={currentPage}
    />
  );
}
