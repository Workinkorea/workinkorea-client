import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import JobsListClient from '@/components/pages/JobsListClient';
import { CompanyPost } from '@/lib/api/types';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

// ISR: 1시간마다 재검증
export const revalidate = 3600;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getCompanyPosts(): Promise<CompanyPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/company/list`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch company posts:', res.status);
      return [];
    }

    const data = await res.json();
    return data.company_posts || [];
  } catch (error) {
    console.error('Error fetching company posts:', error);
    return [];
  }
}

export default async function JobsPage() {
  const posts = await getCompanyPosts();

  return <JobsListClient initialPosts={posts} />;
}
