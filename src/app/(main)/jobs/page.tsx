import React from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import JobsListClient from '@/components/pages/JobsListClient';

export const metadata: Metadata = createMetadata({
  title: '채용 공고 - WorkInKorea',
  description: '한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요',
});

export default function JobsPage() {
  return <JobsListClient />;
}
