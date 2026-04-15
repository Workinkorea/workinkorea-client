# WorkinKorea User Flow

## 사용자 유형

| 유형 | 설명 | 인증 | userType 쿠키 |
|------|------|------|--------------|
| 비회원 (Guest) | 로그인하지 않은 방문자 | 없음 | 없음 |
| 개인회원 (User) | 구직자 (외국인 근로자) | Google OAuth / 이메일 | `user` |
| 기업회원 (Company) | 채용 기업 | 이메일/비밀번호 | `company` |
| 관리자 (Admin) | 플랫폼 관리자 | 별도 토큰 | `admin` |

---

## 1. 비회원 (Guest) 플로우

### 1-1. 랜딩 페이지 탐색

```
/ (랜딩)
├── HeroSection — 검색바, 통계
├── ServicesSection — 서비스 소개
├── JobCategoriesSection — 직종 카테고리
├── PopularJobsSection — 인기 공고
├── EventBannerSection — 이벤트 배너
└── CTASection — 회원가입 유도
```

**API:** 없음 (정적/ISR 콘텐츠)

### 1-2. 채용공고 탐색

```
/jobs — 공고 목록 (검색, 필터, 정렬)
  └── /jobs/[id] — 공고 상세
        ├── 공고 정보 확인
        ├── [지원하기] → 로그인 유도
        └── [북마크] → 로그인 유도
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 공고 목록 | GET | `/api/posts/company/list?skip=0&limit=100` | 불필요 |
| 공고 상세 | GET | `/api/posts/company/{id}` | 불필요 |

### 1-3. 자가진단

```
/self-diagnosis — 진단 시작
  └── /diagnosis — 질문 응답 (4세션)
        ├── Session1: 기본정보
        ├── Session2: 경력/스킬
        ├── Session3: 선호도
        └── Session4: 매칭
              └── /diagnosis/result — 결과 확인
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 진단 제출 | POST | `/api/diagnosis/answer` | 선택 |
| 결과 조회 | GET | `/api/diagnosis/answer/{id}` | 불필요 |

### 1-4. 정적 페이지

```
/faq — 자주 묻는 질문
/privacy — 개인정보처리방침
/terms — 이용약관
/support — 고객지원
```

**API:** 없음

### 1-5. 로그인/회원가입 진입

```
/login-select — 로그인 유형 선택 (개인/기업)
├── /login — 개인 로그인 (Google OAuth)
└── /company-login — 기업 로그인 (이메일/비밀번호)

/signup-select — 회원가입 유형 선택
├── /signup — 개인 회원가입
└── /company-signup — 기업 회원가입
```

---

## 2. 개인회원 (User) 플로우

### 2-1. 회원가입

```
/signup-select → /signup
  ├── 이메일 인증 요청
  ├── 인증번호 확인
  ├── 이름, 생년월일, 국가 입력
  └── 가입 완료 → 자동 로그인 → /user/profile/setup
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 이메일 인증 요청 | POST | `/api/auth/email/certify` | 불필요 |
| 인증번호 확인 | POST | `/api/auth/email/certify/verify` | 불필요 |
| 회원가입 | POST | `/api/auth/signup` | 불필요 |

### 2-2. 로그인 (Google OAuth)

```
/login → Google OAuth 리다이렉트
  └── /auth/callback?status=success&token=xxx
        ├── 토큰 저장 (HttpOnly Cookie + in-memory)
        ├── GET /api/me → 200 → 이전 페이지 또는 /
        └── GET /api/me → 404 → /user/profile/setup (프로필 생성)
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| OAuth 시작 | GET | `/api/auth/login/google` | 불필요 |
| OAuth 콜백 | GET | `/api/auth/login/google/callback` | 불필요 |
| 토큰 갱신 | POST | `/api/auth/refresh` | Cookie |
| 로그아웃 | DELETE | `/api/auth/logout` | Cookie |

### 2-3. 프로필 생성 (최초 1회)

