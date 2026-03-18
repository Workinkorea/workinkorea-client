# Work in Korea - 프로젝트 가이드

## 🤖 Claude AI 작업 지침 및 참조 파일 (필독)

이 프로젝트에서 코드를 작성하거나 수정할 때는, 아래 명시된 에이전트 역할과 스킬 패턴 파일들을 반드시 먼저 읽고 본 가이드의 규칙을 엄격히 준수하세요.

### Agents

- @agents/auth-specialist.md
- @agents/code-reviewer.md
- @agents/debugger.md
- @agents/feature-architect.md
- @agents/nextjs-specialist.md
- @agents/planner.md
- @agents/testing-specialist.md
- @agents/ui-specialist.md

### Skills (Patterns)

- @skills/api-patterns/SKILL.md
- @skills/auth-patterns/SKILL.md
- @skills/design-patterns/SKILL.md
- @skills/form-patterns/SKILL.md
- @skills/fsd-patterns/SKILL.md
- @skills/testing-patterns/SKILL.md

---

## 프로젝트 컨텍스트

외국인 근로자를 위한 한국 취업 지원 플랫폼.

| 항목 | 내용 |
|------|------|
| **클라이언트** | Next.js 16 App Router, React 19, TypeScript |
| **서버** | FastAPI (Python 3.13+), SQLAlchemy 2.0 (async), PostgreSQL, Redis |
| **인증** | JWT (access + refresh) + HttpOnly Cookie + Google OAuth |
| **아키텍처** | Feature-Sliced Design (클라이언트) / 클린 아키텍처 (서버) |
| **파일 저장소** | MinIO (S3 호환) |
| **배포** | Docker Standalone (양쪽 모두) |

### 두 저장소

```
~/Documents/GitHub/
├── workinkorea-client/   # Next.js 프론트엔드
└── workinkorea-server-1/ # FastAPI 백엔드
```

---

## 디자인 시스템 (Blue Design System)

모든 UI 컴포넌트는 아래 Blue Design System 토큰을 기반으로 구현합니다.

### Color Tokens

