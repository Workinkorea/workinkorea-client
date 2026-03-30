# Work in Korea — Frontend Engineer 가이드

## 기술 스택

| 기술 | 버전 | 비고 |
|------|------|------|
| Next.js | 16 (App Router) | `app/` 디렉토리 기반 |
| React | 19 | JSX 자동 변환, Compiler 활성화 |
| TypeScript | 5.x | strict 모드 |
| TailwindCSS | 4 | CSS 변수 기반 토큰 |
| Framer Motion | latest | 클라이언트 컴포넌트에서만 |
| Zustand | latest | 전역 클라이언트 상태 |
| React Query (TanStack) | v5 | 서버 데이터 캐싱 |
| React Hook Form + Zod | latest | 폼 관리 |

---

## 절대 규칙 (위반 시 PR 거절)

```tsx
// ❌ 금지
import React from 'react'           // React 19 — 불필요
export default function Foo() {}    // named export 사용
const Foo: React.FC<Props> = ()    // React.FC 금지
className="text-sm text-[13px]"    // Tailwind 기본/임의 크기 금지
// page.tsx에서 max-w-* 직접 사용  // layout.tsx에서만

// ✅ 올바름
export function Foo() {}
export function Foo({ ... }: FooProps) {}
className="text-body-1"            // Canonical 클래스
```

---

## 컴포넌트 작성 패턴

### 기본 패턴
```tsx
// features/jobs/ui/JobCard.tsx
interface JobCardProps {
  job: CompanyPost
  onBookmark?: (id: number) => void
}

export function JobCard({ job, onBookmark }: JobCardProps) {
  return (
    <div className="rounded-lg shadow-sm border border-slate-200 p-4">
      <h3 className="text-title-2 text-slate-900">{job.title}</h3>
      <p className="text-body-2 text-slate-500">{job.work_location}</p>
    </div>
  )
}
```

### 서버 컴포넌트 (기본)
```tsx
// 'use client' 없으면 서버 컴포넌트
export async function JobList() {
  const data = await fetchClient.get<{ company_posts: CompanyPost[] }>(
    '/api/posts/company/list',
    { next: { revalidate: 3600, tags: ['jobs'] } }
  )
  return <div>...</div>
}
```

### 클라이언트 컴포넌트
```tsx
'use client'
import { useState } from 'react'

export function FilterPanel() {
  const [open, setOpen] = useState(false)
  // ...
}
```

---

## API & 데이터 페칭

### fetchClient 사용법 (수정 금지)

```typescript
import { fetchClient } from '@/shared/api/fetchClient'

// ✅ 서버 컴포넌트 ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['tag-name'] }
})

// ✅ 서버 컴포넌트 SSR (캐시 없음)
const data = await fetchClient.get<T>('/api/endpoint', {
  cache: 'no-store'
})

// ✅ 클라이언트: fetchAPI 함수 사용
import { fetchAPI } from '@/shared/api/fetchClient'
const data = await fetchAPI<T>('GET', '/api/endpoint')
```

> ⚠️ 직접 `fetch()` 호출 금지. 항상 `fetchClient` 사용.

### React Query 패턴
```tsx
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetchAPI<{ company_posts: CompanyPost[] }>('GET', '/api/posts/company/list'),
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CompanyPostRequest) =>
      fetchAPI('POST', '/api/posts/company', { body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  })
}
```

---

## 상태 관리

### Zustand Store 패턴
```typescript
// shared/store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### 언제 무엇을 쓰나

| 상태 종류 | 솔루션 |
|---------|--------|
| 서버 데이터 (공고, 프로필) | React Query |
| 전역 UI 상태 (모달, 알림) | Zustand |
| 폼 상태 | React Hook Form |
| URL 상태 (필터, 페이지) | `useSearchParams` |
| 단순 로컬 | `useState` |

---

## FSD 아키텍처 — 파일 배치 결정 트리

```
새 파일을 어디에 둘까?

1개 페이지에서만 사용?
  → features/{domain}/ui/ 또는 features/{domain}/model/

여러 도메인에서 사용?
  → shared/ui/ (컴포넌트) 또는 shared/lib/ (유틸)

API 호출 함수?
  → features/{domain}/api/ 또는 shared/api/

전역 상태?
  → shared/store/ 또는 features/{domain}/model/store.ts

타입 정의?
  → features/{domain}/model/types.ts 또는 shared/types/api.ts
```

### 현재 feature 슬라이스 목록
```
features/
├── admin/        # 관리자 기능
├── auth/         # 인증 (로그인/회원가입)
├── company/      # 기업 대시보드
├── diagnosis/    # 직무 진단
├── events/       # 이벤트
├── jobs/         # 채용공고 탐색
├── landing/      # 랜딩 페이지
├── profile/      # 구직자 프로필
├── resume/       # 이력서
├── shared/       # (주의: shared feature ≠ shared 레이어)
└── user/         # 마이페이지
```

---

## 디자인 토큰 사용

### 타이포그래피 (Canonical 클래스만)
```
text-display-1/2  → 히어로 제목
text-title-1/2/3  → 섹션/카드 제목
text-body-1/2     → 본문
text-label-1/2    → 버튼/레이블
text-caption-1/2  → 캡션/메타
```

### 자주 쓰는 토큰 조합
```tsx
// 카드 헤딩
className="text-title-2 text-slate-900"

// 본문
className="text-body-1 text-slate-700"

// 보조 텍스트
className="text-body-2 text-slate-500"

// 캡션
className="text-caption-1 text-slate-400"

// 에러 메시지
className="text-caption-1 text-red-500"
```

---

## 성능 최적화

```tsx
// next/image 필수 (img 태그 금지)
import Image from 'next/image'
<Image src={url} alt={alt} width={400} height={300} />

// 무거운 클라이언트 컴포넌트는 dynamic import
import dynamic from 'next/dynamic'
const RadarChart = dynamic(() => import('./RadarChart'), {
  ssr: false,
  loading: () => <Skeleton variant="rect" className="h-64" />,
})

// React Compiler가 자동 메모이제이션 → useMemo/useCallback 불필요
// (단, 외부 라이브러리 콜백은 예외)
```

---

## Claude AI 작업 지침 (FE용)

```
# 좋은 요청 예시
"features/jobs/ui/JobFilter.tsx 컴포넌트 작성해줘.
 Props: filters (EmploymentType[]), onFilter (callback)
 - Named export, React.FC 금지
 - text-body-1, text-label-1 사용
 - 모바일에서 하단 드로어, 데스크톱에서 사이드바"

"useJobSearch 훅 작성해줘.
 - fetchClient.get으로 /api/posts/company/list 호출
 - useQuery 사용, queryKey: ['jobs', filters]
 - 검색어, 고용형태 필터 파라미터 지원"
```

---

## 관련 Skills & Agents

- **API 패턴**: `.claude/skills/api-patterns/SKILL.md`
- **폼 패턴**: `.claude/skills/form-patterns/SKILL.md`
- **FSD 패턴**: `.claude/skills/fsd-patterns/SKILL.md`
- **훅 패턴**: `.claude/skills/hooks-patterns.md`
- **UI 패턴**: `.claude/skills/ui-patterns.md`
- **Next.js Specialist**: `@.claude/agents/nextjs-specialist.md`
- **Feature Architect**: `@.claude/agents/feature-architect.md`
- **Testing Specialist**: `@.claude/agents/testing-specialist.md`
