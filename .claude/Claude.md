# WorkinKorea Client

외국인 구직자 ↔ 한국 기업 채용 플랫폼.
Next.js 16 + FastAPI(:8000) + PostgreSQL, Feature-Sliced Design 아키텍처.

---

## 기술 스택

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| Framework | Next.js (App Router) | 16.1+ |
| Language | TypeScript | 5+ |
| UI | React | 19 |
| Styling | TailwindCSS v4 | 4.1+ |
| Animation | Framer Motion | 12+ |
| State | Zustand | 5+ |
| Data Fetching | TanStack React Query | 5+ |
| Forms | React Hook Form + Zod | 7+ / 4+ |
| i18n | next-intl (쿠키 기반, URL 변경 없음) | 4.8+ |
| Icons | Lucide React | 0.541+ |
| PWA | @ducanh2912/next-pwa | 10+ |
| Testing | Vitest + React Testing Library | 4+ |

---

## 아키텍처

```
Browser → Next.js Middleware (라우트 가드 + bridge 쿠키)
       → Next.js Rewrite (/api/* → FastAPI :8000)
       → fetchClient (credentials: 'same-origin')
       → Components
```

### FSD 도메인 슬라이스 (src/features/)

`auth` · `jobs` · `company` · `profile` · `resume` · `diagnosis` · `landing` · `admin` · `events` · `user` · `pwa`

각 도메인 구조: `api/` · `components/` · `pages/` · `hooks/` · `types/` · `validations/` · `store/`

---

## 인증 시스템

### 쿠키 구조
| 쿠키 | 설정 주체 | HttpOnly | 용도 |
|------|----------|----------|------|
| `access_token` | 백엔드 | ✓ | API 인증 (자동 전송) |
| `refresh_token` | 백엔드 | ✓ | 토큰 갱신 |
| `userType` | 백엔드 | ✓ | 미들웨어 라우트 가드 |
| `userTypeClient` | 미들웨어 | ✗ | 클라이언트 JS에서 userType 읽기 (bridge) |
| `locale` | 클라이언트 | ✗ | 언어 설정 (ko/en) |

### 인증 흐름
1. 로그인 → 백엔드가 HttpOnly 쿠키 설정
2. 페이지 로드 → 미들웨어가 `userType` → `userTypeClient` bridge 쿠키 동기화
3. `authStore.initialize()` → `POST /refresh` → bridge 쿠키로 userType 판별
4. 401 발생 → `refreshToken()` (single-flight, 최대 3회) → 실패 시 로그인 리다이렉트

### JWT type 클레임 → 로그인 경로
- `access` → `/login`
- `access_company` → `/company-login`
- `admin_access` → `/admin/login`

---

## fetchClient

`src/shared/api/fetchClient.ts`

```typescript
// Client-side: 상대경로 (Next.js rewrite → backend)
// Server-side: SERVER_API_URL (Docker 내부)

fetchClient.get<T>(url, options?)
fetchClient.post<T>(url, data?, options?)
fetchClient.put<T>(url, data?, options?)
fetchClient.patch<T>(url, data?, options?)
fetchClient.delete<T>(url, options?)

// Server Component ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['jobs'] }
});

// 에러 처리
class FetchError { status: number; data?: unknown; }
```

### 캐싱 전략
| 데이터 | 전략 | 옵션 |
|--------|------|------|
| 공개 공고 목록/상세 | ISR | `{ next: { revalidate: 3600, tags: ['jobs'] } }` |
| 사용자 프로필/이력서/진단 | SSR | `{ cache: 'no-store' }` |
| 기업 프로필 | ISR | `{ next: { revalidate: 7200, tags: ['company'] } }` |

---

## Indigo Design System

### 컬러 토큰

```css
/* Primary (Vivid Indigo) */
blue-600   #425AD5   /* 주요 액션, 버튼, 링크 */
blue-700   #4250B8   /* hover 상태 */
blue-500   #516AEC   /* 보조 강조 */
blue-50    #F3F6FF   /* 배경 강조 영역 */

/* Text (Clean Gray) */
slate-900  #24292E   /* 헤딩 */
slate-700  #3F4750   /* 서브텍스트 */
slate-500  #6A737D   /* placeholder, 비활성 */

/* Border / Background */
slate-200  #DEE2E6   /* 기본 구분선 */
slate-50   #F8F9FA   /* 페이지 배경 */

/* Status */
emerald-500 #40C057  /* success */
red-500     #FA5252  /* error */
amber-500   #FAB005  /* warning */
```