- **Primary**: blue-50(#EFF6FF) ~ blue-950(#172554), 메인 액션 색상은 **blue-600(#2563EB)**
- **Neutral**: slate-50(#F8FAFC) ~ slate-900(#0F172A), 본문 기본 색상은 **slate-800(#1E293B)**
- **Semantic**: success(#10B981), warning(#F59E0B), error(#EF4444), info(#3B82F6)

### Typography

- **기본 폰트**: `Pretendard` (로컬 woff2, `--font-pretendard`)
- **로고/브랜드**: `Plus Jakarta Sans` (`--font-plus-jakarta-sans`, font-weight: 800)

#### ⚠️ 폰트 크기 — 반드시 Canonical 클래스 사용 (arbitrary px 금지)

`text-[13px]` 같은 arbitrary 값 사용 금지. 반드시 globals.css에 정의된 클래스 사용:

| Canonical 클래스 | 크기 | 용도 |
|-----------------|------|------|
| `text-display-1` | 48px | 최대 히어로 타이틀 |
| `text-display-2` | 40px | 히어로 타이틀 |
| `text-title-1` | 32px | 섹션 대형 타이틀 |
| `text-title-2` | 28px | 섹션 타이틀 |
| `text-title-3` | 24px | 페이지 타이틀 |
| `text-title-4` | 20px | 카드 대형 타이틀 |
| `text-title-5` | 17px | 카드 타이틀 |
| `text-body-1` | 16px | 본문 대형 |
| `text-body-2` | 15px | 본문 |
| `text-body-3` | 14px | 본문 소형 |
| `text-caption-1` | 13px | 캡션 대형, 레이블 |
| `text-caption-2` | 12px | 캡션 |
| `text-caption-3` | 11px | 캡션 최소 |

responsive 변형도 동일: `sm:text-title-1`, `lg:text-body-3` 등

```tsx
// ❌ Bad
<p className="text-[13px]">...</p>
<h2 className="text-[28px] sm:text-[32px]">...</h2>

// ✅ Good
<p className="text-caption-1">...</p>
<h2 className="text-title-2 sm:text-title-1">...</h2>
```

### Spacing & Radius

- **Spacing**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px
- **Radius**: sm(6), md(8), lg(12), xl(16), 2xl(20), full(9999) px
- **Shadow**: sm, md, lg, xl, blue(0 4px 14px rgba(37,99,235,0.25))

### 컴포넌트 규칙

- **Button**: primary(blue-600), secondary(blue-50+border), outline(white+border), ghost(transparent) / 크기: sm, md, lg
- **Input**: border slate-200, focus시 border-blue-500 + ring blue-100 / label 13px 600 slate-700
- **Card**: white bg, border slate-200, radius-xl / hover시 shadow-lg + border blue-200
- **Badge**: radius-full, 11px 600 / blue, green, orange, red 변형
- **Tab**: border-bottom 2px / active: blue-600 indicator
- **아이콘 버튼 (Header 등)**: `focus:outline-none`만 사용, `focus:ring-*` 미적용

---

## 코드 스타일

### 기본 규칙

- **모듈 시스템**: ES 모듈 사용 (import/export)
- **TypeScript**: strict mode 활성화, 타입 안정성 최우선
- **내보내기**: Named export 선호 (default export는 Next.js 페이지/라우트만 사용)
- **컴포넌트**: 함수형 컴포넌트만 사용 (React 19 + React Compiler 활성화)
- **`import React from 'react'` 불필요**: React 19 JSX 자동 변환 사용

### Path Alias

```typescript
@/*           -> ./src/*
@/shared/*    -> ./src/shared/*
@/features/*  -> ./src/features/*
@/app/*       -> ./src/app/*
```

### 스타일링

- **TailwindCSS 4** 사용 (`tailwind.config.ts`, `@tailwindcss/postcss`)
- 인라인 Tailwind 클래스 사용, `clsx`와 `tailwind-merge`로 조건부 스타일 적용
- CSS 모듈이나 Styled Components 사용 금지
- **cn() 유틸 필수 사용**: `cn(...inputs)` = `twMerge(clsx(inputs))`

### 폴더 구조 (Feature-Sliced Design)

```
src/
├── app/                    # Next.js App Router (페이지 라우팅)
│   ├── (admin)/            # 관리자 영역 (/admin/*)
│   ├── (auth)/             # 인증 영역 (/login*, /signup*, /auth/*)
│   ├── (main)/             # 메인 영역 (/jobs, /user, /company, /diagnosis 등)
│   ├── api/                # Next.js Route Handlers (서버 프록시)
│   ├── layout.tsx          # Root Layout (NextIntlClientProvider, QueryProvider)
│   └── template.tsx        # 페이지 전환 애니메이션
│
├── features/               # 도메인별 기능 (11개 슬라이스)
│   ├── admin/              # 관리자 (api, components, pages)
│   ├── auth/               # 인증 (api, hooks, components, pages, types, lib)
│   ├── company/            # 기업 (api, hooks, components, pages, validations)
│   ├── diagnosis/          # 자가진단 (api, components, pages, store)
│   ├── events/             # 이벤트 (api, types)
│   ├── jobs/               # 채용공고 (api, hooks, components, pages)
│   ├── landing/            # 랜딩페이지 (components)
│   ├── profile/            # 프로필 (api, components, pages, types, validations)
│   ├── resume/             # 이력서 (api, components)
│   └── user/               # 사용자 (components, pages, types)
│
└── shared/                 # 공유 리소스
    ├── api/                # fetchClient.ts, minio.ts, tokenStore.ts
    ├── components/         # Header, Footer, MobileNav, LanguageToggle, SEO
    ├── ui/                 # 23개 UI 컴포넌트 (Button, Input, Modal, Skeleton, Badge, BackToTop 등)
    ├── hooks/              # useDebounce, useFileUpload, useFormPersist, useMediaQuery, useMutationWithToast
    ├── lib/
    │   ├── utils/          # cookieManager, errorHandler, jwtUtils, phoneUtils, validation
    │   └── providers/      # QueryProvider
    ├── constants/          # countries, positions, schools, jobOptions, terms, errorCode
    ├── types/              # api.ts (API 타입), enums.ts, common.types.ts
    └── stores/             # Zustand authStore
```

### 컴포넌트 작성 규칙

- Server Component 기본, 상호작용 필요 시만 `'use client'` 추가
- 클라이언트 전용 로직(useState, useEffect 등)이 있으면 파일명에 `Client` 접미사 추가
  - 예: `DiagnosisClient.tsx`, `CompanyPostCreateClient.tsx`
- Props 타입은 인터페이스로 정의 (`interface ComponentNameProps`)
- `React.FC` 타입 사용 금지 (React 19에서 Deprecated)

---

## API 호출

### fetchClient 구조 (수정 금지)

`src/shared/api/fetchClient.ts`는 다음 두 가지를 제공합니다:

```typescript
// 1. fetchAPI 함수 (Server Component + 캐싱 옵션 지원)
export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T>

// 2. fetchClient 객체 (Client Component + 자동 토큰 갱신)
export const fetchClient = { get, post, put, patch, delete }
```

**환경별 동작:**
- **클라이언트**: `API_BASE_URL = ""` → Next.js rewrites로 `/api/*` → 백엔드 프록시
- **서버**: `SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL` (ex. `https://arw.byeong98.xyz`)

**인증 방식:**
- access_token: in-memory (`tokenStore.ts`) + 401 시 자동 갱신
- refresh_token: HttpOnly Cookie 자동 전송 (`credentials: 'include'`)

```typescript
import { fetchClient } from "@/shared/api/fetchClient";

// Client Component
const data = await fetchClient.get<User>("/api/me");
const result = await fetchClient.post("/api/posts/company", formData);

// Server Component (ISR)
import { fetchAPI } from "@/shared/api/fetchClient";
const jobs = await fetchAPI<Job[]>("/api/posts/company", {
  next: { revalidate: 3600, tags: ["jobs"] }
});
```

### 백엔드 API 엔드포인트 (실제 서버 기준)

#### Auth (`/api/auth/*`)
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/auth/login/google` | GET | Google OAuth 시작 |
| `/api/auth/login/google/callback` | GET | Google OAuth 콜백 |
| `/api/auth/signup` | POST | 일반 회원 가입 |
| `/api/auth/company/signup` | POST | 기업 회원 가입 |
| `/api/auth/company/login` | POST | 기업 회원 로그인 |
| `/api/auth/logout` | **DELETE** | 로그아웃 (쿠키 삭제) |
| `/api/auth/refresh` | POST | 토큰 갱신 |
| `/api/auth/email/certify` | POST | 이메일 인증 발송 |
| `/api/auth/email/certify/verify` | POST | 이메일 인증 확인 |

#### Profile (`/api/me`, `/api/contact`, `/api/account-config`)
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/me` | GET / **PUT** | 내 정보 조회/수정 |
| `/api/contact` | GET / **PUT** | 연락처 조회/수정 |
| `/api/account-config` | GET / **PUT** | 계정 설정 조회/수정 |

#### Posts — 채용공고 (`/api/posts/company/*`)
| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|--------|------|------|
| `/api/posts/company/` | GET | 기업 | 내 공고 목록 |
| `/api/posts/company/` | POST | 기업 | 공고 등록 |
| `/api/posts/company/{id}` | GET | 공개 | 공고 상세 |
| `/api/posts/company/{id}` | PUT | 기업 | 공고 수정 |
| `/api/posts/company/{id}` | DELETE | 기업 | 공고 삭제 |

#### Posts — 이력서 (`/api/posts/resume/*`)
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/posts/resume/list/me` | GET | 내 이력서 목록 |
| `/api/posts/resume/{id}` | GET / PUT / DELETE | 이력서 단건 |
| `/api/posts/resume` | POST | 이력서 생성 |

#### Diagnosis (`/api/diagnosis/*`)
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/diagnosis/answer` | POST | 자가진단 답변 제출 |
| `/api/diagnosis/answer/{id}` | GET | 진단 결과 조회 |

#### Admin (`/api/admin/*`)
| 엔드포인트 | 설명 |
|-----------|------|
| `/api/admin/users/*` | 일반 회원 관리 |
| `/api/admin/companies/*` | 기업 회원 관리 |
| `/api/admin/company-posts/*` | 채용공고 관리 |
| `/api/admin/notices/*` | 공지사항 관리 |

> ⚠️ **미구현 엔드포인트** (서버 추가 필요):
> - `GET /api/posts/company/list` — 공개 채용공고 목록 (현재 404)
> - `POST /api/applications` — 채용공고 지원

---

## 명령어

### 개발

```bash
npm run dev          # 개발 서버 시작 (localhost:3000)
```

### 빌드 및 배포

```bash
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 시작
```

### 코드 품질 검사

```bash
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
npm run typecheck    # TypeScript 타입 체크
npm run check        # lint + typecheck 병렬 실행
npm run check-all    # check + build 순차 실행 (배포 전 필수)
```

### 테스트

```bash
npm run test         # 전체 테스트
npm run test:ui      # 테스트 UI
npm run test:watch   # 워치 모드
npm run test:coverage # 커버리지 리포트
npm run test:e2e     # E2E API 테스트만
npm run test:unit    # 유닛 테스트만
```

### Git 워크플로우

- **메인 브랜치**: `main` (프로덕션)
- **개발 브랜치**: `dev` (현재 기본 작업 브랜치)
- PR 생성 시 `dev` 브랜치를 베이스로 사용

---

## 주의 사항

### 1. 인증 시스템 (중요!)

- **이중 토큰 관리**: access_token은 in-memory(`tokenStore.ts`), refresh_token은 HttpOnly Cookie
- `localStorage`, `sessionStorage`에 절대 토큰 저장 금지 (보안 취약점)
- `fetchClient`가 자동으로 쿠키 전송 및 토큰 갱신 처리 (`credentials: 'include'`)
- 401 에러 시 자동 `/api/auth/refresh` 호출 후 재시도 (실패 시 `/login` 리다이렉트)
- **로그아웃**: `DELETE /api/auth/logout` (POST가 아님!)
- **프로필 수정**: `PUT /api/me` (PATCH가 아님!)

### 2. API 통신

- **절대 경로 사용**: `/api/posts/company` (상대 경로 금지)
- **`fetch()` 직접 사용 금지**: 반드시 `fetchClient` 또는 `fetchAPI` 사용
- **Server Component에서 API 호출 시**:
  - `fetchAPI()` 함수 사용 (ISR 캐싱 지원)
  - `next: { revalidate: 3600, tags: ['posts'] }` 캐싱 옵션 활용
- **Client Component에서 API 호출 시**:
  - `fetchClient` 객체 사용
  - React Query(`@tanstack/react-query`) 사용 권장

### 3. 환경변수

```bash
# 공개 변수 (클라이언트 접근 가능)
NEXT_PUBLIC_API_URL=https://arw.byeong98.xyz  # 서버 API URL

# 비공개 변수 (서버 전용)
GOOGLE_CLIENT_ID=...
NTS_API_KEY=...
```

- `.env` 파일은 절대 커밋 금지 (`.gitignore`에 포함됨)

### 4. 보안 (CSP)

- `next.config.ts`에 엄격한 Content Security Policy 설정됨
- 외부 스크립트/이미지 추가 시 CSP 헤더 수정 필요
- **외부 스크립트 URL은 반드시 `https://` 명시** — 프로토콜 상대 URL(`//`) 사용 금지
  - ✅ `<Script src="https://t1.daumcdn.net/...">`
  - ❌ `<Script src="//t1.daumcdn.net/...">`

### 5. 수정 금지 파일

| 파일 | 이유 |
|------|------|
| `src/shared/api/fetchClient.ts` | 인증 로직 변경 금지 (토큰 갱신, in-memory store, 에러 핸들링) |
| `src/shared/api/tokenStore.ts` | in-memory 토큰 관리 로직 |
| `next.config.ts` | 보안 헤더 및 rewrites 설정 |
| `.eslintrc.json`, `tsconfig.json` | 팀 전체 규칙, 협의 후 수정 |

### 6. Middleware 라우트 보호

```
Public:    /, /jobs, /self-diagnosis, /diagnosis, /companies
Auth:      /login*, /signup*, /company-login*, /auth/callback
Protected: /user/* (user 권한), /company/* (company 권한), /admin/* (admin 권한)
```

미인증 접근 시 → `/login?redirect={경로}` 리다이렉트

### 7. 다국어 (i18n)

- **패키지**: `next-intl` (쿠키 기반, URL 구조 변경 없음)
- **번역 파일**: `messages/ko.json`, `messages/en.json` (295개 키)
- **언어 감지**: 쿠키(`locale`) 기반
- **토글**: `src/shared/components/LanguageToggle.tsx` (Header에 포함)
- `useTranslations()` 훅은 Client Component에서만 사용 가능

### 8. React 19 특성

- `React.FC` 타입 사용 금지 (React 19에서 Deprecated)
- `children` prop 명시적으로 타입 정의 필요
- `import React from 'react'` 불필요 (JSX 자동 변환)
- Server Component가 기본값 (클라이언트 로직 필요 시 명시적으로 `'use client'` 추가)

### 9. 성능 최적화

- **React Compiler 활성화**: 자동 메모이제이션 (수동 `useMemo`, `useCallback` 최소화)
- **이미지 최적화**: `next/image` 사용 필수 (AVIF/WebP 자동 변환)
- **Lazy Loading**: 대용량 컴포넌트는 `next/dynamic` 사용 (RadarChart, SkillBarChart 등)
- **스켈레톤 UI**: 17개 라우트에 `loading.tsx` 구현됨 (`src/shared/ui/SkeletonCards.tsx` 활용)
- **Framer Motion**: GPU 가속 속성 선호 (x, y, scale, opacity), spring 타입 권장

### 10. 레이아웃 컨테이너 규칙 (중요!)

**`max-w-5xl`, `max-w-6xl`, `max-w-7xl` 등의 클래스를 개별 페이지나 하위 컴포넌트에 직접 사용 금지.**

레이아웃 너비는 반드시 해당 섹션의 **레이아웃 파일(`layout.tsx`)** 에서만 관리합니다.

| 영역 | 컨테이너 표준 |
|------|-------------|
| 어드민 `/admin` | `w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8` |
| 일반 메인 | `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| 인증 폼 | `max-w-[32.5rem] w-full` (layout.tsx에서 주입) |

- **페이지 배경**: `bg-background-alternative` (= `#F1F5F9`)
- **콘텐츠 카드 래퍼**: `rounded-xl bg-background-default shadow-md p-6`
- **하위 `page.tsx`는 `w-full` 유지** (자체 `max-w-*` 금지)

### 11. 파일 업로드 (MinIO)

```typescript
import { uploadToMinio } from "@/shared/api/minio";
// MinIO endpoint: minio.byeong98.xyz
// Bucket: data
```

### 12. 배포

- **출력 모드**: `standalone` (Docker 컨테이너 최적화)
- **빌드 전 체크**: `npm run check-all` 실행 필수
- **환경변수 확인**: 프로덕션 환경에서 `NEXT_PUBLIC_API_URL` 올바른지 검증

### 13. 디버깅

- `console.log` 사용 시 개발 완료 후 반드시 삭제
- React Query Devtools 활성화됨 (`@tanstack/react-query-devtools`)
- Framer Motion 타입: `ease: [0.25, 0.1, 0.25, 1]`는 반드시 `as [number, number, number, number]` 캐스팅 필요

---

## UI 컴포넌트 작성 규칙 (디자인 시스템 준수)

```tsx
// ✅ Good: 디자인 시스템 준수
<button className={cn(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors cursor-pointer",
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
  variant === "outline" && "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
  size === "sm" && "px-3.5 py-1.5 text-caption-1",
  size === "lg" && "px-7 py-3.5 text-body-2 rounded-xl",
)}>

// ✅ Good: 아이콘 버튼 (focus:ring 미사용)
<button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none rounded-lg cursor-pointer">
  <SearchIcon />
</button>

// ❌ Bad: 하드코딩, 토큰 미준수, cursor-pointer 누락
<button className="bg-[#2563EB] text-white p-2">
```

- **cn() 유틸 필수**: 모든 조건부 스타일링에 `cn()` 사용
- **cursor-pointer 필수**: 클릭 가능한 모든 `<button>`, `<Link>`, 이벤트 요소에 반드시 추가
- **접근성 필수**: 시맨틱 HTML, aria-* 속성
- **반응형 필수**: 모바일 우선 (기본 → sm → md → lg → xl)

---

## Header 구조

- 모바일·데스크탑 동일 레이아웃: **로고 + LanguageToggle + [검색 아이콘] [User 아이콘] [햄버거 메뉴]**
- **User 아이콘**: 비인증 → `/login-select`, 인증 → `/user/profile`(개인) 또는 `/company`(기업)
- `src/shared/components/layout/Header.tsx` (Server Component)
- `src/shared/components/layout/MobileNav.tsx` (Client Component, 슬라이드 패널)

---

## 추가 참고 자료

- [Next.js 16 문서](https://nextjs.org/docs)
- [React 19 릴리즈 노트](https://react.dev/blog/2024/12/05/react-19)
- [TailwindCSS 4 문서](https://tailwindcss.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [FastAPI 문서](https://fastapi.tiangolo.com/)
- 디자인 레퍼런스: `file:///Users/apple/Downloads/workinkorea-redesign.html`
