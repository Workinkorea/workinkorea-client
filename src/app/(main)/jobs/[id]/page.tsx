import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailView from '@/features/jobs/pages/JobDetailView';
import { fetchClient, FetchError } from '@/shared/api/fetchClient';
import { CompanyPostDetailResponse } from '@/shared/types/api';

// ISR: 1시간마다 재검증
export const revalidate = 3600;

// 동적 파라미터 허용 (빌드 시 정적 생성 없이 런타임에 생성)
export const dynamicParams = true;

/**
 * 서버 사이드로 공고 상세를 조회한다.
 * - 404 (존재하지 않음): 호출 측에서 notFound() 를 호출하도록 null 반환 + isNotFound=true
 * - 5xx / 네트워크 오류: null 반환 (클라이언트 측 재시도 UI 에서 처리)
 * - 성공: 데이터 반환
 *
 * ISSUE-62: 현재 ID 1~12 가 500 으로 떨어지고 본문이 "Company post not found"
 * 인 경우가 관찰됨 → 본문 메시지를 보고 404 로 간주하는 fallback 포함.
 */
async function getJobDetail(id: string): Promise<
  { data: CompanyPostDetailResponse; isNotFound: false } |
  { data: null; isNotFound: true } |
  { data: null; isNotFound: false }
> {
  try {
    const data = await fetchClient.get<CompanyPostDetailResponse>(`/api/posts/company/${id}`, {
      next: { revalidate: 3600, tags: [`job-${id}`] },
    });
    return { data, isNotFound: false };
  } catch (err) {
    if (err instanceof FetchError) {
      const body = err.data as { error?: string; detail?: string } | undefined;
      const message = body?.error ?? body?.detail ?? '';
      const looksLikeNotFound =
        err.status === 404 ||
        /not\s*found/i.test(message);
      if (looksLikeNotFound) {
        return { data: null, isNotFound: true };
      }
    }
    return { data: null, isNotFound: false };
  }
}

// generateMetadata: 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getJobDetail(id);

  if (!result.data) {
    return {
      title: '채용 공고 - WorkInKorea',
    };
  }

  const job = result.data;
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

  const result = await getJobDetail(id);

  // 404 가 확인된 경우 즉시 not-found.tsx 페이지 렌더 (무한 스켈레톤 방지)
  if (result.isNotFound) {
    notFound();
  }

  // 5xx / 네트워크 오류인 경우 result.data === null → 클라이언트 측 재시도 UI 노출
  return <JobDetailView job={result.data} jobId={jobId} />;
}
