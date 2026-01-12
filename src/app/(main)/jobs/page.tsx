import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import JobsListView from '@/features/jobs/pages/JobsListView';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getJobs(page: number = 1, limit: number = 12) {
  try {
    const skip = (page - 1) * limit;
    const url = `${API_BASE_URL}/api/posts/company/list?skip=${skip}&limit=${limit}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[Server] Failed to fetch company posts:', {
        status: res.status,
        statusText: res.statusText,
        errorText,
        url,
      });
      return {
        company_posts: [],
        total: 0,
        page,
        limit,
        total_pages: 0,
      };
    }

    const data = await res.json();

    const currentCount = data.pagination?.count || data.company_posts?.length || 0;
    const isLastPage = currentCount < limit;
    const estimatedTotal = isLastPage ? skip + currentCount : skip + currentCount + 1; // +1 to show "next" button

    return {
      company_posts: data.company_posts || [],
      total: estimatedTotal,
      page,
      limit,
      total_pages: isLastPage ? page : page + 1,
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
