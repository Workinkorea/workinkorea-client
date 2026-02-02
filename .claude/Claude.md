# Work in Korea - 프로젝트 가이드

## 프로젝트 컨텍스트

이 프로젝트는 외국인 근로자를 위한 한국 취업 지원 플랫폼입니다. Next.js 16 App Router, React 19, TypeScript를 기반으로 하며, 일반 회원(외국인 구직자)과 기업 회원을 위한 채용 공고, 이력서 관리, 자가 진단 시스템을 제공합니다. HttpOnly Cookie 기반 인증을 사용하고, Feature-Sliced Design 아키텍처를 따릅니다.

## 코드 스타일

### 기본 규칙

- **모듈 시스템**: ES 모듈 사용 (import/export)
- **TypeScript**: strict mode 활성화, 타입 안정성 최우선
- **내보내기**: Named export 선호 (default export는 Next.js 페이지/라우트만 사용)
- **컴포넌트**: 함수형 컴포�트만 사용 (React 19 + React Compiler 활성화)

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

### 폴더 구조 (Feature-Sliced Design)

```
src/
  app/             # Next.js App Router (페이지 라우팅)
  features/        # 도메인별 기능 (auth, jobs, profile, resume, etc.)
    {feature}/
      components/  # 해당 기능 전용 컴포넌트
      pages/       # Client Component 페이지
      hooks/       # 커스텀 훅
      types/       # 타입 정의
      validations/ # Zod 스키마
  shared/          # 공유 리소스
    components/    # 공통 컴포넌트
    ui/            # 재사용 가능한 UI 컴포넌트
    hooks/         # 공통 훅
    lib/           # 유틸리티 함수
    api/           # API 클라이언트 (fetchClient)
    types/         # 공통 타입
    constants/     # 상수 정의
```

### API 호출

- **fetchClient 사용 필수** (`src/shared/api/fetchClient.ts`)
- 절대 `fetch` 직접 사용 금지 (자동 토큰 갱신, 에러 핸들링 포함)

```typescript
import { fetchClient } from "@/shared/api/fetchClient";

// GET 요청
const data = await fetchClient.get<User>("/api/users/me");

// POST 요청
const result = await fetchClient.post("/api/posts/company", formData);
```

### 컴포넌트 작성 규칙

- Server Component 기본, 상호작용 필요 시만 `'use client'` 추가
- 클라이언트 전용 로직(useState, useEffect 등)이 있으면 파일명에 `Client` 접미사 추가
  - 예: `DiagnosisClient.tsx`, `CompanyPostCreateClient.tsx`
- Props 타입은 인터페이스로 정의 (`interface ComponentNameProps`)

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
npm run check-all    # check + build 순차 실행
```

### Git 워크플로우

- **메인 브랜치**: `main` (프로덕션)
- **개발 브랜치**: `dev` (현재 작업 브랜치)
- PR 생성 시 `dev` 브랜치를 베이스로 사용

## 주의 사항

### 1. 인증 시스템 (중요!)

- **HttpOnly Cookie 기반 인증 사용**
- `localStorage`, `sessionStorage`에 절대 토큰 저장 금지 (보안 취약점)
- `fetchClient`가 자동으로 쿠키 전송 및 토큰 갱신 처리 (`credentials: 'include'`)
- 401 에러 시 자동 `/api/auth/refresh` 호출 후 재시도
- 쿠키 도메인 설정 주의: 클라이언트-서버 도메인 불일치 시 인증 실패 가능

### 2. API 통신

- **절대 경로 사용**: `/api/posts/company` (상대 경로 금지)
- **Server Component에서 API 호출 시**:
  - Next.js 캐싱 옵션 활용 (`next: { revalidate: 3600, tags: ['posts'] }`)
  - 서버 환경에서는 `API_URL` 환경변수 사용 (`workinkorea-server:8000`)
- **Client Component에서 API 호출 시**:
  - 브라우저에서는 Next.js rewrites로 `/api/*` → 백엔드 프록시
  - React Query(`@tanstack/react-query`) 사용 권장

### 3. 환경변수

- **공개 변수**: `NEXT_PUBLIC_API_URL` (클라이언트에서 접근 가능)
- **비공개 변수**: `GOOGLE_CLIENT_ID`, `NTS_API_KEY` (서버 전용)
- `.env` 파일은 절대 커밋 금지 (`.gitignore`에 포함됨)

### 4. 보안 (CSP)

- `next.config.ts`에 엄격한 Content Security Policy 설정됨
- 외부 스크립트/이미지 추가 시 CSP 헤더 수정 필요
- `'unsafe-eval'`, `'unsafe-inline'`은 개발 모드 전용 (프로덕션에서 제거)

### 5. 수정 금지 파일

- `src/shared/api/fetchClient.ts` - 인증 로직 변경 금지 (토큰 갱신, 에러 핸들링)
- `next.config.ts` - 보안 헤더 및 rewrites 설정 함부로 수정 금지
- `.eslintrc.json`, `tsconfig.json` - 팀 전체 규칙이므로 협의 후 수정

### 6. React 19 특성

- `React.FC` 타입 사용 금지 (React 19에서 Deprecated)
- `children` prop 명시적으로 타입 정의 필요
- Server Component가 기본값 (클라이언트 로직 필요 시 명시적으로 `'use client'` 추가)

### 7. 성능 최적화

- **React Compiler 활성화**: 자동 메모이제이션 (수동 `useMemo`, `useCallback` 최소화)
- **이미지 최적화**: `next/image` 사용 필수 (AVIF/WebP 자동 변환)
- **Lazy Loading**: 대용량 컴포넌트는 `React.lazy()` 또는 `next/dynamic` 사용

### 8. 특수 API 엔드포인트

- **Daum Postcode API**: `https://t1.daumcdn.net` (주소 검색, CSP에 등록됨)
- **MinIO 파일 업로드**: `src/shared/api/minio.ts` 사용

### 9. 디버깅

- `console.log` 사용 시 개발 완료 후 반드시 삭제 (최근 커밋에서도 삭제 이력 확인)
- React Query Devtools 활성화됨 (`@tanstack/react-query-devtools`)

### 10. 배포

- **출력 모드**: `standalone` (Docker 컨테이너 최적화)
- **빌드 전 체크**: `npm run check-all` 실행 필수
- **환경변수 확인**: 프로덕션 환경에서 `NEXT_PUBLIC_API_URL` 올바른지 검증

## 추가 참고 자료

- [Next.js 16 문서](https://nextjs.org/docs)
- [React 19 릴리즈 노트](https://react.dev/blog/2024/12/05/react-19)
- [TailwindCSS 4 문서](https://tailwindcss.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