```
/user/profile/setup
  ├── 이름 입력 (필수)
  ├── 생년월일 입력 (필수)
  ├── 국적 선택 (필수)
  └── [프로필 생성하기] → POST /api/me → /user/profile
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 프로필 생성 | POST | `/api/me` | 필수 |

### 2-4. 프로필 관리

```
/user/profile — 내 프로필 (대시보드)
  ├── 프로필 헤더 (아바타, 이름, 직종)
  ├── 탭: 대시보드 / 이력서 / 스킬 관리 / 경력 관리
  └── /user/profile/edit — 프로필 수정
        ├── 기본정보 (이름, 위치, 소개, 경력 등)
        ├── 연락처 (전화, GitHub, LinkedIn)
        ├── 환경설정 (알림, 공개 범위)
        └── 계정 설정 (비밀번호 변경)
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 프로필 조회 | GET | `/api/me` | 필수 |
| 프로필 수정 | PATCH | `/api/me` | 필수 |
| 연락처 조회 | GET | `/api/contact` | 필수 |
| 연락처 수정 | PATCH | `/api/contact` | 필수 |
| 계정설정 조회 | GET | `/api/account-config` | 필수 |
| 계정설정 수정 | PATCH | `/api/account-config` | 필수 |

### 2-5. 이력서 관리

```
/user/resume/create — 이력서 작성
  ├── 템플릿 선택
  ├── 기본정보, 학력, 경력, 자격증, 자기소개
  └── [저장] → POST /api/posts/resume

/user/resume/edit/[id] — 이력서 수정
  ├── 기존 데이터 로드 → GET /api/posts/resume/{id}
  └── [저장] → PUT /api/posts/resume/{id}
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 이력서 목록 | GET | `/api/posts/resume/list/me` | 필수 |
| 이력서 상세 | GET | `/api/posts/resume/{id}` | 필수 |
| 이력서 생성 | POST | `/api/posts/resume` | 필수 |
| 이력서 수정 | PUT | `/api/posts/resume/{id}` | 필수 |
| 이력서 삭제 | DELETE | `/api/posts/resume/{id}` | 필수 |

### 2-6. 채용공고 지원

```
/jobs/[id] — 공고 상세
  └── [지원하기] → 이력서 선택 모달
        ├── 이력서 목록 로드
        ├── 이력서 선택
        └── [지원] → (미구현: POST /api/applications)
```

**API:**
| 액션 | Method | Endpoint | 상태 |
|------|--------|----------|------|
| 공고 지원 | POST | `/api/applications` | **미구현** |
| 지원 내역 | GET | `/api/applications/me` | **미구현** |

---

## 3. 기업회원 (Company) 플로우

### 3-1. 회원가입

```
/signup-select → /company-signup
  ├── /company-signup/step1 — 사업자등록번호 인증
  └── /company-signup/step2 — 기업정보 + 담당자 정보 입력
        └── 가입 완료 → /company-login
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 사업자번호 검증 | POST | `/api/verify-business` | 불필요 (Next.js Route Handler) |
| 기업 가입 | POST | `/api/auth/company/signup` | 불필요 |

### 3-2. 로그인

```
/company-login
  ├── 이메일 + 비밀번호 입력
  └── [로그인] → POST /api/auth/company/login
        ├── 성공 → /company (대시보드)
        └── 실패 → 에러 메시지 (401/403/404/429)
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 기업 로그인 | POST | `/api/auth/company/login` | 불필요 |
| 토큰 갱신 | POST | `/api/auth/refresh` | Cookie |
| 로그아웃 | DELETE | `/api/auth/logout` | Cookie |

### 3-3. 기업 대시보드

```
/company — 대시보드/랜딩
  ├── 비인증: CompanyLandingPage (서비스 소개)
  └── 인증: CompanyProfileClient (기업 프로필 + 공고 목록)
        ├── 기업 프로필 카드
        ├── 공고 통계 (총 공고, 진행 중, 마감)
        └── 최근 공고 목록
```

### 3-4. 기업 프로필 관리

```
/company/profile/edit — 기업 프로필 수정
  ├── 업종, 직원수, 설립일
  ├── 기업유형, 보험정보
  ├── 연락처, 주소, 웹사이트
  └── [저장] → POST(신규) 또는 PUT(수정) /api/company-profile
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 기업프로필 조회 | GET | `/api/company-profile` | 필수 |
| 기업프로필 생성 | POST | `/api/company-profile` | 필수 |
| 기업프로필 수정 | PUT | `/api/company-profile` | 필수 |

### 3-5. 채용공고 관리

