# WorkinKorea Client 문서

> Next.js 기반 구직/구인 플랫폼의 종합 개발 가이드

## 📑 목차

1. [빠른 참조](#-빠른-참조)
2. [문서 목록](#-문서-목록)
3. [프로젝트 구조](#-현재-프로젝트-구조)
4. [주요 기능별 파일 위치](#-주요-기능별-파일-위치)
5. [실전 사용 예시](#-실전-사용-예시)
6. [코딩 컨벤션](#-코딩-컨벤션)
7. [Best Practices](#-best-practices)
8. [일반적인 개발 작업 가이드](#-일반적인-개발-작업-가이드)
9. [문제 해결](#-문제-해결)
10. [아키텍처 개선 계획](#-아키텍처-개선-계획)

---

## ⚡ 빠른 참조

### 자주 사용하는 파일

| 용도 | 파일 경로 |
|------|----------|
| 에러 처리 | `src/lib/utils/errorHandler.ts` |
| 전화번호 검증 | `src/lib/utils/phoneUtils.ts` |
| 폼 검증 | `src/lib/validations/*.ts` |
| API 클라이언트 | `src/lib/api/*.ts` |
| 타입 정의 | `src/types/*.ts` |
| Enum 타입 | `src/types/enums.ts` |
| 커스텀 훅 | `src/hooks/*.ts` |

### 자주 사용하는 훅

```typescript
// Mutation with auto toast & redirect
import { useCreateMutation } from '@/hooks/useMutationWithToast';

// 인증 상태 관리
import { useAuth } from '@/hooks/useAuth';

// Debounce
import { useDebounce } from '@/hooks/useDebounce';
```

### 자주 사용하는 유틸리티

```typescript
// 에러 처리
import { extractErrorMessage, logError } from '@/lib/utils/errorHandler';

// 전화번호 처리
import { validatePhoneType, formatPhoneByType } from '@/lib/utils/phoneUtils';

// 검증
import { validateEmail, validatePassword } from '@/lib/utils/validation';
```

---

## 📚 문서 목록

### 아키텍처
- [프로젝트 구조 리팩토링 제안](./ARCHITECTURE_PROPOSAL.md) - Feature-based 구조 제안서

### API 문서
- [전화번호 타입 필드 추가 요청](./api-phone-type-requirement.md) - 백엔드 팀을 위한 API 스펙 문서

### 리팩토링 보고서
- [2026년 1월 리팩토링](./REFACTORING_2026-01.md) - 대규모 코드 리팩토링 작업 요약

---

## 🏗️ 현재 프로젝트 구조

### 📂 전체 디렉토리 구조

```
workinkorea-client/
├── docs/                           # 📚 프로젝트 문서
│   ├── README.md                  # 이 파일
│   ├── ARCHITECTURE_PROPOSAL.md   # 구조 리팩토링 제안서
│   ├── REFACTORING_2026-01.md    # 리팩토링 보고서
│   └── api-phone-type-requirement.md  # API 스펙
│
├── public/                         # 정적 파일
│   ├── images/
│   └── ...
│
└── src/                            # 소스 코드
    ├── app/                        # 📱 Next.js App Router
    ├── components/                 # 🧩 React 컴포넌트
    ├── hooks/                      # 🪝 커스텀 훅
    ├── lib/                        # 📦 라이브러리
    ├── types/                      # 📝 TypeScript 타입
    ├── constants/                  # 🔢 상수
    └── store/                      # 💾 상태 관리
```

---

## 📱 App Directory (Next.js App Router)

```
src/app/
├── (admin)/                        # 관리자 라우트 그룹
│   └── admin/
│       ├── layout.tsx
│       └── page.tsx
│
├── (auth)/                         # 인증 라우트 그룹
│   ├── auth/                      # OAuth 콜백
│   ├── company-login/             # 기업 로그인
│   ├── company-signup/            # 기업 회원가입
│   │   ├── step1/
│   │   └── step2/
│   ├── login/                     # 개인 로그인
│   ├── login-select/              # 로그인 유형 선택
│   ├── signup/                    # 개인 회원가입
│   │   ├── step1/
│   │   ├── step2/
│   │   └── step3/
│   └── signup-select/             # 회원가입 유형 선택
│
├── (main)/                         # 메인 앱 라우트 그룹
│   ├── company/                   # 기업 대시보드
│   │   ├── posts/                 # 공고 관리
│   │   │   ├── create/
│   │   │   ├── edit/[id]/
│   │   │   └── [id]/
│   │   └── profile/
│   │       └── edit/
│   ├── diagnosis/                 # 진단 결과
│   ├── jobs/                      # 채용공고 목록
│   │   └── [id]/                  # 채용공고 상세
│   ├── self-diagnosis/            # 자가 진단
│   └── user/                      # 사용자 대시보드
│       ├── profile/
│       │   └── edit/
│       └── resume/
│           ├── create/
│           ├── edit/[id]/
│           └── [id]/
│
├── api/                            # API 라우트
│   └── verify-business/
│       └── route.ts
│
├── layout.tsx                      # 루트 레이아웃
├── page.tsx                        # 홈페이지
├── globals.css                     # 전역 스타일
├── robots.txt                      # SEO
└── sitemap.xml                     # SEO
```

### 라우트 그룹 설명

- **(admin)**: 관리자 전용 페이지
- **(auth)**: 인증 관련 페이지 (로그인, 회원가입)
- **(main)**: 인증 후 메인 애플리케이션 페이지

---

## 🧩 Components Directory

```
src/components/
├── admin/                          # 관리자 컴포넌트
│   ├── AdminUserList.tsx
│   ├── AdminCompanyList.tsx
│   └── AdminPostList.tsx
│
├── auth/                           # 인증 공통 컴포넌트
│   └── OAuth/
│
├── business-login/                 # 기업 로그인
│   └── BusinessLoginForm.tsx
│
├── business-signup/                # 기업 회원가입
│   ├── BusinessSignupStep1.tsx
│   └── BusinessSignupStep2.tsx
│
├── company-posts/                  # 📋 공고 관리
│   ├── CompanyPostForm.tsx        # 공고 작성/수정 폼
│   ├── CompanyPostList.tsx        # 공고 목록
│   └── CompanyPostCard.tsx        # 공고 카드
│
├── company-profile/                # 🏢 기업 프로필 (리팩토링 완료)
│   ├── BasicInfoSection.tsx       # 기본 정보 섹션
│   └── ContactInfoSection.tsx     # 연락 정보 섹션
│
├── diagnosis/                      # 🧠 진단
│   ├── DiagnosisForm.tsx
│   └── DiagnosisResult.tsx
│
├── jobs/                           # 💼 채용공고
│   ├── JobList.tsx
│   ├── JobCard.tsx
│   ├── JobDetail.tsx
│   └── JobFilters.tsx
│
├── layout/                         # 🎨 레이아웃
│   ├── Layout.tsx                 # 메인 레이아웃
│   ├── Header.tsx                 # 헤더
│   ├── Footer.tsx                 # 푸터
│   └── Sidebar.tsx                # 사이드바
│
├── login/                          # 🔐 개인 로그인
│   └── LoginContent.tsx
│
├── main/                           # 🏠 메인 페이지
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── TestimonialsSection.tsx
│   └── MainClient.tsx
│
├── pages/                          # 📄 페이지 레벨 컴포넌트
│   ├── CompanyProfileEditClient.tsx
│   ├── CompanyPostCreateClient.tsx
│   ├── CompanyPostEditClient.tsx
│   ├── DiagnosisClient.tsx
│   ├── UserProfileClient.tsx
│   └── ...
│
├── profile/                        # 👤 사용자 프로필
│   ├── sections/
│   │   ├── BasicInfoSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── PreferencesSection.tsx
│   │   └── AccountSettingsSection.tsx
│   └── shared/
│       ├── ProfileImageUpload.tsx
│       └── PortfolioUpload.tsx
│
├── resume/                         # 📝 이력서
│   ├── ResumeEditor.tsx
│   ├── ResumePreview.tsx
│   └── ResumeList.tsx
│
├── seo/                            # 🔍 SEO
│   └── MetaTags.tsx
│
├── signup/                         # ✍️ 개인 회원가입
│   ├── SignupComponent.tsx
│   └── SignupSteps/
│
├── ui/                             # 🎨 재사용 가능한 UI 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── FormField.tsx
│   ├── DaumPostcodeSearch.tsx
│   └── AccessibleIcon.tsx
│
└── user/                           # 👥 사용자 관련
    └── UserDashboard.tsx
```

---

## 🪝 Hooks Directory

```
src/hooks/
├── useAuth.ts                      # 인증 상태 관리
├── useMutationWithToast.ts         # 🆕 Mutation + Toast 통합
├── useDebounce.ts                  # Debounce 훅
├── useMediaQuery.ts                # 반응형 쿼리
├── useFormPersistence.ts           # 폼 데이터 저장
└── useInfiniteScroll.ts            # 무한 스크롤
```

### 주요 훅 설명

#### useMutationWithToast
Mutation 작업에 자동 toast 알림, 쿼리 무효화, 리다이렉트를 통합한 훅

```typescript
const { mutate } = useMutationWithToast({
  mutationFn: api.create,
  successMessage: '등록 완료',
  redirectUrl: '/list',
  invalidateQueryKeys: [['items']],
});
```

---

## 📦 Lib Directory

```
src/lib/
├── api/                            # API 클라이언트
│   ├── client.ts                  # Axios 인스턴스
│   ├── auth.ts                    # 인증 API
│   ├── posts.ts                   # 공고 API
│   ├── profile/                   # 프로필 API
│   │   ├── profileUser.ts
│   │   └── profileCompany.ts
│   └── types.ts                   # API 타입 (레거시)
│
├── auth/                           # 인증 관련
│   └── config.ts
│
├── providers/                      # Context Providers
│   ├── QueryProvider.tsx          # React Query
│   └── AuthProvider.tsx           # 인증 Context
│
├── utils/                          # 🛠️ 유틸리티 함수
│   ├── errorHandler.ts            # 🆕 에러 처리
│   ├── phoneUtils.ts              # 전화번호 처리
│   ├── validation.ts              # 유효성 검사
│   ├── tokenManager.ts            # 토큰 관리
│   └── formatting.ts              # 포맷팅
│
└── validations/                    # 🆕 폼 검증 로직
    └── companyProfileValidation.ts
```

### 주요 유틸리티 설명

#### errorHandler.ts
```typescript
// 에러 메시지 추출
extractErrorMessage(error, defaultMessage)

// 네트워크 에러 확인
isNetworkError(error)

// 인증 에러 확인
isAuthError(error)

// 개발 모드 로깅
logError(error, context)
```

#### phoneUtils.ts
```typescript
// 전화번호 타입 감지
detectPhoneType(phoneNumber)

// 타입별 검증
validatePhoneType(phoneNumber, phoneType)

// 타입별 포맷팅
formatPhoneByType(phoneNumber, phoneType)
```

---

## 📝 Types Directory

```
src/types/
├── api.ts                          # 🆕 Generic API 타입
│   ├── ApiResponse<T>
│   ├── ApiPaginatedResponse<T>
│   ├── ApiErrorResponse
│   └── ...
│
├── enums.ts                        # 🆕 Enum 타입
│   ├── PhoneType
│   ├── TokenType
│   ├── JobStatus
│   ├── CareerLevel
│   └── ...
│
└── signup.type.ts                  # 회원가입 타입
```

### Generic 타입 사용 예시

```typescript
import { ApiResponse } from '@/types/api';

type LoginResponse = ApiResponse<{
  token: string;
  user: UserInfo;
}>;
```

---

## 🔢 Constants Directory

```
src/constants/
├── countries.ts                    # 국가 목록
├── positions.ts                    # 직무 목록
├── languages.ts                    # 언어 목록
└── config.ts                       # 설정 상수
```

---

## 💾 Store Directory

```
src/store/
└── ... (상태 관리 스토어)
```

---

## 🎯 주요 기능별 파일 위치

### 인증 (Authentication)
- **개인 로그인**: `src/components/login/LoginContent.tsx`
- **기업 로그인**: `src/components/business-login/BusinessLoginForm.tsx`
- **회원가입**: `src/components/signup/SignupComponent.tsx`, `src/components/business-signup/BusinessSignupStep*.tsx`
- **인증 API**: `src/lib/api/auth.ts`
- **인증 훅**: `src/hooks/useAuth.ts`
- **토큰 관리**: `src/lib/utils/tokenManager.ts`

### 프로필 관리 (Profile)
- **개인 프로필 수정**: `src/app/(main)/user/profile/edit/page.tsx` → `src/components/pages/UserProfileClient.tsx`
- **기업 프로필 수정**: `src/app/(main)/company/profile/edit/page.tsx` → `src/components/pages/CompanyProfileEditClient.tsx`
- **프로필 섹션 컴포넌트**: `src/components/company-profile/`, `src/components/profile/sections/`
- **프로필 API**: `src/lib/api/profile/profileUser.ts`, `src/lib/api/profile/profileCompany.ts`
- **프로필 검증**: `src/lib/validations/companyProfileValidation.ts`

### 채용 공고 (Job Posts)
- **공고 목록**: `src/app/(main)/jobs/page.tsx` → `src/components/jobs/JobList.tsx`
- **공고 상세**: `src/app/(main)/jobs/[id]/page.tsx` → `src/components/jobs/JobDetail.tsx`
- **공고 생성**: `src/app/(main)/company/posts/create/page.tsx` → `src/components/pages/CompanyPostCreateClient.tsx`
- **공고 수정**: `src/app/(main)/company/posts/edit/[id]/page.tsx` → `src/components/pages/CompanyPostEditClient.tsx`
- **공고 컴포넌트**: `src/components/company-posts/`
- **공고 API**: `src/lib/api/posts.ts`

### 이력서 (Resume)
- **이력서 목록**: `src/app/(main)/user/resume/page.tsx`
- **이력서 작성/수정**: `src/components/resume/ResumeEditor.tsx`
- **이력서 미리보기**: `src/components/resume/ResumePreview.tsx`

### 진단 (Self-Diagnosis)
- **진단 페이지**: `src/app/(main)/self-diagnosis/page.tsx` → `src/components/diagnosis/DiagnosisForm.tsx`
- **진단 결과**: `src/app/(main)/diagnosis/page.tsx` → `src/components/diagnosis/DiagnosisResult.tsx`

### 관리자 (Admin)
- **관리자 대시보드**: `src/app/(admin)/admin/page.tsx`
- **관리자 컴포넌트**: `src/components/admin/`

---

## 🚀 실전 사용 예시

### 1. 에러 처리
```typescript
import { extractErrorMessage, logError } from '@/lib/utils/errorHandler';

try {
  await api.operation();
} catch (error) {
  logError(error, 'Component.method');
  toast.error(extractErrorMessage(error, '작업 실패'));
}
```

### 2. 폼 검증
```typescript
import { validateCompanyProfileField } from '@/lib/validations/companyProfileValidation';

const error = validateCompanyProfileField('email', value, formData);
```

### 3. Mutation 훅
```typescript
import { useCreateMutation } from '@/hooks/useMutationWithToast';

const { mutate, isPending } = useCreateMutation({
  mutationFn: api.create,
  resourceName: '항목',
  redirectUrl: '/list',
  invalidateQueryKeys: [['items']],
});
```

## 📖 코딩 컨벤션

### 파일명
- 컴포넌트: `PascalCase.tsx`
- 유틸리티: `camelCase.ts`
- 타입: `camelCase.ts`
- 상수: `UPPER_SNAKE_CASE.ts`

### 컴포넌트
```typescript
// Props 인터페이스 정의
interface ComponentNameProps {
  // ...
}

// 함수형 컴포넌트
export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // ...
};

// Default export (페이지 컴포넌트)
export default ComponentName;
```

### 타입
```typescript
// Enum 타입
export const TypeName = {
  VALUE1: 'value1',
  VALUE2: 'value2',
} as const;

export type TypeName = typeof TypeName[keyof typeof TypeName];

// Interface
export interface InterfaceName {
  field: type;
}

// Generic 타입
export interface GenericType<T> {
  data: T;
}
```

## 🔧 유틸리티 가이드

### errorHandler.ts
- `extractErrorMessage()` - 에러 메시지 추출
- `extractErrorField()` - 에러 필드 추출
- `isNetworkError()` - 네트워크 에러 확인
- `isAuthError()` - 인증 에러 확인
- `logError()` - 개발 모드 로깅

### phoneUtils.ts
- `detectPhoneType()` - 전화번호 타입 감지
- `validatePhoneType()` - 타입별 검증
- `formatPhoneByType()` - 타입별 포맷팅
- `getPhonePlaceholder()` - Placeholder 텍스트

### validation.ts
- `validatePassword()` - 비밀번호 검증
- `validateEmail()` - 이메일 검증
- `validateBirthDate()` - 생년월일 검증
- `formatBusinessNumber()` - 사업자번호 포맷팅

## 🎯 Best Practices

### 1. 에러 처리는 항상 중앙화된 함수 사용
```typescript
// ❌ Bad
catch (error) {
  console.error(error);
  alert('에러 발생');
}

// ✅ Good
catch (error) {
  logError(error, 'Context');
  toast.error(extractErrorMessage(error, 'Fallback message'));
}
```

### 2. 검증 로직은 재사용 가능한 함수로 분리
```typescript
// ❌ Bad
if (!email || !email.includes('@')) {
  setError('email', { message: '이메일이 유효하지 않습니다' });
}

// ✅ Good
const error = validateEmail(email);
if (error) {
  setError('email', { message: error });
}
```

### 3. Mutation은 커스텀 훅 사용
```typescript
// ❌ Bad
const mutation = useMutation({
  mutationFn: api.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['items']);
    toast.success('생성 완료');
    router.push('/list');
  },
  onError: (error) => {
    toast.error(extractErrorMessage(error, '생성 실패'));
  },
});

// ✅ Good
const { mutate } = useCreateMutation({
  mutationFn: api.create,
  resourceName: '항목',
  redirectUrl: '/list',
  invalidateQueryKeys: [['items']],
});
```

### 4. 타입은 Enum 타입 사용
```typescript
// ❌ Bad
type PhoneType = 'MOBILE' | 'LANDLINE'; // 오타 가능성

// ✅ Good
import { PhoneType } from '@/types/enums';
const phoneType: PhoneType = PhoneType.MOBILE; // 자동 완성, 오타 방지
```

## 📝 Contributing

1. 새로운 유틸리티 함수는 해당 파일에 JSDoc 주석 추가
2. 새로운 컴포넌트는 Props 인터페이스 정의
3. 타입은 가능한 한 Generic 타입 사용
4. 에러 처리는 반드시 `errorHandler` 사용
5. Mutation은 `useMutationWithToast` 훅 사용

## 🐛 문제 해결

### 타입 에러
- `types/enums.ts`와 `types/api.ts` 파일 확인
- Import 경로가 올바른지 확인
- `lib/api/types.ts` (레거시)와 `types/api.ts` (신규) 혼동 주의

### 에러 처리
- `errorHandler.ts`의 함수들이 제대로 import되었는지 확인
- `logError`는 개발 모드에서만 작동
- 모든 catch 블록에서 `extractErrorMessage` 사용 권장

### 훅 사용
- `useMutationWithToast`는 React Query 환경에서만 사용 가능
- `useRouter`는 Next.js 환경 필요
- 커스텀 훅은 반드시 함수 컴포넌트 내부에서 호출

### 전화번호 검증 에러
- `phone_type` 필드가 설정되어 있는지 확인
- `phoneUtils.ts`의 `validatePhoneType()` 사용
- MOBILE: 010-1234-5678, LANDLINE: 02-1234-5678 형식

---

## 🔨 일반적인 개발 작업 가이드

### 새로운 기업 기능 추가
1. **라우트**: `src/app/(main)/company/[feature]/page.tsx` 생성
2. **페이지 컴포넌트**: `src/components/pages/[Feature]Client.tsx` 생성
3. **섹션 컴포넌트**: `src/components/[feature]/` 폴더에 분리
4. **API**: `src/lib/api/[feature].ts` 추가
5. **타입**: `src/lib/api/types.ts` 또는 `src/types/api.ts`에 추가
6. **검증**: `src/lib/validations/[feature]Validation.ts` 생성

### 새로운 폼 추가
1. **폼 컴포넌트**: `src/components/[feature]/[Feature]Form.tsx`
2. **검증 규칙**: `src/lib/validations/[feature]Validation.ts`
3. **타입 정의**: 요청/응답 인터페이스 정의
4. **Mutation 훅**: `useMutationWithToast` 사용
```typescript
const { mutate } = useCreateMutation({
  mutationFn: api.create,
  resourceName: '항목',
  redirectUrl: '/success',
  invalidateQueryKeys: [['feature']],
});
```

### 새로운 API 엔드포인트 연결
1. **API 함수**: `src/lib/api/[feature].ts`에 추가
```typescript
export const featureApi = {
  getList: async () => {
    const response = await apiClient.get<ApiResponse<Item[]>>('/endpoint');
    return response.data;
  },
};
```
2. **타입 정의**: Request/Response 인터페이스
3. **컴포넌트**: useQuery 또는 useMutationWithToast 사용

### 공통 UI 컴포넌트 추가
1. **컴포넌트**: `src/components/ui/[Component].tsx` 생성
2. **Props 인터페이스** 정의
3. **TypeScript 타입** 엄격하게 적용
4. **재사용성** 고려한 설계

### 유틸리티 함수 추가
1. **함수 작성**: `src/lib/utils/[utility].ts`
2. **JSDoc 주석** 추가
```typescript
/**
 * 함수 설명
 * @param param1 - 파라미터 설명
 * @returns 리턴값 설명
 */
export const utilityFunction = (param1: string): string => {
  // 구현
};
```
3. **타입 안전성** 확보
4. **테스트 케이스** 고려

### 검증 규칙 추가
1. **검증 파일**: `src/lib/validations/[feature]Validation.ts`
2. **규칙 객체** 패턴 사용
```typescript
export const validationRules: Record<string, ValidationRule> = {
  fieldName: (value: string | number) => {
    if (!value) return '필수 입력 항목입니다.';
    // 추가 검증 로직
    return ''; // 에러 없음
  },
};
```

---

## 🏗️ 아키텍처 개선 계획

더 나은 구조를 위한 Feature-based 아키텍처 제안서가 준비되어 있습니다:
- **[ARCHITECTURE_PROPOSAL.md](./ARCHITECTURE_PROPOSAL.md)** - 상세한 구조 개선 제안

주요 개선 사항:
- `/features` 디렉토리로 기능별 모듈화
- 공유 컴포넌트와 기능별 컴포넌트 분리
- 도메인 중심의 코드 구조
- 2주 마이그레이션 계획 포함

---

## 📚 추가 문서

- [API 문서](./api-phone-type-requirement.md)
- [리팩토링 보고서](./REFACTORING_2026-01.md)
