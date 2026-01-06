import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailView from '@/features/jobs/pages/JobDetailView';
import { CompanyPostDetailResponse } from '@/shared/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ISR: 1시간마다 재검증
export const revalidate = 3600;

// 동적 파라미터 허용 (빌드 시 정적 생성 없이 런타임에 생성)
export const dynamicParams = true;

// generateMetadata: 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getJobDetail(params.id);

  if (!job) {
    return {
      title: '공고를 찾을 수 없습니다 - WorkInKorea',
    };
  }

  return {
    title: `${job.title} - WorkInKorea`,
    description: `${job.content.substring(0, 150)}...`,
    openGraph: {
      title: job.title,
      description: job.content.substring(0, 150),
    },
  };
}

async function getJobDetail(id: string): Promise<CompanyPostDetailResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/company/${id}`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching job detail:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobDetail(params.id);

  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} />;
}
