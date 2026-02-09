---
name: api-patterns
description: API communication patterns using fetchClient and React Query
---

# API 통신 패턴 (API Communication Patterns)

## 목적
이 스킬은 fetchClient와 React Query를 활용한 API 통신 패턴을 제공합니다.

## 사용 시점
- 백엔드 API 호출 시
- 서버 상태 관리 시
- 데이터 페칭 및 캐싱 시

## 핵심 원칙

### ⚠️ 절대 규칙
1. **필수**: `fetchClient` 사용 (절대 직접 `fetch` 사용 금지)
2. **필수**: 절대 경로 사용 (`/api/*`)
3. **권장**: Client Component에서는 React Query 사용
4. **필수**: `credentials: 'include'` (fetchClient 자동 설정)

## fetchClient 사용 패턴

### 1. GET 요청

```typescript
// src/features/jobs/api/getJobs.ts
import { fetchClient } from '@/shared/api/fetchClient';
import type { Job } from '../types/job';

// 단순 GET
export async function getJobs(): Promise<Job[]> {
  return fetchClient.get<Job[]>('/api/posts/company');
}

// 쿼리 파라미터가 있는 GET
export interface GetJobsParams {
  page?: number;
  limit?: number;
  location?: string;
  salary?: number;
}

export async function getJobsWithParams(params: GetJobsParams): Promise<Job[]> {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchClient.get<Job[]>(`/api/posts/company?${queryString}`);
}

// Path 파라미터가 있는 GET
export async function getJob(id: string): Promise<Job> {
  return fetchClient.get<Job>(`/api/posts/company/${id}`);
}
```

### 2. POST 요청

```typescript
// src/features/jobs/api/createJob.ts
import { fetchClient } from '@/shared/api/fetchClient';
import type { Job, CreateJobRequest } from '../types/job';

export async function createJob(data: CreateJobRequest): Promise<Job> {
  return fetchClient.post<Job>('/api/posts/company', data);
}

// FormData 전송 (파일 업로드)
export async function createJobWithImage(
  data: CreateJobRequest,
  image: File
): Promise<Job> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('data', JSON.stringify(data));

  return fetchClient.post<Job>('/api/posts/company', formData, {
    headers: {
      // Content-Type을 지정하지 않으면 브라우저가 자동으로 설정
    },
  });
}
```

### 3. PUT/PATCH 요청

```typescript
// src/features/jobs/api/updateJob.ts
import { fetchClient } from '@/shared/api/fetchClient';
import type { Job, UpdateJobRequest } from '../types/job';

export async function updateJob(
  id: string,
  data: UpdateJobRequest
): Promise<Job> {
  return fetchClient.put<Job>(`/api/posts/company/${id}`, data);
}
```

### 4. DELETE 요청

```typescript
// src/features/jobs/api/deleteJob.ts
import { fetchClient } from '@/shared/api/fetchClient';

export async function deleteJob(id: string): Promise<void> {
  return fetchClient.delete(`/api/posts/company/${id}`);
}
```

## React Query 패턴

### 1. Query 훅 (데이터 조회)

```typescript
// src/features/jobs/hooks/useJobs.ts
'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getJobs, GetJobsParams } from '../api/getJobs';
import type { Job } from '../types/job';

export function useJobs(
  params?: GetJobsParams,
  options?: Omit<UseQueryOptions<Job[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['jobs', params],  // 파라미터를 queryKey에 포함
    queryFn: () => getJobs(params),
    staleTime: 5 * 60 * 1000,    // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000,      // 10분간 캐시 유지
    ...options,
  });
}

// 사용 예시
export function JobListComponent() {
  const { data: jobs, isLoading, error, refetch } = useJobs({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {jobs?.map(job => <JobCard key={job.id} job={job} />)}
      <button onClick={() => refetch()}>새로고침</button>
    </div>
  );
}
```

```typescript
// src/features/jobs/hooks/useJob.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getJob } from '../api/getJob';

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id,  // id가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000,
  });
}
```

