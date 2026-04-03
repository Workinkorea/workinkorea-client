# Work in Korea — Designer 가이드

## Blue Design System

### 컬러 토큰

```css
/* Primary */
blue-600   #2563EB   /* 주요 액션, 버튼, 링크 */
blue-500   #3B82F6   /* hover 상태 */
blue-50    #EFF6FF   /* 배경 강조 영역 */
blue-100   #DBEAFE   /* 연한 배경 */

/* Text */
slate-900  #0F172A   /* 헤딩 */
slate-800  #1E293B   /* 본문 */
slate-700  #334155   /* 서브텍스트 */
slate-500  #64748B   /* placeholder, 비활성 */
slate-400  #94A3B8   /* 비활성 아이콘 */

/* Border */
slate-200  #E2E8F0   /* 기본 구분선 */
slate-100  #F1F5F9   /* 연한 구분선 */

/* Background */
white      #FFFFFF   /* 카드, 모달 배경 */
slate-50   #F8FAFC   /* 페이지 배경 */
slate-100  #F1F5F9   /* 대체 배경 (구 bg-component-alternative) */

/* Status */
green-600  /* success */
red-500    /* error/danger */
yellow-500 /* warning */
```

### 타이포그래피 (Canonical 클래스 — 반드시 이것만 사용)

> ⚠️ `text-sm`, `text-lg` 등 Tailwind 기본 크기, `text-[13px]` 등 임의 픽셀 **절대 금지**

| Canonical 클래스 | 용도 |
|----------------|------|
| `text-display-1` | 히어로 섹션 최대 제목 |
| `text-display-2` | 주요 섹션 제목 |
| `text-title-1` | 페이지 타이틀 |
| `text-title-2` | 카드/섹션 제목 |
| `text-title-3` | 서브 제목 |
| `text-body-1` | 본문 (기본) |
| `text-body-2` | 본문 (보조) |
| `text-label-1` | 버튼, 레이블 |
| `text-label-2` | 작은 레이블 |
| `text-caption-1` | 캡션, 메타 정보 |
| `text-caption-2` | 최소 캡션 |

### 폰트

```css
font-pretendard              /* 본문 전용 (--font-pretendard) */
font-['Plus_Jakarta_Sans']   /* 로고/브랜드 전용 */
```

### 스페이싱 (4배수 기준)

```
gap-1(4px), gap-2(8px), gap-3(12px), gap-4(16px),
gap-6(24px), gap-8(32px), gap-12(48px), gap-16(64px)
```

### 라디우스

```
rounded-sm   /* 인풋, 작은 요소 */
rounded-md   /* 카드, 버튼 */
rounded-lg   /* 모달, 큰 카드 */
rounded-xl   /* 히어로 카드 */
rounded-2xl  /* 특별 강조 영역 */
rounded-full /* 아바타, 배지 */
```

### 그림자 (토큰 매핑)

```
shadow-sm   /* 구 shadow-normal: 카드 기본 */
shadow-md   /* 구 shadow-strong: 드롭다운, 호버 */
shadow-xl   /* 구 shadow-heavy: 모달, 팝업 */
```

---

## 컴포넌트 카탈로그 (shared/ui)