### 타이포그래피 (Canonical 클래스만 사용)

> **금지**: `text-sm`, `text-lg`, `text-[13px]` 등 Tailwind 기본 크기/임의 픽셀

| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-display-1` | 48px | 히어로 최대 제목 |
| `text-display-2` | 40px | 주요 섹션 제목 |
| `text-title-1` | 32px | 페이지 타이틀 |
| `text-title-2` | 28px | 카드/섹션 제목 |
| `text-title-3` | 24px | 서브 제목 |
| `text-title-4` | 20px | 소제목 |
| `text-title-5` | 17px | 작은 소제목 |
| `text-body-1` | 16px | 본문 (기본) |
| `text-body-2` | 15px | 본문 (보조) |
| `text-body-3` | 14px | 본문 (작은) |
| `text-label-1` | 14px | 버튼, 레이블 |
| `text-label-2` | 13px | 작은 레이블 |
| `text-caption-1` | 13px | 캡션, 메타 정보 |
| `text-caption-2` | 12px | 최소 캡션 |
| `text-caption-3` | 11px | 극소 캡션 |

### 폰트
- `font-pretendard` — 본문 전용
- `font-['Plus_Jakarta_Sans']` — 로고/브랜드 전용

### 라디우스 / 그림자
```
rounded-sm(8px) rounded-md(12px) rounded-lg(16px) rounded-xl(24px) rounded-2xl(32px) rounded-full
shadow-sm(카드) shadow-md(드롭다운) shadow-xl(모달)
```

---

## 컴포넌트 카탈로그 (src/shared/ui/)

### 기본 입력
`Button` · `IconButton` · `Input` · `FormField` · `ErrorMessage` · `Checkbox` · `Radio` · `SegmentedControl` · `DatePicker` · `SelectSearchInput` · `DaumPostcodeSearch` · `SchoolSearch`

### 레이아웃
`Card` (Header/Title/Description/Content/Footer/Image) · `Modal` · `AccordionItem` · `Divider` · `Portal` · `BackToTop`

### 피드백
`LoadingSpinner` · `Badge` (Numeric/Dot/Indicator) · `Callout` (Info/Warning/Error/Success) · `EmptyState` · `StatCard`

### 데이터 표시
`Skeleton` · `SkeletonCards` (JobCard/JobList/JobDetail/UserProfile/CompanyDashboard/Table 등 11종) · `OptimizedImage` · `MarkdownContent` · `ResumeCard` · `ResumeUpload` · `SkillProgressBar` · `RadarChart` · `TermsModal`

### 레이아웃 컴포넌트 (src/shared/components/)
`Header` · `HeaderClient` · `MobileNav` · `Container` · `Layout` · `LanguageToggle` · `UserTypeToggle` · `BetaPopup` · `StructuredData` (SEO)

---

## 로고

| 파일 | 용도 | 위치 |
|------|------|------|
| `workinkorea_app_logo.png` | W 아이콘 (메인, 모바일) | Header 모바일, 로그인 페이지 |
| `workinkorea_logo.png` | W + 텍스트 (데스크톱) | Header lg+, MobileNav 하단 |

---

## 페이지 라우트 구조

### (main) 그룹
```
/                          랜딩 페이지
/jobs                      채용공고 목록
/jobs/[id]                 공고 상세
/self-diagnosis            자가진단 시작
/diagnosis                 진단 진행
/diagnosis/result          진단 결과
/faq                       자주 묻는 질문
/privacy · /terms · /support  정책 페이지
/company                   기업 랜딩 (공개)
/company/jobs              공고 관리 (Company 인증)
/company/posts/create      공고 등록
/company/posts/edit/[id]   공고 수정
/company/profile/edit      기업 프로필 수정
/company/applicants        지원자 관리
/company/settings          기업 설정
/user/profile              내 프로필
/user/profile/edit         프로필 편집
/user/profile/setup        초기 프로필 생성
/user/resume               이력서 목록
/user/resume/create        이력서 작성
/user/resume/edit/[id]     이력서 수정
/user/applications         지원 내역
/user/bookmarks            북마크
/user/settings             사용자 설정
```

### (auth) 그룹
```
/login · /login-select · /signup · /signup-select
/company-login · /company-signup (step1, step2)
/auth/callback             OAuth 콜백
```

### (admin) 그룹
```
/admin                     대시보드
/admin/login               관리자 로그인
/admin/users · /posts · /companies · /events
```

---

## API 엔드포인트 현황

### 구현됨 (백엔드)
```
# Auth
GET  /api/auth/login/google[/callback]
POST /api/auth/signup, /refresh, /email/certify[/verify]
POST /api/auth/company/signup, /company/login
DELETE /api/auth/logout

