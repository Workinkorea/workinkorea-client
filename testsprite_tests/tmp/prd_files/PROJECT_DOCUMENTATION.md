# WorkInKorea Client 프로젝트 완전 문서

프로젝트 전체를 상세히 분석한 결과를 문서로 정리했습니다.

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [주요 기능](#2-주요-기능)
3. [기술 스택](#3-기술-스택)
4. [디렉토리 구조](#4-디렉토리-구조)
5. [핵심 컴포넌트](#5-핵심-컴포넌트)
6. [API 구조](#6-api-구조)
7. [인증 및 권한 시스템](#7-인증-및-권한-시스템)
8. [상태 관리](#8-상태-관리)
9. [사용자 유형 및 역할](#9-사용자-유형-및-역할)
10. [주요 워크플로우](#10-주요-워크플로우)

---

## 1. 프로젝트 개요

### 🎯 목적
**WorkInKorea**는 외국인 구직자와 한국 기업을 연결하는 채용 플랫폼입니다.

### 핵심 가치
- 한국에서 일하고자 하는 외국인을 위한 취업 기회 제공
- 포괄적인 채용 공고 및 이력서 관리 시스템
- 커리어 진단 및 매칭 서비스 제공
- 다국어 지원 및 비자 관련 워크플로우

---

## 2. 주요 기능

### 🔐 인증 시스템
- **일반 사용자 회원가입**: 이메일 인증 포함
- **기업 회원가입**: 사업자 정보 포함 2단계 가입
- **Google OAuth 통합**: 소셜 로그인
- **이중 로그인 시스템**: 개인/기업 분리
- **JWT 기반 인증**: 자동 토큰 갱신
- **로그인 상태 유지**: localStorage/sessionStorage 활용

### 📝 이력서 관리 (개인 사용자)
- 이력서 생성, 수정, 삭제
- 5가지 템플릿: Modern, Classic, Creative, Minimal, Professional
- 섹션별 관리:
  - 기본 정보 및 프로필 이미지
  - 경력 사항 (회사, 직무, 기간, 담당 업무)
  - 학력 사항 (학교 검색, 전공, 졸업 여부)
  - 언어 능력 (언어별 수준)
  - 자격증 (명칭, 발급 기관, 취득일)
  - 자기소개
- MinIO 연동 이미지 업로드
- 동적 섹션 추가/삭제

### 💼 채용 공고 시스템 (기업)
- 공고 생성, 수정, 삭제
- 상세 정보:
  - 포지션 (Frontend, Backend, Fullstack, Data Engineer, DevOps, QA)
  - 경력 요구사항 (신입 ~ 10년 이상)
  - 학력 및 언어 요구사항
  - 근무 조건 (고용 형태, 위치, 근무 시간, 급여)
  - 모집 기간
- Daum Postcode API 주소 검색
- 연봉 협의 가능 옵션

### 🎯 커리어 진단 도구
- 4단계 설문 조사:
  1. **기본 정보**: 거주지, 한국어 수준, 비자 상태
  2. **경력 & 스킬**: 경력, 분야, 학력, 언어
  3. **선호사항**: 희망 연봉, 고용 형태, 회사 규모, 시작일
  4. **매칭 & 전환**: 어려움, 이메일 수집
- Zustand 상태 관리
- 진행률 표시

### 👨‍💼 관리자 대시보드
- **사용자 관리**: 조회, 수정, 삭제
- **기업 관리**: 조회, 수정, 삭제
- **공고 관리**: 조회, 수정, 삭제
- **통계 대시보드**: 총 사용자, 기업, 공고 수
- 페이지네이션 지원

### 👤 프로필 관리
- 개인 프로필 편집: 위치, 소개, 포지션, 경력 상태, 언어 능력, 포트폴리오 URL
- 기업 프로필 관리: 업종, 직원 수, 설립일, 기업 형태 등
- 연락처 정보 관리
- 계정 설정

---

## 3. 기술 스택

### 🎨 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.5.0 | App Router 프레임워크 |
| **React** | 19.1.0 | UI 라이브러리 |
| **TypeScript** | 5 | 타입 안정성 |
| **Tailwind CSS** | 4.1.12 | 스타일링 |
| **Framer Motion** | 12.23.12 | 애니메이션 |
| **Lucide React** | 0.541.0 | 아이콘 |

### 📊 상태 관리
| 라이브러리 | 용도 |
|-----------|------|
| **React Hook Form** | 폼 처리 (Zod 검증) |
| **Zustand** | 전역 상태 (진단 도구) |
| **TanStack React Query** | 서버 상태 캐싱 |

### 🔌 데이터 통신
| 도구 | 용도 |
|------|------|
| **Axios** | HTTP 클라이언트 |
| **RESTful API** | 백엔드 통신 |
| **Backend URL** | https://arw.byeong98.xyz |

### 🛠 유틸리티
- **date-fns**: 날짜 처리
- **react-datepicker**: 날짜 선택
- **Sonner**: 토스트 알림
- **clsx + tailwind-merge**: 클래스 관리

### 🏗 개발 도구
- **ESLint**: 코드 린팅
- **TypeScript**: 타입 체크
- **Turbopack**: 빌드 최적화

---

## 4. 디렉토리 구조

```
workinkorea-client/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (main)/                      # 메인 라우트 그룹
│   │   │   ├── page.tsx                 # 홈페이지
│   │   │   ├── user/                    # 사용자 대시보드
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/             # 프로필 관리
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── edit/
│   │   │   │   └── resume/              # 이력서 관리
│   │   │   │       ├── create/
│   │   │   │       └── edit/[id]/
│   │   │   ├── company/                 # 기업 대시보드
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   └── posts/               # 채용 공고
│   │   │   │       ├── create/
│   │   │   │       └── edit/[id]/
│   │   │   ├── jobs/                    # 채용 공고 목록
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   ├── diagnosis/               # 커리어 진단
│   │   │   │   ├── page.tsx
│   │   │   │   └── result/
│   │   │   └── self-diagnosis/
│   │   ├── (auth)/                      # 인증 라우트 그룹
│   │   │   ├── login/                   # 일반 로그인
│   │   │   ├── signup/                  # 일반 회원가입
│   │   │   ├── company-login/           # 기업 로그인
│   │   │   ├── company-signup/          # 기업 회원가입
│   │   │   │   ├── step1/
│   │   │   │   └── step2/
│   │   │   ├── login-select/            # 로그인 선택
│   │   │   ├── signup-select/           # 회원가입 선택
│   │   │   └── auth/callback/           # OAuth 콜백
│   │   ├── (admin)/                     # 관리자 라우트
│   │   │   └── admin/
│   │   │       ├── page.tsx             # 대시보드
│   │   │       ├── users/               # 사용자 관리
│   │   │       ├── companies/           # 기업 관리
│   │   │       └── posts/               # 공고 관리
│   │   ├── layout.tsx                   # 루트 레이아웃
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/                      # React 컴포넌트 (58개 파일)
│   │   ├── ui/                          # 재사용 UI 컴포넌트
│   │   ├── auth/                        # 인증 컴포넌트
│   │   ├── layout/                      # 레이아웃 (Header, Footer)
│   │   ├── signup/                      # 회원가입 폼
│   │   ├── login/                       # 로그인 폼
│   │   ├── resume/                      # 이력서 컴포넌트
│   │   ├── company-posts/               # 채용 공고 컴포넌트
│   │   ├── user/                        # 사용자 프로필
│   │   ├── business-login/              # 기업 로그인
│   │   ├── business-signup/             # 기업 회원가입
│   │   ├── diagnosis/                   # 진단 도구
│   │   ├── main/                        # 메인 페이지 섹션
│   │   ├── pages/                       # 페이지 레벨 컴포넌트
│   │   └── seo/                         # SEO 컴포넌트
│   │
│   ├── lib/                             # 라이브러리 코드
│   │   ├── api/                         # API 클라이언트
│   │   │   ├── client.ts                # Axios 기본 클라이언트
│   │   │   ├── auth.ts                  # 인증 API
│   │   │   ├── profile.ts               # 프로필 API
│   │   │   ├── resume.ts                # 이력서 API
│   │   │   ├── posts.ts                 # 채용 공고 API
│   │   │   ├── admin.ts                 # 관리자 API
│   │   │   ├── minio.ts                 # 파일 스토리지
│   │   │   └── types.ts                 # API 타입 정의
│   │   ├── utils/                       # 유틸리티 함수
│   │   │   ├── tokenManager.ts          # JWT 토큰 관리
│   │   │   ├── jwtUtils.ts              # JWT 유틸리티
│   │   │   ├── validation.ts            # 폼 검증
│   │   │   └── authNumber.ts            # 인증번호 유틸
│   │   ├── validations/                 # Zod 스키마
│   │   ├── providers/                   # React 프로바이더
│   │   ├── fonts.ts
│   │   └── metadata.ts
│   │
│   ├── hooks/                           # 커스텀 React 훅
│   │   ├── useAuth.ts                   # 인증 훅
│   │   └── useModal.ts                  # 모달 훅
│   │
│   ├── store/                           # Zustand 스토어
│   │   └── diagnosisStore.ts            # 진단 상태 관리
│   │
│   ├── types/                           # TypeScript 타입
│   │   ├── user.ts
│   │   ├── signup.type.ts
│   │   └── global.d.ts
│   │
│   └── constants/                       # 상수
│       ├── jobOptions.ts                # 직무 관련 옵션
│       ├── countries.ts                 # 국가 목록
│       ├── schools.ts                   # 학교 목록
│       ├── terms.ts                     # 약관
│       └── errorCode.ts                 # 에러 코드
│
├── public/                              # 정적 자산
├── .env                                 # 환경 변수
├── next.config.ts                       # Next.js 설정
├── tsconfig.json                        # TypeScript 설정
├── tailwind.config.js                   # Tailwind 설정
├── package.json
├── dockerfile                           # Docker 설정
└── Jenkinsfile                          # CI/CD 파이프라인

총 코드 라인 수: ~19,618 라인
```

---

## 5. 핵심 컴포넌트

### 🔐 인증 컴포넌트

**LoginContent** (`src/components/login/LoginContent.tsx`)
- 개인 사용자 로그인
- 이메일/비밀번호 + Google OAuth
- "로그인 상태 유지" 기능

**BusinessLoginForm** (`src/components/business-login/BusinessLoginForm.tsx`)
- 기업 로그인
- 이메일/비밀번호 인증

**SignupComponent** (`src/components/signup/SignupComponent.tsx`)
- 개인 회원가입
- 이메일 인증 포함
- 약관 동의 시스템

**BusinessSignupStep1/Step2**
- 2단계 기업 회원가입
- 약관 동의 → 기업 정보 입력

### 📝 이력서 컴포넌트

**ResumeEditor** (`src/components/resume/ResumeEditor.tsx`)
- 종합 이력서 생성/편집 폼
- 섹션별 관리:
  - 기본 정보 + 프로필 이미지
  - 자기소개
  - 경력 (동적 추가/삭제)
  - 학력 (학교 검색)
  - 언어 능력
  - 자격증

**TemplateSelector**
- 이력서 템플릿 선택

**ResumeCard**
- 이력서 요약 카드

### 💼 채용 공고 컴포넌트

**CompanyPostForm** (`src/components/company-posts/CompanyPostForm.tsx`)
- 채용 공고 작성 폼
- 전체 필드 포함
- 주소 검색 통합

**DaumPostcodeSearch**
- Daum Postcode API 주소 검색

### 🎨 UI 컴포넌트

**FormField**
- 재사용 가능한 폼 필드 래퍼
- 에러 처리 포함

**Input**
- 커스텀 입력 필드
- 비밀번호 가시성 토글

**DatePicker**
- 날짜 선택 컴포넌트

**SchoolSearch**
- 학교 자동완성 검색

**SelectSearchInput**
- 검색 가능한 선택 드롭다운

**Modal**
- 재사용 가능한 모달

**Portal**
- 모달 및 오버레이용 포털

### 🏗 레이아웃 컴포넌트

**Header**
- 메인 네비게이션 헤더
- 홈페이지/비즈니스 변형

**Footer**
- 사이트 푸터

**Layout**
- 메인 레이아웃 래퍼

### 🎯 진단 컴포넌트

**Session1BasicInfo**
- 기본 정보 수집

**Session2CareerSkills**
- 경력 및 스킬 평가

**Session3Preferences**
- 취업 선호사항

**Session4Matching**
- 최종 매칭 및 이메일 수집

**ProgressBar**
- 진단 진행률 표시

---

## 6. API 구조

### ⚙️ 기본 설정
```typescript
Base URL: https://arw.byeong98.xyz
Timeout: 3000ms
Credentials: withCredentials (쿠키 포함)
```

### 🔐 인증 엔드포인트 (`src/lib/api/auth.ts`)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/auth/email/certify` | 이메일 인증 코드 전송 |
| POST | `/api/auth/email/certify/verify` | 이메일 코드 검증 |
| POST | `/api/auth/login` | 사용자 로그인 |
| POST | `/api/auth/logout` | 사용자 로그아웃 |
| POST | `/api/auth/signup` | 사용자 회원가입 |
| POST | `/api/auth/company/signup` | 기업 회원가입 |
| POST | `/api/auth/company/login` | 기업 로그인 (form-urlencoded) |
| POST | `/api/auth/company/logout` | 기업 로그아웃 |
| POST | `/api/auth/refresh` | 사용자 토큰 갱신 |
| POST | `/api/auth/company/refresh` | 기업 토큰 갱신 |
| POST | `/api/auth/admin/refresh` | 관리자 토큰 갱신 |
| GET | `/api/auth/login/google` | Google OAuth 로그인 |

### 👤 프로필 엔드포인트 (`src/lib/api/profile.ts`)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/me` | 사용자 프로필 조회 |
| PUT | `/api/me` | 사용자 프로필 수정 |
| GET | `/api/contact` | 연락처 정보 조회 |
| PUT | `/api/contact` | 연락처 정보 수정 |
| GET | `/api/account-config` | 계정 설정 조회 |
| PUT | `/api/account-config` | 계정 설정 수정 |

### 📝 이력서 엔드포인트 (`src/lib/api/resume.ts`)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/posts/resume/list/me` | 내 이력서 목록 |
| GET | `/api/posts/resume/:id` | 이력서 상세 조회 |
| POST | `/api/posts/resume` | 이력서 생성 |
| PUT | `/api/posts/resume/:id` | 이력서 수정 |
| DELETE | `/api/posts/resume/:id` | 이력서 삭제 |
| POST | `/api/metest/user/image` | 이미지 업로드 (presigned URL) |

### 💼 채용 공고 엔드포인트 (`src/lib/api/posts.ts`)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/posts/company` | 공개 채용 공고 목록 |
| GET | `/api/company/posts/my` | 내 기업의 공고 목록 |
| GET | `/api/posts/company/:id` | 공고 상세 조회 |
| POST | `/api/posts/company` | 공고 생성 |
| PUT | `/api/posts/company/:id` | 공고 수정 |
| DELETE | `/api/posts/company/:id` | 공고 삭제 |

### 👨‍💼 관리자 엔드포인트 (`src/lib/api/admin.ts`)

**사용자 관리**
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/admin/users/` | 전체 사용자 조회 |
| GET | `/api/admin/users/:id` | 사용자 상세 조회 |
| PUT | `/api/admin/users/:id` | 사용자 수정 |
| DELETE | `/api/admin/users/:id` | 사용자 삭제 |

**기업 관리**
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/admin/companies/?skip&limit` | 기업 목록 (페이지네이션) |
| GET | `/api/admin/companies/:id` | 기업 상세 조회 |
| PUT | `/api/admin/companies/:id` | 기업 수정 |
| DELETE | `/api/admin/companies/:id` | 기업 삭제 |

**공고 관리**
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/admin/posts/?skip&limit` | 공고 목록 (페이지네이션) |
| GET | `/api/admin/posts/:id` | 공고 상세 조회 |
| PUT | `/api/admin/posts/:id` | 공고 수정 |
| DELETE | `/api/admin/posts/:id` | 공고 삭제 |

---

## 7. 인증 및 권한 시스템

### 🔑 토큰 관리 시스템

**저장 전략**:
- **통합 토큰 저장**: 사용자/기업 토큰 구분 없이 단일 저장소 사용
- **localStorage**: "로그인 상태 유지" 시 (영구 로그인)
- **sessionStorage**: 세션 전용 로그인
- **토큰 타입 저장**: `access`, `access_company`, `admin_access`

### 🔄 토큰 플로우 (`src/lib/api/client.ts`)

**1. 로그인 프로세스**
```
사용자 인증 정보 제공
    ↓
백엔드에서 JWT 토큰 + token_type 반환
    ↓
"로그인 상태 유지" 여부에 따라 localStorage/sessionStorage 저장
    ↓
token_type 저장하여 사용자 역할 식별
```

**2. 요청 인터셉터**
- 모든 요청에 자동으로 `Authorization: Bearer <token>` 헤더 추가
- `skipAuth: true` 플래그가 있는 요청은 인증 스킵

**3. 응답 인터셉터 - 자동 토큰 갱신**
```typescript
401 Unauthorized 감지
    ↓
저장된 token_type 또는 JWT 페이로드에서 사용자 유형 판별
    ↓
적절한 갱신 엔드포인트 호출:
  - /api/auth/refresh (일반 사용자)
  - /api/auth/company/refresh (기업)
  - /api/auth/admin/refresh (관리자)
    ↓
큐 관리로 동시 다중 갱신 요청 방지
    ↓
새 토큰으로 저장소 업데이트
    ↓
원래 실패한 요청을 새 토큰으로 재시도
    ↓
갱신 실패 시: 토큰 삭제 및 로그인 페이지로 리다이렉트
```

**4. 토큰 검증** (`src/lib/utils/jwtUtils.ts`)
- JWT 디코딩하여 페이로드 추출
- 만료 시간 체크 (exp claim)
- 토큰 페이로드에서 사용자 유형 추출
- 남은 시간 계산

### 🪝 useAuth 훅 (`src/hooks/useAuth.ts`)

**책임**:
- 인증 상태 추적 (isAuthenticated, isLoading, userType)
- 마운트 시 자동 토큰 검증
- 라우트 보호 로직
- 로그인/로그아웃 메서드
- 멀티탭 동기화를 위한 storage 이벤트 리스너

**보호된 라우트**:
- 인증 페이지: `/login`, `/signup`, `/company-login`, `/company-signup`
- 보호된 경로: `/user`, `/company` (현재 주석 처리됨)
- 관리자 라우트: `/admin/*`

### 🛡️ 권한 레벨

| 레벨 | 접근 권한 |
|------|----------|
| **Public** | 홈페이지, 채용 공고 목록 (읽기 전용) |
| **Individual Users** | 이력서 관리, 프로필, 지원 |
| **Company Users** | 채용 공고 관리, 기업 프로필 |
| **Admin Users** | 사용자/기업/공고 전체 CRUD |

---

## 8. 상태 관리

### 1️⃣ 서버 상태 (React Query)
```typescript
// API 데이터 캐싱 및 동기화
Query keys: ['resumes'], ['resume', id], ['profile'], etc.
- 자동 백그라운드 리페칭
- 뮤테이션 시 무효화
- 낙관적 업데이트
```

### 2️⃣ 폼 상태 (React Hook Form)
```typescript
// 모든 폼에서 사용
- 검증과 함께 제어되는 폼
- Zod 스키마 통합
- 에러 처리
- 동적 섹션을 위한 필드 배열
```

### 3️⃣ 전역 상태 (Zustand)
```typescript
// 진단 스토어 (src/store/diagnosisStore.ts)
interface DiagnosisStore {
  currentStep: number;              // 현재 단계
  diagnosisData: Partial<DiagnosisData>;  // 진단 데이터
  setStep: (step: number) => void;  // 단계 설정
  updateData: (data: Partial<DiagnosisData>) => void;  // 데이터 업데이트
  reset: () => void;                // 리셋
}
```

### 4️⃣ 로컬 컴포넌트 상태 (useState)
- UI 상태 (로딩, 모달 열기/닫기, 폼 표시 여부)
- 제출 전 임시 폼 데이터
- 미리보기 상태 (이미지 업로드)

### 5️⃣ 인증 상태
- useAuth 훅으로 관리
- localStorage/sessionStorage에 토큰 저장
- storage 이벤트를 통한 탭 간 동기화

---

## 9. 사용자 유형 및 역할

### 👤 일반 사용자 (Individual Users)
**토큰 타입**: `access`

**기능**:
- ✅ 이력서 생성 및 관리
- ✅ 채용 공고 검색 및 조회
- ✅ 채용 공고 지원
- ✅ 프로필 및 연락처 정보 관리
- ✅ 커리어 진단 참여
- ✅ 통계가 포함된 개인 대시보드

**프로필 필드**:
```typescript
기본 정보: name, email, birth_date, country
프로필: location, introduction, position_id, career, job_status
스킬: language_skills[]
포트폴리오: github_url, linkedin_url, website_url
설정: email_notice, sns_message_notice
```

### 🏢 기업 사용자 (Company Users)
**토큰 타입**: `access_company`

**회원가입 필수 정보**:
```typescript
company_number    // 사업자 등록번호
company_name      // 회사명
email             // 이메일
password          // 비밀번호
name              // 담당자명
phone             // 전화번호
```

**기능**:
- ✅ 채용 공고 생성, 수정, 삭제
- ✅ 기업 프로필 관리
- ✅ 지원자 조회
- ✅ 기업 대시보드

**프로필 필드**:
```typescript
industry_type         // 업종
employee_count        // 직원 수
establishment_date    // 설립일
company_type          // 기업 형태
insurance             // 보험
phone_number, address, website_url, email
```

**채용 공고 필드**:
```typescript
title, content
work_experience       // 경력 요구사항
position_id           // 포지션
education             // 학력
language              // 언어 요구사항
employment_type       // 고용 형태
work_location         // 근무 위치
working_hours         // 근무 시간
salary                // 급여
start_date, end_date  // 모집 기간
```

### 👨‍💼 관리자 (Admin Users)
**토큰 타입**: `admin_access`

**기능**:
- ✅ 사용자 전체 CRUD
- ✅ 기업 전체 CRUD
- ✅ 채용 공고 전체 CRUD
- ✅ 통계 대시보드
- ✅ 사용자 인증 확인 (passport_certi 필드)

---

## 10. 주요 워크플로우

### 🆕 A. 일반 사용자 회원가입 워크플로우

**파일**: `src/components/signup/SignupComponent.tsx`

```
1. /signup 페이지 접속
    ↓
2. 2패널 레이아웃: 약관 동의(좌) + 폼(우)
    ↓
3. 약관 동의
   - 필수 약관 5개 + 선택 약관 1개 (마케팅)
   - "전체 선택" 옵션
   - 모달에서 전체 약관 확인
    ↓
4. 폼 작성
   - 이메일 인증:
     • "인증하기" 클릭 → 이메일로 코드 전송
     • 6자리 코드 입력 → 검증
     • 성공: 녹색 체크마크
   - 이름 (영문)
   - 생년월일 (YYYYMMDD 형식)
   - 국가 (검색 가능한 드롭다운)
    ↓
5. 제출 → POST /api/auth/signup
    ↓
6. 성공 → /login으로 리다이렉트
```

### 🏢 B. 기업 회원가입 워크플로우

**파일**:
- Step 1: `src/components/business-signup/BusinessSignupStep1.tsx`
- Step 2: `src/components/business-signup/BusinessSignupStep2.tsx`

**Step 1** (`/company-signup/step1`):
```
약관 동의 (필수 4개 + 선택 1개)
    ↓
진행률 표시기로 퍼센트 표시
    ↓
"다음" 클릭 → Step 2로 진행
```

**Step 2** (`/company-signup/step2`):
```
기업 정보: 사업자번호, 회사명
    ↓
계정 정보: 이메일, 비밀번호 (확인)
    ↓
담당자 정보: 이름, 전화번호
    ↓
제출 → POST /api/auth/company/signup
    ↓
성공 → 기업 로그인 페이지로 리다이렉트
```

### 🔐 C. 로그인 워크플로우

**일반 로그인** (`/login`):
```
1. 이메일 + 비밀번호 입력
    ↓
2. "로그인 상태 유지" 체크박스
    ↓
3. Google OAuth 버튼 옵션
    ↓
4. 제출 → POST /api/auth/login
    ↓
5. 토큰 + token_type 수신
    ↓
6. 토큰 저장 (로그인 상태 유지 시 localStorage, 아니면 sessionStorage)
    ↓
7. / 로 리다이렉트
```

**기업 로그인** (`/company-login`):
```
1. 이메일 (username으로 사용) + 비밀번호
    ↓
2. "이메일 기억하기" 체크박스
    ↓
3. 제출 → POST /api/auth/company/login (form-urlencoded)
    ↓
4. access_token + token_type 수신
    ↓
5. 토큰 저장
    ↓
6. / 로 리다이렉트
```

**Google OAuth**:
```
1. Google 버튼 클릭
    ↓
2. rememberMe 플래그를 localStorage에 저장
    ↓
3. /api/auth/login/google로 리다이렉트
    ↓
4. 백엔드에서 OAuth 플로우 처리
    ↓
5. /auth/callback으로 콜백
    ↓
6. URL에서 토큰 추출
    ↓
7. 저장 및 리다이렉트
```

### 📝 D. 이력서 생성 워크플로우

**파일**: `src/components/resume/ResumeEditor.tsx`

```
1. /user/resume/create 페이지 접속
    ↓
2. 템플릿 타입 선택
    ↓
3. 폼 섹션 작성 (모두 동적 추가/삭제 가능):

   📋 기본 정보:
   - 제목 (필수)
   - 프로필 이미지 업로드 → MinIO presigned URL

   ✍️ 자기소개:
   - 제목 + 내용

   💼 경력 사항:
   - 회사명, 직무, 부서
   - 시작/종료 날짜 ("재직중" 체크박스)
   - 주요 업무 설명

   🎓 학력 사항:
   - 학교 (검색), 전공
   - 시작/종료 날짜
   - 졸업 여부 체크박스

   🗣 언어 능력:
   - 언어 종류 (드롭다운)
   - 수준 (초급/중급/고급/원어민)

   📜 자격증:
   - 명칭, 발급 기관, 취득일
    ↓
4. "생성하기" 클릭 → POST /api/posts/resume
    ↓
5. 성공 → /user (사용자 대시보드)로 리다이렉트
```

### 💼 E. 채용 공고 생성 워크플로우

**파일**: `src/components/company-posts/CompanyPostForm.tsx`

```
1. /company/posts/create 페이지 접속
    ↓
2. 폼 섹션 작성:

   📋 기본 정보:
   - 제목 (필수)
   - 포지션 (드롭다운: Frontend, Backend 등)
   - 내용 (상세 설명)

   📊 요구사항:
   - 경력 (경력무관 ~ 10년 이상)
   - 학력 (학력무관 ~ 석사 이상)
   - 언어 (한국어 능력)

   🏢 근무 조건:
   - 고용 형태 (정규직, 계약직, 인턴, 프리랜서)
   - 근무 위치 (Daum 주소 검색 + 상세 주소)
   - 근무 시간 (주당)
   - 급여 ("협의 가능" 옵션)

   📅 모집 기간:
   - 시작일 (기본값: 오늘)
   - 종료일 (기본값: +30일)
    ↓
3. "등록하기" 클릭 → POST /api/posts/company
    ↓
4. 성공 → 기업 대시보드로 리다이렉트
```

### 🎯 F. 커리어 진단 워크플로우

**파일**:
- `src/components/diagnosis/Session1BasicInfo.tsx`
- Session2CareerSkills, Session3Preferences, Session4Matching

**상태**: Zustand 스토어가 currentStep + diagnosisData 추적

```
Session 1 - 기본 정보:
  - 현재 거주지 (한국 / 해외)
  - 한국어 수준 (TOPIK 레벨)
  - 비자 상태
      ↓
Session 2 - 경력 & 스킬:
  - 경력 기간
  - 직무 분야
  - 학력 수준
  - 언어 능력 (복수 입력)
      ↓
Session 3 - 선호사항:
  - 희망 연봉
  - 고용 형태
  - 회사 규모 선호
  - 시작 가능 날짜
      ↓
Session 4 - 매칭:
  - 어려움 (체크박스)
  - 결과 수신 이메일 (선택)
  - 마케팅 수신 동의
      ↓
최종 제출 → 매칭 처리
      ↓
결과 페이지 표시
```

**플로우**:
```typescript
각 세션마다 스토어 업데이트: updateData(data)
    ↓
다음으로 진행: setStep(currentStep + 1)
    ↓
최종 제출 → 매칭 처리
    ↓
결과 페이지 표시
```

### 👤 G. 프로필 편집 워크플로우

**사용자 프로필** (`/user/profile/edit`):
```
1. 현재 프로필 조회: GET /api/me
    ↓
2. 폼에 데이터 채우기
    ↓
3. 필드 수정:
   - 이름, 위치, 소개, 포지션, 경력, 취업 상태
   - 포트폴리오 URL
   - 언어 능력
    ↓
4. 제출 → PUT /api/me
    ↓
5. 캐시 무효화, 프로필 보기로 리다이렉트
```

**기업 프로필** (`/company/profile/edit`):
```
1. 조회: GET /api/company/profile
    ↓
2. 수정: 업종, 직원 수, 기업 형태 등
    ↓
3. 제출 → PUT /api/company/profile
```

### 👨‍💼 H. 관리자 관리 워크플로우

**대시보드** (`/admin`):
```
통계 표시: 총 사용자, 기업, 공고 수
    ↓
관리 페이지로 빠른 링크
```

**사용자 관리** (`/admin/users`):
```
1. GET /api/admin/users/ → 테이블 표시
    ↓
2. 사용자 클릭 → 상세 정보 보기
    ↓
3. 수정: PUT /api/admin/users/:id
    ↓
4. 삭제: DELETE /api/admin/users/:id
    ↓
5. 특별 필드: passport_certi (인증 상태)
```

**기업 관리** (`/admin/companies`):
```
유사한 CRUD 패턴
    ↓
페이지네이션 지원
```

**공고 관리** (`/admin/posts`):
```
모든 채용 공고 조회
    ↓
수정/삭제 기능
    ↓
페이지네이션 지원
```

---

## 🔧 추가 기술 세부 사항

### ⚠️ 에러 처리
- **중앙화된 에러 코드**: `src/constants/errorCode.ts`
- **토스트 알림**: Sonner 사용
- **폼 레벨 검증**: React Hook Form
- **API 레벨 에러 인터셉터**: Axios

### 📁 파일 업로드
- **MinIO 통합**: 이미지 스토리지
- **Presigned POST URL 패턴**:
  ```
  1. 백엔드에서 presigned URL 요청
  2. MinIO로 직접 업로드
  3. 데이터베이스에 object_name 저장
  ```

### 🔍 SEO & 메타데이터
- 구조화된 데이터 스키마 (WebsiteSchema, OrganizationSchema)
- 기본 메타데이터 설정
- Sitemap 및 robots.txt 라우트

### 🌐 국제화
- **주 UI**: 한국어
- **다국가 지원**: 상수를 통한 지원
- **학교 데이터베이스**: 한국 교육 기관
- **국가 목록**: 200개 이상 국가

### 🚀 빌드 & 배포
- **Docker 지원**: Dockerfile 포함
- **Jenkins 파이프라인**: Jenkinsfile
- **Standalone Next.js 출력**
- **Turbopack 지원**: 빠른 빌드

---

## 📊 프로젝트 통계

```
총 TypeScript/TSX 파일: ~19,618 라인
주요 디렉토리:
  - app/: 라우트 정의 (~40개 페이지)
  - components/: 재사용 컴포넌트 (58개 파일)
  - lib/: API 클라이언트 및 유틸리티
  - hooks/: 커스텀 훅
  - store/: 상태 관리
  - types/: 타입 정의
  - constants/: 상수 및 설정
```

---

이 문서는 WorkInKorea Client 프로젝트의 전체 구조, 기능, 사용 방식을 포괄적으로 설명합니다. 외국인 구직자와 한국 기업을 연결하는 플랫폼으로, 현대적인 기술 스택과 체계적인 아키텍처로 구축되었습니다.