| 컴포넌트 | 파일 | 주요 Props |
|---------|------|-----------|
| `Button` | Button.tsx | variant, size, loading, disabled |
| `Input` | Input.tsx | error shake 애니메이션 포함 |
| `FormField` | FormField.tsx | label + Input + error 메시지 래퍼 |
| `Modal` | Modal.tsx | isOpen, onClose, X 90° 회전 애니메이션 |
| `StatCard` | StatCard.tsx | 통계 수치 표시 카드 |
| `Badge` | Badge.tsx | variant (default/success/warning/error/info) |
| `Skeleton` | Skeleton.tsx | variant (rect/circle/text), shimmer 애니메이션 |
| `SkeletonCards` | SkeletonCards.tsx | 도메인별 스켈레톤 (JobCard, UserProfile 등) |
| `EmptyState` | EmptyState.tsx | icon, title, description, action |
| `LoadingSpinner` | LoadingSpinner.tsx | size (sm/md/lg), color (blue/white/slate) |
| `Card` | Card.tsx | 기본 카드 래퍼 |
| `Callout` | Callout.tsx | 알림/강조 박스 |
| `BackToTop` | BackToTop.tsx | 스크롤 상단 이동 버튼 |
| `ResumeCard` | ResumeCard.tsx | 이력서 목록 카드 |
| `Divider` | Divider.tsx | 구분선 |
| `Portal` | Portal.tsx | DOM 포털 (모달용) |

---

## 페이지 레이아웃 패턴

### 1. Split Layout (로그인/회원가입)
```
┌──────────────────┬──────────────────┐
│  Gradient Left   │   Form Right     │
│  (brand / hero)  │  (auth content)  │
└──────────────────┴──────────────────┘
```
- 모바일: 단일 컬럼 (왼쪽 패널 숨김)
- 태블릿+: 50/50 split
- 사용: `LoginContent`, `BusinessLoginForm`

### 2. Dashboard Layout (기업/관리자)
```
┌──────────────────────────────────────┐
│              Header                  │
├──────────────┬───────────────────────┤
│   Sidebar    │   Main Content        │
│   (lg+만)    │                       │
└──────────────┴───────────────────────┘
```
- 모바일: sidebar를 드로어로 전환
- 사용: `CompanyJobsClient`, 관리자 페이지

### 3. Content + Sticky Sidebar (공고 상세)
```
┌──────────────────────────────────────┐
│              Header                  │
├────────────────────────┬─────────────┤
│   Main Content (2/3)   │ Sticky      │
│   (공고 내용)           │ Apply Panel │
└────────────────────────┴─────────────┘
```
- 모바일: 단일 컬럼, Apply Panel은 하단 고정
- 사용: `JobDetailView`

### 4. Single Column Centered (폼 페이지)
```
max-w-xl mx-auto (layout.tsx에서 주입)
```
- 사용: 회원가입, 이력서 작성

### 5. Wide Grid (목록/랜딩)
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```
- 사용: 채용공고 목록, 랜딩 섹션

---

## 반응형 브레이크포인트

| 브레이크포인트 | 픽셀 | 주요 변경점 |
|-------------|------|-----------|
| `sm` | 640px | 2컬럼 그리드, 사이드바 표시 시작 |
| `md` | 768px | 3컬럼 그리드, 일부 레이아웃 전환 |
| `lg` | 1024px | Sidebar 고정 표시, 풀 데스크톱 레이아웃 |
| `xl` | 1280px | 4컬럼 그리드, max-w-7xl 여백 확보 |

---

## Framer Motion 패턴

### Stagger (목록 카드)
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
```

### Spring Hover (카드)
```tsx
whileHover={{ y: -6 }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```

### Tab Indicator (슬라이딩 탭)
```tsx
// layoutId="tab-bg"로 탭 간 이동 애니메이션
<motion.div layoutId="tab-bg" className="absolute inset-0 bg-blue-600 rounded-md" />
```

### Page Transition
```tsx
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Framer Motion 타입 주의
```tsx
// ease 배열은 반드시 캐스팅
ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
```

---

## Claude AI 작업 지침 (Designer용)

AI에게 UI 작업을 요청할 때:

```
# 좋은 요청 예시
"JobCard에 D-N 배지(마감 임박)를 추가해줘.
 bg-red-500, text-caption-1, rounded-full 사용.
 pulse 애니메이션 포함."

"모바일에서 필터 패널을 하단 드로어로 만들어줘.
 Framer Motion AnimatePresence + y:300→0 슬라이드업 사용."