### 2. Mutation 훅 (데이터 변경)

```typescript
// src/features/jobs/hooks/useCreateJob.ts
'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { createJob } from '../api/createJob';
import type { Job, CreateJobRequest } from '../types/job';
import { toast } from 'sonner';

export function useCreateJob(
  options?: Omit<UseMutationOptions<Job, Error, CreateJobRequest>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    // 성공 시 캐시 무효화
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('채용 공고가 등록되었습니다');
    },

    // 에러 처리
    onError: (error) => {
      toast.error('채용 공고 등록에 실패했습니다');
      console.error('Create job error:', error);
    },

    ...options,
  });
}

// 사용 예시
export function CreateJobForm() {
  const createJob = useCreateJob();

  const handleSubmit = async (data: CreateJobRequest) => {
    await createJob.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <button
        type="submit"
        disabled={createJob.isPending}
      >
        {createJob.isPending ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
```

```typescript
// src/features/jobs/hooks/useUpdateJob.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob } from '../api/updateJob';
import { toast } from 'sonner';

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) =>
      updateJob(id, data),

    onSuccess: (data, variables) => {
      // 특정 job 캐시 업데이트
      queryClient.setQueryData(['job', variables.id], data);

      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      toast.success('채용 공고가 수정되었습니다');
    },

    onError: (error) => {
      toast.error('채용 공고 수정에 실패했습니다');
      console.error('Update job error:', error);
    },
  });
}
```

```typescript
// src/features/jobs/hooks/useDeleteJob.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '../api/deleteJob';
import { toast } from 'sonner';

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: (_, deletedId) => {
      // 캐시에서 삭제된 항목 제거
      queryClient.setQueryData<Job[]>(
        ['jobs'],
        (oldData) => oldData?.filter(job => job.id !== deletedId)
      );

      // 특정 job 캐시 무효화
      queryClient.removeQueries({ queryKey: ['job', deletedId] });

      toast.success('채용 공고가 삭제되었습니다');
    },

    onError: (error) => {
      toast.error('채용 공고 삭제에 실패했습니다');
      console.error('Delete job error:', error);
    },
  });
}
```

### 3. Optimistic Update (낙관적 업데이트)

```typescript
// src/features/jobs/hooks/useToggleBookmark.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark } from '../api/bookmarks';
import type { Job } from '../types/job';

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBookmark,

    // 요청 전에 UI 먼저 업데이트 (낙관적)
    onMutate: async (jobId) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['jobs'] });

      // 이전 데이터 백업
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);

      // 낙관적으로 UI 업데이트
      queryClient.setQueryData<Job[]>(['jobs'], (old) =>
        old?.map(job =>
          job.id === jobId
            ? { ...job, isBookmarked: !job.isBookmarked }
            : job
        )
      );

      // 롤백을 위한 이전 데이터 반환
      return { previousJobs };
    },

    // 에러 시 롤백
    onError: (error, jobId, context) => {
      queryClient.setQueryData(['jobs'], context?.previousJobs);
      toast.error('북마크 처리에 실패했습니다');
    },

    // 성공 시 캐시 재검증
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
```

### 4. Infinite Query (무한 스크롤)

```typescript
// src/features/jobs/hooks/useInfiniteJobs.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getJobs } from '../api/getJobs';

export function useInfiniteJobs() {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite'],
    queryFn: ({ pageParam = 1 }) => getJobs({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      // 다음 페이지 번호 반환 (데이터가 있으면)
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// 사용 예시
export function InfiniteJobList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobs();

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}
```

## Server Component 데이터 페칭

### 1. Server Component에서 직접 페칭

```typescript
// app/(main)/jobs/page.tsx
import { fetchClient } from '@/shared/api/fetchClient';
import { JobsClient } from '@/features/jobs/pages/JobsClient';
import type { Job } from '@/features/jobs/types/job';

export default async function JobsPage() {
  // Server Component에서 데이터 페칭
  const jobs = await fetchClient.get<Job[]>('/api/posts/company', {
    next: {
      revalidate: 3600,        // 1시간마다 재검증 (ISR)
      tags: ['jobs'],          // 태그 기반 재검증
    },
  });

  return <JobsClient initialData={jobs} />;
}
```