```
/company/jobs — 내 공고 목록
  ├── 공고 상태별 필터
  └── 공고 카드 (수정/삭제)

/company/posts/create — 공고 작성
  ├── 기본정보 (제목, 직종, 고용형태)
  ├── 근무조건 (급여, 근무시간, 근무지)
  ├── 모집기간
  ├── 담당자 정보
  └── [등록] → POST /api/posts/company

/company/posts/edit/[id] — 공고 수정
  ├── 기존 데이터 로드 → GET /api/posts/company/{id}
  └── [수정] → PUT /api/posts/company/{id}
```

**API:**
| 액션 | Method | Endpoint | 인증 |
|------|--------|----------|------|
| 내 공고 목록 | GET | `/api/posts/company` | 필수 |
| 공고 상세 | GET | `/api/posts/company/{id}` | 불필요 |
| 공고 생성 | POST | `/api/posts/company` | 필수 |
| 공고 수정 | PUT | `/api/posts/company/{id}` | 필수 |
| 공고 삭제 | DELETE | `/api/posts/company/{id}` | 필수 |

---

## 4. 인증 플로우 (공통)

### 4-1. 토큰 관리

```
[로그인 성공]
  ├── 서버: Set-Cookie (refresh_token, HttpOnly)
  ├── 서버: Set-Cookie (access_token, HttpOnly)
  ├── 클라이언트: tokenStore.set(access_token) — in-memory
  └── 클라이언트: Cookie (userType) — UI용

[API 요청]
  ├── fetchClient: Authorization 헤더에 access_token 사용
  ├── 401 → POST /api/auth/refresh → 성공 시 재시도
  └── refresh 실패 → 로그인 페이지로 리다이렉트
```

### 4-2. 미들웨어 라우트 보호

| 라우트 | 조건 | 미인증 시 |
|--------|------|----------|
| `/user/*` | userType === 'user' | → `/login-select` |
| `/company/*` | userType === 'company' | → `/company-login` |
| `/admin/*` | userType === 'admin' | → `/login-select` |
| Auth 페이지 | 이미 로그인됨 | → 대시보드 리다이렉트 |

---

## 5. 클라이언트-서버 API 불일치 현황

| 기능 | 클라이언트 | 서버 | 상태 |
|------|-----------|------|------|
| 채용 지원 | `POST /api/applications` | 없음 | **서버 미구현** |
| 지원 내역 | `GET /api/applications/me` | 없음 | **서버 미구현** |
| 파일 업로드 | `POST /api/minio/user/file` | `POST /api/minio/user/file` | 일치 |
| Admin 이벤트 | `/api/admin/events/*` | `/api/admin/notices/*` | **경로 불일치** |

---

## 6. 페이지 라우트 전체 맵

```
/ .......................... 랜딩 (공개)
/jobs ...................... 공고 목록 (공개)
/jobs/[id] ................. 공고 상세 (공개)
/self-diagnosis ............ 자가진단 시작 (공개)
/diagnosis ................. 진단 질문 (공개)
/diagnosis/result .......... 진단 결과 (공개)
/faq ....................... FAQ (공개)
/privacy ................... 개인정보처리방침 (공개)
/terms ..................... 이용약관 (공개)
/support ................... 고객지원 (공개)
/login-select .............. 로그인 유형 선택
/login ..................... 개인 로그인
/signup-select ............. 회원가입 유형 선택
/signup .................... 개인 가입
/company-login ............. 기업 로그인
/company-signup ............ 기업 가입
/company-signup/step1 ...... 사업자번호 인증
/company-signup/step2 ...... 기업정보 입력
/auth/callback ............. OAuth 콜백
/user ...................... 유저 대시보드 리다이렉트
/user/profile .............. 내 프로필
/user/profile/setup ........ 프로필 최초 생성
/user/profile/edit ......... 프로필 수정
/user/resume/create ........ 이력서 작성
/user/resume/edit/[id] ..... 이력서 수정
/company ................... 기업 대시보드
/company/profile/edit ...... 기업 프로필 수정
/company/jobs .............. 내 공고 목록
/company/posts/create ...... 공고 작성
/company/posts/edit/[id] ... 공고 수정
/admin ..................... 관리자 대시보드
/admin/users ............... 회원 관리
/admin/companies ........... 기업 관리
/admin/posts ............... 공고 관리
/admin/events .............. 이벤트 관리
/admin/events/create ....... 이벤트 생성
```
