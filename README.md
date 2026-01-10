### Feature-Based 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (admin)/
│   ├── (auth)/
│   └── (main)/
│
├── features/                     # Feature modules
│   │
│   ├── auth/                    # 인증 기능
│   │   ├── components/          # 인증 관련 컴포넌트
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   ├── hooks/               # 인증 관련 훅
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── api/                 # 인증 API
│   │   │   └── authApi.ts
│   │   ├── types/               # 인증 타입
│   │   │   └── auth.types.ts
│   │   └── utils/               # 인증 유틸
│   │       └── tokenManager.ts
│   │
│   ├── company/                 # 기업 기능
│   │   ├── components/
│   │   │   ├── login/           # 기업 로그인
│   │   │   ├── signup/          # 기업 회원가입
│   │   │   ├── profile/         # 기업 프로필
│   │   │   │   ├── BasicInfoSection.tsx
│   │   │   │   └── ContactInfoSection.tsx
│   │   │   └── posts/           # 공고 관리
│   │   │       ├── PostForm.tsx
│   │   │       ├── PostList.tsx
│   │   │       └── PostDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useCompanyAuth.ts
│   │   │   ├── useCompanyProfile.ts
│   │   │   └── useCompanyPosts.ts
│   │   ├── api/
│   │   │   ├── companyAuthApi.ts
│   │   │   ├── companyProfileApi.ts
│   │   │   └── companyPostsApi.ts
│   │   ├── types/
│   │   │   └── company.types.ts
│   │   └── validations/
│   │       ├── companyProfileValidation.ts
│   │       └── companyPostValidation.ts
│   │
│   ├── user/                    # 사용자 기능
│   │   ├── components/
│   │   │   ├── profile/
│   │   │   │   ├── BasicInfoSection.tsx
│   │   │   │   ├── ContactSection.tsx
│   │   │   │   └── PreferencesSection.tsx
│   │   │   └── dashboard/
│   │   ├── hooks/
│   │   │   └── useUserProfile.ts
│   │   ├── api/
│   │   │   └── userApi.ts
│   │   └── types/
│   │       └── user.types.ts
│   │
│   ├── jobs/                    # 채용공고
│   │   ├── components/
│   │   │   ├── JobList.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   └── JobCard.tsx
│   │   ├── hooks/
│   │   │   ├── useJobs.ts
│   │   │   └── useJobFilters.ts
│   │   ├── api/
│   │   │   └── jobsApi.ts
│   │   └── types/
│   │       └── jobs.types.ts
│   │
│   ├── resume/                  # 이력서
│   │   ├── components/
│   │   │   ├── ResumeEditor.tsx
│   │   │   ├── ResumePreview.tsx
│   │   │   └── ResumeList.tsx
│   │   ├── hooks/
│   │   │   └── useResume.ts
│   │   ├── api/
│   │   │   └── resumeApi.ts
│   │   └── types/
│   │       └── resume.types.ts
│   │
│   ├── diagnosis/               # 진단
│   │   ├── components/
│   │   │   ├── DiagnosisForm.tsx
│   │   │   └── DiagnosisResult.tsx
│   │   ├── hooks/
│   │   │   └── useDiagnosis.ts
│   │   ├── api/
│   │   │   └── diagnosisApi.ts
│   │   └── types/
│   │       └── diagnosis.types.ts
│   │
│   └── admin/                   # 관리자
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types/
│
├── shared/                       # 공유 리소스
│   ├── components/              # 공용 UI 컴포넌트
│   │   ├── ui/                  # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/              # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── seo/                 # SEO 컴포넌트
│   │   │   └── MetaTags.tsx
│   │   └── forms/               # 공용 폼 컴포넌트
│   │       ├── FormField.tsx
│   │       └── FormSection.tsx
│   │
│   ├── hooks/                   # 공용 훅
│   │   ├── useMutationWithToast.ts
│   │   ├── useMediaQuery.ts
│   │   └── useDebounce.ts
│   │
│   ├── utils/                   # 유틸리티
│   │   ├── errorHandler.ts
│   │   ├── phoneUtils.ts
│   │   ├── validation.ts
│   │   └── formatting.ts
│   │
│   ├── types/                   # 공용 타입
│   │   ├── api.ts
│   │   ├── enums.ts
│   │   └── common.ts
│   │
│   ├── constants/               # 상수
│   │   ├── countries.ts
│   │   ├── positions.ts
│   │   └── config.ts
│   │
│   └── styles/                  # 공용 스타일
│       └── globals.css
│
└── lib/                          # 라이브러리 설정
    ├── api/                     # API 클라이언트 설정
    │   └── client.ts
    ├── providers/               # Context Providers
    │   ├── QueryProvider.tsx
    │   └── AuthProvider.tsx
    └── auth/                    # 인증 설정
        └── config.ts
```

---

## Feature 모듈 구조 상세

각 feature는 다음과 같은 일관된 구조를 가집니다

```
features/[feature-name]/
├── components/          # Feature 전용 컴포넌트
│   ├── [SubFeature]/   # 하위 기능별 그룹
│   └── index.ts        # Public exports
│
├── hooks/              # Feature 전용 훅
│   └── index.ts
│
├── api/                # Feature API 클라이언트
│   └── index.ts
│
├── types/              # Feature 타입
│   └── index.ts
│
├── utils/              # Feature 유틸리티 (optional)
│   └── index.ts
│
├── validations/        # Feature 검증 로직 (optional)
│   └── index.ts
│
├── constants/          # Feature 상수 (optional)
│   └── index.ts
│
└── index.ts            # Feature public API
```
