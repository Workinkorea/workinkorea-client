import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import JobsListClient from '@/components/pages/JobsListClient';
import { getCompanyPosts } from '@/lib/api/server/posts';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

// ISR: 1시간마다 재검증
export const revalidate = 3600;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export default async function JobsPage() {
  const data = await getCompanyPosts(DEFAULT_PAGE, DEFAULT_LIMIT);

  return (
    <JobsListClient
      initialPosts={data.company_posts}
      initialTotal={data.total}
      initialPage={data.page}
      initialLimit={data.limit}
    />
  );
}