# Profile (User 인증)
GET/PUT /api/me, /api/contact, /api/account-config

# Company Profile (Company 인증)
GET/POST/PUT /api/company-profile

# Posts - Company
GET  /api/posts/company/list     (공개 목록)
GET  /api/posts/company          (내 공고, Company 인증)
GET  /api/posts/company/{id}     (공개 상세)
POST/PUT/DELETE /api/posts/company[/{id}]

# Posts - Resume (User 인증)
GET/POST /api/posts/resume, /posts/resume/list/me
GET/PUT/DELETE /api/posts/resume/{id}

# Diagnosis
POST /api/diagnosis/answer
GET  /api/diagnosis/answer/{id}

# Admin
GET/PUT/DELETE /api/admin/users, /companies, /posts
```

### 미구현 (서버 구현 필요)
| 기능 | 엔드포인트 | 우선순위 |
|------|-----------|--------|
| 채용 지원 | `POST /api/applications` | P0 |
| 지원 내역 | `GET /api/applications/me` | P0 |
| 지원 취소 | `DELETE /api/applications/{id}` | P1 |
| 지원자 목록 | `GET /api/posts/company/{id}/applicants` | P1 |
| 북마크 | `POST/DELETE /api/bookmarks` | P2 |

### Next.js Route Handlers
`GET /api/health` · `POST /api/revalidate` · `POST /verify-business`

---

## 금지 사항

- `fetch()` 직접 호출 → `fetchClient` 사용
- `import React from 'react'` → React 19 자동 변환
- `export default` → named export (페이지/라우트 파일 제외)
- `text-sm`, `text-lg`, `text-[13px]` → canonical 클래스만
- `gray-*` → `slate-*` 사용
- `green-*` → `emerald-*`, `purple-*` → `blue-*`
- 하드코딩 API URL
- 하드코딩 한국어 문자열 → `useTranslations()` 사용
- 커밋 자동 실행 → 명시적 요청 시만

---

## 타입 파일

| 파일 | 용도 |
|------|------|
| `src/shared/types/api.ts` | FastAPI 요청/응답 타입 |
| `src/shared/types/common.types.ts` | UserInfo 등 공통 타입 |
| `src/shared/types/enums.ts` | 열거형 상수 |
| `src/shared/api/types.ts` | API 래퍼/에러 타입 |
| `src/features/*/types/*.ts` | feature 내부 전용 |

타입 규칙: 필드명 `snake_case`, Optional → `?:`, datetime → `string` (ISO 8601)

---

## Framer Motion 패턴

```tsx
// Stagger (목록)
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

// Spring Hover (카드)
whileHover={{ y: -6 }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}

// ease 배열 캐스팅 필수
ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
```

---

## i18n

- 번역 파일: `messages/ko.json`, `messages/en.json` (1,400+ 키)
- 쿠키 기반 언어 감지 (`locale` 쿠키, URL 구조 변경 없음)
- 클라이언트 컴포넌트: `useTranslations('namespace')`
- 서버 컴포넌트: `getTranslations('namespace')` from `next-intl/server`

---

## 빠른 참조

```typescript
// Server ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['jobs'] }
});

// Client (React Query)
const { data } = useQuery({
  queryKey: ['key', id],
  queryFn: () => fetchClient.get<T>(`/api/endpoint/${id}`),
});

// 동적 Route Handler params (Next.js 16)
const { id } = await params; // params는 Promise

// i18n
const t = useTranslations('common.nav');
<span>{t('login')}</span>
```

---

## 관련 Skills & Agents

- API 패턴: `.claude/skills/api-patterns/SKILL.md`
- 인증 패턴: `.claude/skills/auth-patterns/SKILL.md`
- FSD 패턴: `.claude/skills/fsd-patterns/SKILL.md`
- 디자인 패턴: `.claude/skills/design-patterns/SKILL.md`
- 폼 패턴: `.claude/skills/form-patterns/SKILL.md`
- 테스트 패턴: `.claude/skills/testing-patterns/SKILL.md`