```

- Canonical 클래스 명시 (text-body-1 등)
- 반응형 동작 설명 포함
- 기존 컴포넌트 재사용 우선

---

## 관련 Skills & Agents

- **디자인 패턴**: `.claude/skills/design-patterns/SKILL.md`
- **UI 패턴**: `.claude/skills/ui-patterns.md`
- **UI Specialist**: `@.claude/agents/ui-specialist.md`
# WorkinKorea — Backend / API Engineer 가이드

> 이 CLAUDE.md는 `feature/backend` 워트리 전용입니다.
> Next.js 16 App Router의 **API 레이어, Route Handler, 서버 컴포넌트 데이터 페칭**에 집중합니다.

---

## 1. API 아키텍처

### 레이어 구조

```
FastAPI 서버 (별도 레포, :8000)
    ↑ HTTP
Next.js Route Handlers  ← src/app/api/**
    ↑ fetchClient
Server Components / Client Components
```

### fetchClient 구조

위치: `src/shared/api/fetchClient.ts` — **직접 수정 금지**

| 심볼 | 역할 |
|------|------|
| `fetchAPI<T>(endpoint, options?)` | 핵심 fetch 래퍼, 토큰 리프레시 포함 |
| `fetchClient.get / post / put / patch / delete` | 편의 메서드 |
| `FetchError` | 커스텀 에러 클래스 (status, data 포함) |
| `API_BASE_URL` | `""` (클라이언트 — 상대경로) |
| `SERVER_API_URL` | `process.env.API_URL \|\| "http://workinkorea-server:8000"` |

### 환경 자동 감지

```typescript
const isServer = typeof window === 'undefined';
const baseURL = isServer ? SERVER_API_URL : API_BASE_URL;
```

- **서버(SSR/RSC)**: `SERVER_API_URL` → Docker 내부 네트워크 직접 통신
- **클라이언트(브라우저)**: `API_BASE_URL = ""` → Next.js가 `/api/*` 프록시

---

## 2. 서버 컴포넌트 데이터 페칭

### ISR (Incremental Static Regeneration)

```typescript
import { fetchClient } from '@/shared/api/fetchClient';
import type { CompanyPostsResponse } from '@/shared/types/api';

export default async function JobsPage() {
  const posts = await fetchClient.get<CompanyPostsResponse>(
    '/api/posts/company/list',
    { next: { revalidate: 3600, tags: ['jobs'] } }
  );
  return <JobsListView initialPosts={posts} />;
}
```

### SSR (동적 데이터, 캐싱 없음)

```typescript
const data = await fetchClient.get<ProfileResponse>(
  '/api/me',
  { cache: 'no-store' }
);
```

### 캐싱 전략 선택 기준

| 데이터 특성 | 전략 | 옵션 |
|------------|------|------|
| 공개 공고 목록 | ISR | `revalidate: 3600, tags: ['jobs']` |
| 공고 상세 | ISR | `revalidate: 1800, tags: ['job-{id}']` |
| 사용자 프로필 | SSR | `cache: 'no-store'` |
| 기업 프로필 | ISR | `revalidate: 7200, tags: ['company']` |
| 이력서 목록 | SSR | `cache: 'no-store'` |
| 진단 결과 | SSR | `cache: 'no-store'` |

### ISR 캐시 무효화

```bash
POST /api/revalidate
Content-Type: application/json
{ "tag": "jobs", "secret": "<REVALIDATE_SECRET>" }
```

---

## 3. 인증 흐름

### 토큰 구조

- **refreshToken**: HttpOnly Cookie (브라우저 자동 전송, JS 접근 불가)
- **accessToken**: 응답 body로 반환 → `tokenStore`에 in-memory 저장 (XSS 방어)
- **userType**: Public Cookie (`document.cookie`) — 클라이언트 라우팅 판단용

### 자동 토큰 갱신 흐름

```
fetchAPI() → 401 응답
    → POST /api/auth/refresh (refreshToken 쿠키 자동 전송)
    → 성공: 새 accessToken → tokenStore.set(), 원 요청 재시도
    → 실패: handleAuthFailure() → userType 기반 로그인 페이지로 리다이렉트
```

### 미들웨어 인증 검사

위치: `middleware.ts` (루트)

보호 경로: `/company/*`, `/user/*`, `/admin/*`
공개 경로: `/`, `/jobs`, `/jobs/*`, `/login`, `/company-login`, `/signup/*`

### 토큰 타입 → 사용자 타입 매핑

| JWT `type` 클레임 | 사용자 타입 | 로그인 경로 |
|------------------|------------|------------|
| `access` | 일반 사용자 | `/login` (Google OAuth) |
| `access_company` | 기업 | `/company-login` |
| `admin_access` | 관리자 | `/admin/login` |

---

## 4. API 도메인별 엔드포인트 목록

### Auth (`/api/auth/*`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| GET | `/api/auth/login/google` | 없음 | 구현됨 |
| GET | `/api/auth/login/google/callback` | 없음 | 구현됨 |
| POST | `/api/auth/signup` | 없음 | 구현됨 |
| DELETE | `/api/auth/logout` | Cookie | 구현됨 |
| POST | `/api/auth/refresh` | RefreshCookie | 구현됨 |
| POST | `/api/auth/email/certify` | 없음 | 구현됨 |
| POST | `/api/auth/email/certify/verify` | 없음 | 구현됨 |
| POST | `/api/auth/company/signup` | 없음 | 구현됨 |
| POST | `/api/auth/company/login` | 없음 (form) | 구현됨 |

### Profile (`/api/me`, `/api/contact`, `/api/account-config`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| GET | `/api/me` | User | 구현됨 |
| PUT | `/api/me` | User | 구현됨 |
| GET | `/api/contact` | User | 구현됨 |
| PUT | `/api/contact` | User | 구현됨 |
| GET | `/api/account-config` | User | 구현됨 |
| PUT | `/api/account-config` | User | 구현됨 |

### Company Profile (`/api/company-profile`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| GET | `/api/company-profile` | Company | 구현됨 |
| POST | `/api/company-profile` | Company | 구현됨 |
| PUT | `/api/company-profile` | Company | 구현됨 |

### Posts / Company (`/api/posts/company/*`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| GET | `/api/posts/company/` | Company | 구현됨 (내 회사 공고) |
| GET | `/api/posts/company/{id}` | 없음 | 구현됨 (공개 상세) |
| POST | `/api/posts/company` | Company | 구현됨 |
| PUT | `/api/posts/company/{id}` | Company | 구현됨 |
| DELETE | `/api/posts/company/{id}` | Company | 구현됨 |
| GET | `/api/posts/company/list` | 없음 | **미구현** — 서버에 없음 |

### Posts / Resume (`/api/posts/resume/*`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| GET | `/api/posts/resume/list/me` | User | 구현됨 |
| GET | `/api/posts/resume/{id}` | User | 구현됨 |
| POST | `/api/posts/resume` | User | 구현됨 |
| PUT | `/api/posts/resume/{id}` | User | 구현됨 |
| DELETE | `/api/posts/resume/{id}` | User | 구현됨 |

### Diagnosis (`/api/diagnosis/*`)

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| POST | `/api/diagnosis/answer` | User | 구현됨 |
| GET | `/api/diagnosis/answer/{id}` | User | 구현됨 |

### Applications (`/api/applications`) — 미구현

| 메서드 | 경로 | 인증 | 상태 |
|--------|------|------|------|
| POST | `/api/applications` | User | **미구현** — 서버에 없음 |

### Next.js Route Handlers (이 레포)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 체크 |
| POST | `/api/revalidate` | ISR 캐시 재검증 |
| POST | `/api/verify-business` | 국세청 사업자등록번호 검증 프록시 |

---

## 5. 에러 처리 패턴

### FetchError 처리 (Client Component)

```typescript
import { FetchError } from '@/shared/api/fetchClient';
import { normalizeError } from '@/shared/api/types';

try {
  const data = await fetchClient.post('/api/auth/company/login', payload);
} catch (error) {
  if (error instanceof FetchError) {
    const { isAuth, isServer, message } = normalizeError(error);
    if (isAuth) router.push('/login');
    else if (isServer) toast.error('서버 오류. 잠시 후 다시 시도해주세요.');
    else toast.error(message);
  }
}
```

### Server Component 에러 처리

```typescript
import { notFound } from 'next/navigation';
import { FetchError } from '@/shared/api/fetchClient';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  try {
    const post = await fetchClient.get<CompanyPostDetailResponse>(
      `/api/posts/company/${params.id}`,
      { next: { revalidate: 1800, tags: [`job-${params.id}`] } }
    );
    return <JobDetailView post={post} />;
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) notFound();
    throw error;
  }
}
```

### Route Handler 에러 패턴

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[route-name] 오류:', error);
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

### FastAPI 에러 메시지 추출

```typescript
import { extractErrorMessage } from '@/shared/api/types';
const message = extractErrorMessage(error.data);
```

---

## 6. Next.js Route Handlers

### 사용 시점

Route Handler는 다음 경우에만 작성합니다:

1. **외부 API 시크릿 보호**: 브라우저에 노출되면 안 되는 API 키 사용 (예: 국세청 API)
2. **ISR 재검증 트리거**: FastAPI 서버가 Next.js 캐시를 무효화할 때
3. **파일 업로드 프록시**: 대용량 파일을 서버에서 처리해야 할 때
4. **웹훅 수신**: 외부 서비스 콜백 처리

**일반 CRUD는 Route Handler를 거치지 말고 fetchClient로 FastAPI에 직접 요청하세요.**

### 작성 패턴

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Named export 필수 (default export 금지)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';
  return NextResponse.json({ page });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
```

### 동적 경로 Route Handler

```typescript
// src/app/api/[resource]/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 16: params는 Promise
  return NextResponse.json({ id });
}
```

---

## 7. 타입 시스템

### 타입 파일 위치

| 파일 | 용도 |
|------|------|
| `src/shared/types/api.ts` | FastAPI 요청/응답 도메인 타입 전체 |
| `src/shared/types/common.types.ts` | UserInfo 등 전역 공통 타입 |
| `src/shared/types/enums.ts` | 열거형 상수 |
| `src/shared/api/types.ts` | API 래퍼 타입, 에러 타입, 유틸 함수 |
| `src/features/*/types/*.ts` | 도메인 내부 타입 (feature 외부 사용 금지) |

### API 응답 타입 정의 패턴

```typescript
// FastAPI가 직접 객체를 반환하는 경우 (대부분)
export interface CompanyPostDetailResponse {
  id: number;
  company_id: number;
  title: string;
}

// FastAPI가 리스트를 반환하는 경우
export interface CompanyPostsListResponse {
  company_posts: CompanyPost[];
  count: number;
  skip: number;
  limit: number;
}

// 제네릭 래퍼 사용
import type { PaginatedResponse } from '@/shared/api/types';
type JobsPage = PaginatedResponse<CompanyPost>;
```

### 새 API 타입 추가 규칙

1. FastAPI Pydantic 모델과 필드명 동일 유지 (`snake_case`)
2. `Optional` 필드는 TypeScript `?:` 사용
3. `datetime` 필드는 `string` (ISO 8601)
4. `Enum` 필드는 TypeScript `union type` 또는 `enums.ts` 사용

---

## 8. Claude AI 작업 지침 (BE Engineer용)

### 작업 전 필독

1. **API 타입 확인**: `src/shared/types/api.ts` — 이미 정의된 타입 재사용
2. **fetchClient 패턴**: `src/shared/api/fetchClient.ts` — 수정 금지, 사용법만 숙지
3. **기존 Route Handler 참고**: `src/app/api/verify-business/route.ts`

### AI에게 API 작업 요청 시 포함할 정보

```
- 대상 엔드포인트: GET /api/posts/company/{id}
- 인증 필요 여부: 없음 (공개)
- 캐싱 전략: ISR revalidate 1800, tags: ['job-{id}']
- 요청 타입: 없음
- 응답 타입: CompanyPostDetailResponse (api.ts 참조)
- 에러 처리: 404 → notFound(), 기타 → throw
```

### 금지 사항

- `fetchClient.ts` 직접 수정
- `fetch()` 직접 호출 (fetchClient 대신)
- `import React from 'react'` (React 19, 불필요)
- `export default` 사용 (Named export 사용)
- 하드코딩 API URL (환경변수 사용)

### 빠른 참조

```typescript
// Server Component ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['tag'] }
});

// Client Component (React Query)
const { data } = useQuery({
  queryKey: ['endpoint', id],
  queryFn: () => fetchClient.get<T>(`/api/endpoint/${id}`),
});

// 에러 분류
import { normalizeError } from '@/shared/api/types';
const { isAuth, isNotFound, isServer } = normalizeError(error);
```

---

## 참조 파일

- **API 패턴 스킬**: `.claude/skills/api-patterns/SKILL.md`
- **인증 패턴 스킬**: `.claude/skills/auth-patterns/SKILL.md`
- **훅 패턴**: `.claude/skills/hooks-patterns.md`
- **FSD 패턴**: `.claude/skills/fsd-patterns/SKILL.md`
# Work in Korea — PM 가이드

## 프로젝트 개요

**Work in Korea**는 외국인 구직자와 한국 기업을 연결하는 채용 플랫폼이다.

| 구분 | 내용 |
|------|------|
| 핵심 사용자 | 구직자(외국인), 기업 담당자, 관리자 |
| 핵심 가치 | 언어 장벽 없는 취업 매칭 |
| 기술 스택 | Next.js 16 + FastAPI + PostgreSQL |
| 아키텍처 | FSD (Feature-Sliced Design), 11개 도메인 슬라이스 |

---

## 기능 도메인 맵

| 도메인 슬라이스 | 비즈니스 목적 | 주요 사용자 |
|---------------|------------|-----------|
| `auth` | 회원가입/로그인 (Google OAuth + 이메일) | 구직자, 기업 |
| `jobs` | 채용공고 탐색·필터·상세 조회 | 구직자 |
| `company` | 기업 대시보드, 공고 관리 | 기업 담당자 |
| `profile` | 구직자 프로필 관리 | 구직자 |
| `resume` | 이력서 작성·편집 | 구직자 |
| `diagnosis` | 직무 적합도 자가진단 | 구직자 |
| `landing` | 랜딩/홈 페이지 | 미인증 방문자 |
| `admin` | 사용자·기업·공고 관리 | 관리자 |
| `events` | 채용 이벤트/공지 | 전체 |
| `user` | 마이페이지 (지원 내역 등) | 구직자 |
| `shared` | 공통 컴포넌트, API 유틸 | — |

---

## API 현황 (실제 서버 기반)

### 구현 완료된 엔드포인트

```
# Auth
GET  /api/auth/login/google
GET  /api/auth/login/google/callback
POST /api/auth/signup
DELETE /api/auth/logout
POST /api/auth/refresh
POST /api/auth/email/certify
POST /api/auth/email/certify/verify
POST /api/auth/company/signup
POST /api/auth/company/login

# Profile (구직자, 인증 필요)
GET  /api/me           → 프로필 조회
PATCH /api/me          → 프로필 수정 (일부 필드만 가능)
GET  /api/contact      → 연락처 조회
PATCH /api/contact     → 연락처 수정
GET  /api/account-config
PATCH /api/account-config

# Company Profile
GET  /api/company-profile
POST /api/company-profile
PATCH /api/company-profile

# Posts - Company (채용공고)
GET  /api/posts/company/list     → 공개 채용공고 목록 (skip/limit)
GET  /api/posts/company          → 내 회사 공고 목록 (기업 인증)
GET  /api/posts/company/{id}     → 공고 상세 (공개)
POST /api/posts/company          → 공고 생성 (기업 인증)
PUT  /api/posts/company/{id}     → 공고 수정 (기업 인증)
DELETE /api/posts/company/{id}   → 공고 삭제 (기업 인증)

# Posts - Resume (이력서)
GET  /api/posts/resume/list/me   → 내 이력서 목록 (인증)
GET  /api/posts/resume/{id}      → 이력서 상세 (인증)
POST /api/posts/resume           → 이력서 생성 (인증)
PUT  /api/posts/resume/{id}      → 이력서 수정 (인증)
DELETE /api/posts/resume/{id}    → 이력서 삭제 (인증)

# Diagnosis
POST /api/diagnosis/answer       → 진단 답변 저장
GET  /api/diagnosis/answer/{id}  → 진단 결과 조회
```

### 미구현 (서버 구현 필요)

| 기능 | 예상 엔드포인트 | 우선순위 |
|------|--------------|--------|
| 채용공고 지원 | `POST /api/applications` | P0 |
| 지원 내역 조회 | `GET /api/applications/me` | P0 |
| 지원 취소 | `DELETE /api/applications/{id}` | P1 |
| 공고에 달린 지원자 목록 | `GET /api/posts/company/{id}/applicants` | P1 |
| 북마크 저장/삭제 | `POST/DELETE /api/bookmarks` | P2 |
| 공개 기업 정보 조회 | `GET /api/company/{id}` | P1 |

---

## PM 작업 가이드

### Acceptance Criteria 작성 원칙

- **Given/When/Then** 형식 사용
- 각 AC는 하나의 행동만 검증
- Happy path + Edge case 모두 포함
- API 응답 코드까지 명시 (200/201/400/401/404)

### AC 템플릿

```markdown
## Feature: [기능명]

### Scenario: [시나리오명]
**Given** [사전 조건]
**When** [사용자 액션]
**Then** [기대 결과]

### Edge Cases
- [ ] 빈 입력값 처리
- [ ] 인증 만료 처리
- [ ] 네트워크 에러 처리
```

### 우선순위 기준 (MoSCoW)

| 레벨 | 기준 |
|------|------|
| P0 Must | 핵심 플로우 없이 제품 동작 불가 |
| P1 Should | 사용자 경험에 직접 영향 |
| P2 Could | 있으면 좋지만 없어도 동작 |
| P3 Won't | 이번 릴리즈 제외 |

---

## Claude AI 작업 지침 (PM용)

AI에게 요구사항 관련 작업을 요청할 때:

```
# 좋은 요청 예시
"GET /api/posts/company/list 응답에서 company_name이 없는데,
 JobCard에 회사명을 표시해야 해. 서버 수정 없이 클라이언트에서
 어떻게 처리할 수 있을지 방안 2가지 제시해줘"

"이력서 지원 플로우 acceptance criteria 작성해줘.
 POST /api/applications 미구현 상태 고려해서 작성해."
```

- 항상 **실제 API 엔드포인트** 기반으로 요청
- 미구현 기능은 반드시 명시
- 클라이언트/서버 구분 명확히

---

## 관련 Skills & Agents

- **FSD 구조**: `.claude/skills/fsd-patterns/SKILL.md`
- **API 패턴**: `.claude/skills/api-patterns/SKILL.md`
- **인증 흐름**: `.claude/skills/auth-patterns/SKILL.md`
- **Planner Agent**: `@.claude/agents/planner.md`
- **Feature Architect**: `@.claude/agents/feature-architect.md`