### 2. Client Component에서 초기 데이터 사용

```typescript
// src/features/jobs/pages/JobsClient.tsx
'use client';

import { useJobs } from '../hooks/useJobs';
import type { Job } from '../types/job';

interface JobsClientProps {
  initialData: Job[];
}

export function JobsClient({ initialData }: JobsClientProps) {
  // React Query에 초기 데이터 제공
  const { data: jobs } = useJobs(undefined, {
    initialData,
  });

  return (
    <div>
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

## 에러 핸들링 패턴

### 1. API 함수에서 에러 처리

```typescript
// src/features/jobs/api/getJobs.ts
import { fetchClient } from '@/shared/api/fetchClient';

export async function getJobs(): Promise<Job[]> {
  try {
    return await fetchClient.get<Job[]>('/api/posts/company');
  } catch (error) {
    console.error('Failed to fetch jobs:', error);

    // 기본값 반환 또는 에러 재발생
    if (error instanceof Error && error.message === 'Network Error') {
      throw new Error('네트워크 연결을 확인해주세요');
    }

    throw error;
  }
}
```

### 2. React Query에서 에러 처리

```typescript
// src/features/jobs/hooks/useJobs.ts
'use client';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    retry: 3,  // 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Query error:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    },
  });
}
```

### 3. 컴포넌트에서 에러 처리

```typescript
export function JobListComponent() {
  const { data: jobs, error, isLoading, refetch } = useJobs();

  if (isLoading) {
    return <JobListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          {error.message || '데이터를 불러오는데 실패했습니다'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        등록된 채용 공고가 없습니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

## 캐싱 전략

### 1. staleTime과 gcTime 설정

```typescript
// 자주 변경되지 않는 데이터 (예: 사용자 프로필)
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 30 * 60 * 1000,  // 30분
    gcTime: 60 * 60 * 1000,     // 1시간
  });
}

// 자주 변경되는 데이터 (예: 채용 공고 목록)
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    staleTime: 5 * 60 * 1000,   // 5분
    gcTime: 10 * 60 * 1000,     // 10분
  });
}

// 실시간 데이터 (예: 알림)
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 0,               // 항상 stale
    refetchInterval: 30000,     // 30초마다 자동 refetch
  });
}
```

### 2. 수동 캐시 무효화

```typescript
const queryClient = useQueryClient();

// 특정 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['jobs'] });

// 여러 쿼리 무효화
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'jobs' || query.queryKey[0] === 'bookmarks'
});

// 캐시에서 데이터 직접 설정
queryClient.setQueryData(['job', id], newJobData);

// 캐시에서 데이터 가져오기
const job = queryClient.getQueryData<Job>(['job', id]);
```

## 체크리스트

### API 함수 작성 시
- [ ] `fetchClient` 사용
- [ ] 절대 경로 (`/api/*`) 사용
- [ ] 타입 정의 (`Promise<T>`)
- [ ] 에러 핸들링
- [ ] JSDoc 주석 (선택)

### React Query 훅 작성 시
- [ ] `queryKey`에 파라미터 포함
- [ ] `staleTime`, `gcTime` 적절히 설정
- [ ] `onSuccess`, `onError` 핸들러 (필요 시)
- [ ] Mutation 성공 시 캐시 무효화
- [ ] 토스트 알림

### 컴포넌트에서 사용 시
- [ ] Loading 상태 처리
- [ ] Error 상태 처리
- [ ] Empty 상태 처리
- [ ] 재시도 버튼 제공 (에러 시)

## 참고 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [프로젝트 CLAUDE.md](/.claude/Claude.md)
- [nextjs-specialist 에이전트](/.claude/agents/nextjs-specialist.md)
