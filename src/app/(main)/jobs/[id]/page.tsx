import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailView from '@/features/jobs/pages/JobDetailView';
import { fetchClient } from '@/shared/api/fetchClient';
import { CompanyPostDetailResponse } from '@/shared/types/api';

// ISR: 1시간마다 재검증
export const revalidate = 3600;

// 동적 파라미터 허용 (빌드 시 정적 생성 없이 런타임에 생성)
export const dynamicParams = true;

async function getJobDetail(id: string): Promise<CompanyPostDetailResponse | null> {
  try {
    return await fetchClient.get<CompanyPostDetailResponse>(`/api/posts/company/${id}`, {
      next: { revalidate: 3600, tags: [`job-${id}`] },
    });
  } catch {
    return null;
  }
}

// generateMetadata: 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobDetail(id);

  if (!job) {
    return {
      title: '채용 공고 - WorkInKorea',
    };
  }

  return {
    title: `${job.title} - WorkInKorea`,
    description: `${job.content?.substring(0, 150) ?? ''}`,
    openGraph: {
      title: job.title,
      description: job.content?.substring(0, 150) ?? '',
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = Number(id);

  if (isNaN(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await getJobDetail(id);
  // Note: job may be null if server-side fetch failed.
  // JobDetailView will attempt client-side fetch when job is null.

  return <JobDetailView job={job} jobId={jobId} />;
}
