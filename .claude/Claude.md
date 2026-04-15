# Work in Korea — Designer 가이드

## Indigo Design System

### 컬러 토큰

```css
/* Primary (Vivid Indigo) */
blue-600   #425AD5   /* 주요 액션, 버튼, 링크 */
blue-700   #4250B8   /* hover 상태 */
blue-500   #516AEC   /* 보조 강조 */
blue-50    #F3F6FF   /* 배경 강조 영역 */
blue-100   #E5E8FD   /* 연한 배경 */
blue-200   #CBD2FA   /* 매우 연한 배경/보더 */

/* Text (Clean Gray) */
slate-900  #24292E   /* 헤딩 */
slate-800  #2F363D   /* 본문 */
slate-700  #3F4750   /* 서브텍스트 */
slate-500  #6A737D   /* placeholder, 비활성 */
slate-400  #868E96   /* 비활성 아이콘 */

/* Border (Clean) */
slate-200  #DEE2E6   /* 기본 구분선 */
slate-100  #F1F3F5   /* 연한 구분선 */

/* Background (Clean) */
white      #FFFFFF   /* 카드, 모달 배경 */
slate-50   #F8F9FA   /* 페이지 배경 */
slate-100  #F1F3F5   /* 대체 배경 */

/* Status (Vivid) */
emerald-500 #40C057  /* success */
red-500     #FA5252  /* error */
amber-500   #FAB005  /* warning */
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
shadow-sm   /* 카드 기본 */
shadow-md   /* 드롭다운, 호버 */
shadow-xl   /* 모달, 팝업 */
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

## 프로젝트 개요
외국인 구직자 ↔ 한국 기업 채용 플랫폼. Next.js 16 + FastAPI(:8000) + PostgreSQL, FSD 아키텍처.

---

## 아키텍처

```
FastAPI (:8000) → Next.js Route Handlers (src/app/api/**) → fetchClient → Components
```

**fetchClient** (`src/shared/api/fetchClient.ts` — 수정 금지)
- 서버: `SERVER_API_URL` (Docker 내부), 클라이언트: `""` (상대경로) 자동 감지
- `fetchClient.get/post/put/patch/delete<T>(url, options?)`
- `FetchError` (status, data), `normalizeError()` (isAuth/isNotFound/isServer)

---

## 캐싱 전략

| 데이터 | 전략 | 옵션 |
|--------|------|------|
| 공개 공고 목록/상세 | ISR | `{ next: { revalidate: 3600, tags: ['jobs'] } }` |
| 사용자 프로필/이력서/진단 | SSR | `{ cache: 'no-store' }` |
| 기업 프로필 | ISR | `{ next: { revalidate: 7200, tags: ['company'] } }` |

ISR 무효화: `POST /api/revalidate { "tag": "jobs", "secret": "..." }`

---

## 인증

- **refreshToken**: HttpOnly Cookie, **accessToken**: in-memory `tokenStore`, **userType**: Public Cookie
- 401 → `POST /api/auth/refresh` → 성공 시 재시도, 실패 시 로그인 리다이렉트
- JWT `type` 클레임: `access`→`/login`, `access_company`→`/company-login`, `admin_access`→`/admin/login`
- 미들웨어 보호: `/company/*`, `/user/*`, `/admin/*`

---

## API 엔드포인트 현황

### 구현됨
```
# Auth
GET  /api/auth/login/google[/callback]
POST /api/auth/signup, /auth/refresh, /auth/email/certify[/verify]
POST /api/auth/company/signup, /auth/company/login
DELETE /api/auth/logout

# Profile (User 인증)
GET/PUT /api/me, /api/contact, /api/account-config

# Company Profile (Company 인증)
GET/POST/PUT /api/company-profile

# Posts - Company
GET  /api/posts/company/list     공개 목록
GET  /api/posts/company          내 공고 (Company 인증)
GET  /api/posts/company/{id}     공개 상세
POST/PUT/DELETE /api/posts/company[/{id}]  (Company 인증)

# Posts - Resume (User 인증)
GET/POST /api/posts/resume, /posts/resume/list/me
GET/PUT/DELETE /api/posts/resume/{id}

# Diagnosis (User 인증)
POST /api/diagnosis/answer
GET  /api/diagnosis/answer/{id}
```

### 미구현 (서버 구현 필요)
| 기능 | 엔드포인트 | 우선순위 |
|------|-----------|--------|
| 채용 지원 | `POST /api/applications` | P0 |
| 지원 내역 | `GET /api/applications/me` | P0 |
| 지원 취소 | `DELETE /api/applications/{id}` | P1 |
| 지원자 목록 | `GET /api/posts/company/{id}/applicants` | P1 |
| 공개 기업 정보 | `GET /api/company/{id}` | P1 |
| 북마크 | `POST/DELETE /api/bookmarks` | P2 |

### Next.js Route Handlers (이 레포)
`GET /api/health`, `POST /api/revalidate`, `POST /api/verify-business`
> Route Handler는 시크릿 보호/ISR 재검증/파일 업로드/웹훅 수신 시만 작성. 일반 CRUD는 fetchClient 직접 사용.

---

## 타입 파일 위치

| 파일 | 용도 |
|------|------|
| `src/shared/types/api.ts` | FastAPI 요청/응답 타입 |
| `src/shared/types/common.types.ts` | UserInfo 등 공통 타입 |
| `src/shared/types/enums.ts` | 열거형 상수 |
| `src/shared/api/types.ts` | API 래퍼/에러 타입, 유틸 |
| `src/features/*/types/*.ts` | feature 내부 전용 |

타입 규칙: 필드명 `snake_case` 유지, Optional → `?:`, datetime → `string` (ISO 8601)

---

## 금지 사항
- `fetchClient.ts` 직접 수정
- `fetch()` 직접 호출
- `import React from 'react'` (React 19)
- `export default` (named export 사용)
- 하드코딩 API URL

---

## FSD 도메인 슬라이스

`auth` · `jobs` · `company` · `profile` · `resume` · `diagnosis` · `landing` · `admin` · `events` · `user` · `shared`

---

## 빠른 참조

```typescript
// Server ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['tag'] }
});

// Client (React Query)
const { data } = useQuery({
  queryKey: ['key', id],
  queryFn: () => fetchClient.get<T>(`/api/endpoint/${id}`),
});

// 에러 처리
const { isAuth, isNotFound, isServer, message } = normalizeError(error);

// 동적 Route Handler params (Next.js 16)
const { id } = await params; // params는 Promise
```

---

## 관련 Skills
- API 패턴: `.claude/skills/api-patterns/SKILL.md`
- 인증 패턴: `.claude/skills/auth-patterns/SKILL.md`
- FSD 패턴: `.claude/skills/fsd-patterns/SKILL.md`
- 디자인: `.claude/skills/design-patterns/SKILL.md`
