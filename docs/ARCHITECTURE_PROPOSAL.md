# 프로젝트 구조 리팩토링 제안서

## 📋 목차
1. [현재 구조 분석](#현재-구조-분석)
2. [제안하는 구조](#제안하는-구조)
3. [마이그레이션 계획](#마이그레이션-계획)
4. [장단점 비교](#장단점-비교)
5. [결론 및 권장사항](#결론-및-권장사항)

---

## 현재 구조 분석

### 현재 폴더 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin routes
│   ├── (auth)/                  # Auth routes (login, signup)
│   └── (main)/                  # Main app routes
│
├── components/                   # 모든 컴포넌트
│   ├── admin/                   # 관리자 컴포넌트
│   ├── auth/                    # 인증 컴포넌트
│   ├── business-login/          # 기업 로그인
│   ├── business-signup/         # 기업 회원가입
│   ├── company-posts/           # 공고 관리
│   ├── company-profile/         # 기업 프로필
│   ├── diagnosis/               # 진단 컴포넌트
│   ├── jobs/                    # 채용공고
│   ├── layout/                  # 레이아웃
│   ├── login/                   # 로그인
│   ├── main/                    # 메인 페이지
│   ├── pages/                   # 페이지 컴포넌트
│   ├── profile/                 # 사용자 프로필
│   ├── resume/                  # 이력서
│   ├── seo/                     # SEO 컴포넌트
│   ├── signup/                  # 회원가입
│   ├── ui/                      # UI 컴포넌트
│   └── user/                    # 사용자 컴포넌트
│
├── hooks/                        # 커스텀 훅
├── lib/                          # 라이브러리
│   ├── api/                     # API 클라이언트
│   ├── auth/                    # 인증 유틸
│   ├── providers/               # Context Providers
│   ├── utils/                   # 유틸리티
│   └── validations/             # 검증 로직
│
├── types/                        # TypeScript 타입
├── constants/                    # 상수
└── store/                        # 상태 관리
```

### 현재 구조의 문제점

1. **컴포넌트 과밀화**
   - `components/` 폴더에 20+ 개의 서브폴더
   - 관련 기능이 여러 폴더에 분산

2. **Feature 간 경계 불명확**
   - `business-login`, `business-signup`, `company-posts`, `company-profile`이 모두 분리됨
   - 하나의 기능(company)이 여러 폴더에 흩어져 있음

3. **코드 탐색 어려움**
   - 특정 기능을 수정하려면 여러 폴더를 찾아다녀야 함
   - 예: 기업 관련 기능 수정 시 4-5개 폴더 확인 필요

4. **의존성 파악 어려움**
   - Feature 간 의존성이 명확하지 않음
   - 순환 참조 발생 가능성

---

## 제안하는 구조

### Feature-Based 구조

```
src/
├── app/                          # Next.js App Router (변경 없음)
│   ├── (admin)/
│   ├── (auth)/
│   └── (main)/
│
├── features/                     # 🆕 Feature modules
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
├── shared/                       # 🆕 공유 리소스
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

각 feature는 다음과 같은 일관된 구조를 가집니다:

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

### Public API 예시

```typescript
// features/company/index.ts
export * from './components';
export * from './hooks';
export * from './types';
export { companyApi } from './api';
```

---

## 마이그레이션 계획

### Phase 1: 준비 (1-2일)
1. 새로운 폴더 구조 생성
2. 마이그레이션 스크립트 작성
3. 테스트 환경 구축

### Phase 2: Feature 단위 마이그레이션 (1주)

#### Step 1: shared/ 생성
```bash
# 공용 리소스 이동
src/components/ui/          → src/shared/components/ui/
src/components/layout/      → src/shared/components/layout/
src/components/seo/         → src/shared/components/seo/
src/hooks/                  → src/shared/hooks/
src/lib/utils/              → src/shared/utils/
src/types/                  → src/shared/types/
src/constants/              → src/shared/constants/
```

#### Step 2: auth feature 생성
```bash
src/components/auth/        → src/features/auth/components/
src/components/login/       → src/features/auth/components/login/
src/components/signup/      → src/features/auth/components/signup/
src/lib/api/auth.ts         → src/features/auth/api/
src/lib/auth/               → src/features/auth/utils/
```

#### Step 3: company feature 생성
```bash
src/components/business-login/     → src/features/company/components/login/
src/components/business-signup/    → src/features/company/components/signup/
src/components/company-profile/    → src/features/company/components/profile/
src/components/company-posts/      → src/features/company/components/posts/
src/lib/api/company*.ts            → src/features/company/api/
src/lib/validations/company*.ts    → src/features/company/validations/
```

#### Step 4: 나머지 features
- user
- jobs
- resume
- diagnosis
- admin

### Phase 3: Import 경로 업데이트 (2-3일)

#### 자동화 스크립트 사용
```javascript
// migration/update-imports.js
const importMapping = {
  '@/components/ui': '@/shared/components/ui',
  '@/components/layout': '@/shared/components/layout',
  '@/lib/utils': '@/shared/utils',
  '@/types': '@/shared/types',
  '@/components/company-profile': '@/features/company/components/profile',
  // ... more mappings
};
```

### Phase 4: 테스트 및 검증 (2-3일)
1. 빌드 테스트
2. 단위 테스트 실행
3. E2E 테스트
4. 코드 리뷰

---

## 장단점 비교

### 현재 구조의 장점
✅ Next.js 기본 구조와 유사
✅ 학습 곡선이 낮음
✅ 간단한 프로젝트에 적합

### 현재 구조의 단점
❌ Feature 간 경계 불명확
❌ 컴포넌트 폴더 과밀화
❌ 코드 탐색 어려움
❌ 대규모 프로젝트에 부적합

### Feature-Based 구조의 장점
✅ **명확한 Feature 경계**
   - 각 feature가 독립적인 모듈
   - 의존성 파악 용이

✅ **향상된 코드 탐색**
   - 관련 코드가 한 곳에 모임
   - 기능 단위로 쉽게 찾기

✅ **확장성**
   - 새 feature 추가가 쉬움
   - Feature 단위로 팀 분업 가능

✅ **재사용성**
   - shared/ 에 공용 코드 명확히 분리
   - Feature 간 중복 최소화

✅ **유지보수성**
   - Feature 단위 수정이 안전
   - 영향 범위 명확

✅ **테스트**
   - Feature 단위 테스트 용이
   - Mock 데이터 관리 쉬움

### Feature-Based 구조의 단점
❌ **초기 마이그레이션 비용**
   - 대규모 파일 이동 필요
   - Import 경로 전체 수정

❌ **학습 곡선**
   - 팀원들이 새 구조 학습 필요
   - 문서화 필요

❌ **폴더 깊이 증가**
   - 경로가 길어질 수 있음
   - 하지만 절대 경로(@/)로 해결 가능

---

## 마이그레이션 예시

### Before (현재)
```typescript
// Import hell
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/lib/utils/validation';
import { LoginRequest } from '@/lib/api/types';
import { authApi } from '@/lib/api/auth';
```

### After (Feature-based)
```typescript
// Clean imports
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/hooks';
import { validateEmail } from '@/shared/utils/validation';
import { LoginRequest } from '@/features/auth/types';
import { authApi } from '@/features/auth/api';
```

### Feature Public API 사용
```typescript
// Even cleaner with feature public API
import { useAuth, authApi, LoginRequest } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import { validateEmail } from '@/shared/utils';
```

---

## 실제 파일 이동 예시

### Company Feature 구성

```
features/company/
├── components/
│   ├── login/
│   │   └── BusinessLoginForm.tsx         (from components/business-login/)
│   ├── signup/
│   │   ├── BusinessSignupStep1.tsx      (from components/business-signup/)
│   │   └── BusinessSignupStep2.tsx
│   ├── profile/
│   │   ├── BasicInfoSection.tsx         (from components/company-profile/)
│   │   └── ContactInfoSection.tsx
│   └── posts/
│       ├── CompanyPostForm.tsx          (from components/company-posts/)
│       ├── CompanyPostList.tsx
│       └── CompanyPostDetail.tsx
│
├── hooks/
│   ├── useCompanyAuth.ts
│   ├── useCompanyProfile.ts
│   └── useCompanyPosts.ts
│
├── api/
│   ├── authApi.ts                       (from lib/api/auth.ts - company part)
│   ├── profileApi.ts                    (from lib/api/profile/)
│   └── postsApi.ts                      (from lib/api/posts.ts)
│
├── types/
│   └── company.types.ts                 (from lib/api/types.ts - company part)
│
├── validations/
│   └── companyProfileValidation.ts      (from lib/validations/)
│
└── index.ts                             (feature public API)
```

---

## 결론 및 권장사항

### 🎯 추천: Feature-Based 구조로 마이그레이션

#### 이유:
1. **현재 프로젝트 규모**
   - 이미 20+ 컴포넌트 폴더
   - 다양한 기능 (auth, company, user, jobs, resume, diagnosis)
   - 향후 더 성장할 가능성

2. **명확한 Feature 구분**
   - 기업/사용자/채용공고 등이 명확히 분리됨
   - 각 feature가 독립적으로 개발 가능

3. **팀 협업**
   - Feature 단위로 개발자 할당 가능
   - Merge conflict 감소

4. **유지보수**
   - 버그 수정 시 영향 범위 명확
   - 코드 리뷰가 쉬워짐

### 📅 권장 마이그레이션 일정

**총 소요 시간: 약 2주**

- Week 1:
  - Day 1-2: shared/ 폴더 구성
  - Day 3-4: auth, company features 마이그레이션
  - Day 5: Import 경로 업데이트 (50%)

- Week 2:
  - Day 1-2: user, jobs, resume features 마이그레이션
  - Day 3: Import 경로 업데이트 (완료)
  - Day 4-5: 테스트 및 버그 수정

### ⚠️ 주의사항

1. **점진적 마이그레이션**
   - 한 번에 전체를 이동하지 말 것
   - Feature 단위로 하나씩

2. **테스트 필수**
   - 각 단계마다 빌드 확인
   - E2E 테스트 실행

3. **팀 동의**
   - 모든 팀원이 새 구조 이해
   - 문서화 철저히

4. **롤백 계획**
   - Git branch 전략
   - 문제 발생 시 되돌리기 가능

---

## 다음 단계

1. ✅ 이 제안서 검토
2. ⏳ 팀 회의 및 승인
3. ⏳ 마이그레이션 스크립트 작성
4. ⏳ Phase 1 시작 (shared/ 구성)
5. ⏳ 순차적 Feature 마이그레이션

---

## 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Next.js Project Structure Best Practices](https://nextjs.org/docs/app/building-your-application)
