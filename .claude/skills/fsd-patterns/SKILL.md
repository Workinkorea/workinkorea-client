---
name: fsd-patterns
description: Feature-Sliced Design architectural patterns and best practices for organizing code structure
---

# Feature-Sliced Design 패턴

## 목적
이 스킬은 Feature-Sliced Design (FSD) 아키텍처를 적용할 때 사용되는 패턴과 모범 사례를 제공합니다.

## 사용 시점
- 새로운 기능(Feature) 추가 시
- 코드베이스 구조 개선 시
- Feature 간 의존성 관리 시
- 공통 코드 추출 시

## 핵심 패턴

### 1. Feature 폴더 구조 템플릿

```
src/features/{feature-name}/
├── components/          # Feature 전용 UI 컴포넌트
│   ├── FeatureList.tsx
│   ├── FeatureCard.tsx
│   └── FeatureForm.tsx
│
├── pages/              # Client Component 페이지
│   ├── FeatureClient.tsx
│   └── FeatureDetailClient.tsx
│
├── hooks/              # 커스텀 훅
│   ├── useFeatures.ts     # 목록 조회
│   ├── useFeature.ts      # 단건 조회
│   └── useFeatureForm.ts  # 폼 관리
│
├── api/                # API 호출 함수
│   ├── getFeatures.ts     # GET 목록
│   ├── getFeature.ts      # GET 단건
│   ├── createFeature.ts   # POST
│   ├── updateFeature.ts   # PUT
│   └── deleteFeature.ts   # DELETE
│
├── types/              # 타입 정의
│   ├── feature.ts         # 도메인 타입
│   └── featureForm.ts     # 폼 타입
│
├── validations/        # Zod 스키마
│   └── featureSchema.ts
│
├── lib/                # Feature 전용 유틸리티
│   └── featureHelpers.ts
│
└── index.ts            # Public API (선택)
```

### 2. API 함수 패턴

```typescript
// src/features/jobs/api/getJobs.ts
import { fetchClient } from '@/shared/api/fetchClient';
import type { Job } from '../types/job';

export interface GetJobsParams {
  page?: number;
  limit?: number;
  location?: string;
  salary?: number;
}

export async function getJobs(params?: GetJobsParams): Promise<Job[]> {
  const queryString = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '';

  return fetchClient.get<Job[]>(`/api/posts/company${queryString}`);
}

// src/features/jobs/api/createJob.ts
import { fetchClient } from '@/shared/api/fetchClient';
import type { Job, CreateJobRequest } from '../types/job';

export async function createJob(data: CreateJobRequest): Promise<Job> {
  return fetchClient.post<Job>('/api/posts/company', data);
}
```

### 3. React Query 훅 패턴

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
    queryKey: ['jobs', params],
    queryFn: () => getJobs(params),
    staleTime: 5 * 60 * 1000,  // 5분
    ...options,
  });
}

// Mutation 훅
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
    onSuccess: (data) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('채용 공고가 등록되었습니다');
    },
    onError: (error) => {
      toast.error('채용 공고 등록에 실패했습니다');
      console.error('Create job error:', error);
    },
    ...options,
  });
}
```

### 4. 타입 정의 패턴

```typescript
// src/features/jobs/types/job.ts

// 도메인 엔티티
export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number | null;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  createdAt: string;
  updatedAt: string;
}

// 생성 요청 타입
export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  salary?: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
}

// 수정 요청 타입
export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: string;
}

// 목록 응답 타입
export interface JobListResponse {
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### 5. Zod 스키마 패턴

```typescript
// src/features/jobs/validations/jobSchema.ts
import { z } from 'zod';

export const jobSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),

  description: z
    .string()
    .min(10, '설명은 최소 10자 이상 입력해주세요')
    .max(5000, '설명은 5000자 이내로 입력해주세요'),

  location: z
    .string()
    .min(1, '근무지를 입력해주세요'),

  salary: z
    .number()
    .int('급여는 정수로 입력해주세요')
    .min(0, '급여는 0 이상이어야 합니다')
    .optional(),

  employmentType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT'], {
      errorMap: () => ({ message: '고용 형태를 선택해주세요' }),
    }),
});

export type JobFormData = z.infer<typeof jobSchema>;
```

### 6. 컴포넌트 패턴

```typescript
// src/features/jobs/components/JobCard.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPinIcon, DollarSignIcon } from 'lucide-react';
import { formatSalary } from '@/shared/lib/formatters';
import type { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  onClick?: (id: string) => void;
  showBookmark?: boolean;
}

export function JobCard({ job, onClick, showBookmark = false }: JobCardProps) {
  return (
    <motion.article
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(job.id)}
    >
      <h3 className="text-lg font-bold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-1">{job.company}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
        <span className="flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSignIcon className="w-4 h-4" />
            {formatSalary(job.salary)}
          </span>
        )}
      </div>

      {showBookmark && (
        <button
          className="absolute top-4 right-4"
          onClick={(e) => {
            e.stopPropagation();
            // 북마크 로직
          }}
        >
          {/* 북마크 아이콘 */}
        </button>
      )}
    </motion.article>
  );
}
```

### 7. 페이지 컴포넌트 패턴

```typescript
// app/(main)/jobs/page.tsx (Server Component)
import { JobsClient } from '@/features/jobs/pages/JobsClient';
import { fetchClient } from '@/shared/api/fetchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '채용 공고 | Work in Korea',
  description: '외국인 근로자를 위한 한국 채용 공고',
};

export default async function JobsPage() {
  // Server-side data fetching
  const jobs = await fetchClient.get('/api/posts/company', {
    next: { revalidate: 3600, tags: ['jobs'] }
  });

  return <JobsClient initialData={jobs} />;
}

// src/features/jobs/pages/JobsClient.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { JobCard } from '../components/JobCard';
import { JobListSkeleton } from '../components/JobListSkeleton';
import type { Job } from '../types/job';

interface JobsClientProps {
  initialData?: Job[];
}

export function JobsClient({ initialData }: JobsClientProps) {
  const [filters, setFilters] = useState({});

  const { data: jobs, isLoading, error } = useJobs(filters, {
    initialData,
  });

  if (isLoading) return <JobListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">채용 공고</h1>

      {/* 필터 */}
      <JobFilters filters={filters} onChange={setFilters} />

      {/* 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
```

### 8. Public API 패턴 (선택)

```typescript
// src/features/jobs/index.ts
// Feature의 외부 공개 API 정의

// 훅 export
export { useJobs } from './hooks/useJobs';
export { useJob } from './hooks/useJob';
export { useCreateJob } from './hooks/useCreateJob';

// API 함수 export (필요 시)
export { getJobs, createJob } from './api/jobs';

// 타입 export
export type { Job, CreateJobRequest, UpdateJobRequest } from './types/job';

// ❌ 내부 구현 export 금지
// export { JobCard } from './components/JobCard';
// export { jobSchema } from './validations/jobSchema';
```

## Shared 추출 기준

### Shared로 이동해야 하는 경우
- 2개 이상의 Feature에서 사용
- 도메인 로직이 없는 순수 유틸리티
- 범용 UI 컴포넌트

```typescript
// ✅ Shared로 이동
// src/shared/lib/formatters.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR').format(date);
}

export function formatSalary(amount: number): string {
  return `${amount.toLocaleString()}원`;
}

// ✅ Shared UI 컴포넌트
// src/shared/ui/Button.tsx
export function Button({ ... }) { ... }

// ❌ Feature 전용 - 이동하지 않음
// src/features/jobs/lib/jobHelpers.ts
export function calculateSalaryRange(job: Job) {
  // 채용 공고 전용 로직
}
```

## 의존성 관리

### Feature 간 통신

```typescript
// ❌ Bad: Feature 간 직접 의존
// src/features/profile/components/ProfileCard.tsx
import { useAuth } from '@/features/auth/hooks/useAuth';  // 직접 import

// ✅ Good: Shared 타입 사용 + Public API
// src/features/profile/components/ProfileCard.tsx
import type { User } from '@/shared/types/user';
import { useAuth } from '@/features/auth';  // Public API를 통한 import

export function ProfileCard({ user }: { user: User }) {
  const { data: currentUser } = useAuth();
  // ...
}
```

## 체크리스트

### 새 Feature 생성 시
- [ ] `features/{feature-name}/` 폴더 생성
- [ ] 표준 하위 폴더 구조 생성 (components, api, types, etc.)
- [ ] Path alias (`@/*`) 사용
- [ ] API 함수 분리 (getX, createX, etc.)
- [ ] React Query 훅 작성
- [ ] Zod 스키마 작성
- [ ] 타입 정의
- [ ] Public API 정의 (index.ts)

### 코드 배치 판단
- [ ] Feature 전용인가? → `features/{feature}/`
- [ ] 2개 이상 Feature에서 사용하는가? → `shared/`
- [ ] 도메인 로직이 있는가? → `features/{feature}/`
- [ ] 범용 유틸리티인가? → `shared/lib/`
- [ ] 재사용 가능한 UI인가? → `shared/ui/`

### 의존성 검증
- [ ] 상위 → 하위 계층 import만 사용
- [ ] Feature 간 직접 의존 최소화
- [ ] Shared는 Features/App import 금지
- [ ] Path alias 사용

## 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [프로젝트 CLAUDE.md](/.claude/Claude.md)
- [feature-architect 에이전트](/.claude/agents/feature-architect.md)
