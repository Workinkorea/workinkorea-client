# UX Flow Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 7가지 UX 흐름 문제를 수정하여 회원가입·로그인·뷰 전환 흐름을 개선한다.

**Architecture:** 모든 수정은 프론트엔드 전용(Next.js). callbackUrl 체이닝, 자동 로그인, 에러 메시지, 컨텍스트 유지를 각 컴포넌트 레벨에서 처리한다.

**Tech Stack:** Next.js 16, React 19, next-intl, Zustand, Framer Motion, Sonner

---

## Task 1: callbackUrl threading through signup flow

**Files:**
- Modify: `src/app/(auth)/signup-select/page.tsx`
- Modify: `src/features/auth/components/SignupSelectContent.tsx`
- Modify: `src/app/(auth)/signup/page.tsx`
- Modify: `src/features/auth/components/SignupComponent.tsx`
- Modify: `src/app/(auth)/company-signup/step1/page.tsx`
- Modify: `src/features/auth/components/BusinessSignupComponent.tsx`

### signup-select/page.tsx — searchParams 추가

- [ ] `src/app/(auth)/signup-select/page.tsx` 수정

```tsx
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import SignupSelectContent from '@/features/auth/components/SignupSelectContent';

export const metadata: Metadata = createMetadata({
  title: '회원가입',
  description: '워크인코리아 회원가입 페이지입니다. 개인회원 또는 기업회원으로 가입하세요.',
});

export default async function SignupSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignupSelectContent callbackUrl={callbackUrl} />;
}
```

### SignupSelectContent.tsx — callbackUrl prop 수신 및 전달

- [ ] `src/features/auth/components/SignupSelectContent.tsx` 수정: `callbackUrl` prop 추가 및 href에 반영

```tsx
// 기존 export default function SignupSelectContent() { 를 아래로 교체
interface SignupSelectContentProps {
  callbackUrl?: string;
}

export default function SignupSelectContent({ callbackUrl }: SignupSelectContentProps) {
  const t = useTranslations('auth.signupSelect');

  const qs = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : '';

  const SIGNUP_OPTIONS = [
    {
      href: `/signup${qs}`,
      // ... 나머지 동일
    },
    {
      href: `/company-signup/step1${qs}`,
      // ... 나머지 동일
    },
  ] as const;
```

### signup/page.tsx — callbackUrl searchParam 추가

- [ ] `src/app/(auth)/signup/page.tsx` 수정

```tsx
interface SignupPageProps {
  searchParams: Promise<{
    user_email?: string;
    callbackUrl?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { user_email: userEmail, callbackUrl } = await searchParams;
  return <SignupComponent userEmail={userEmail} callbackUrl={callbackUrl} />;
}
```

### SignupComponent.tsx — callbackUrl prop 수신 + 리다이렉트에 반영

- [ ] `src/features/auth/components/SignupComponent.tsx` 수정: props 타입 및 onSubmit 리다이렉트 변경

```tsx
// 기존: export default function SignupComponent({ userEmail }: { userEmail?: string })
export default function SignupComponent({ userEmail, callbackUrl }: { userEmail?: string; callbackUrl?: string }) {
  // ...
  const onSubmit = async (data: SignupFormData) => {
    // ... 기존 try/catch 유지, router.push 부분만 변경
    await authApi.signup({ email, name, birth_date, country_code: country });
    toast.success(t('toastSuccess'));
    const loginRedirect = callbackUrl
      ? `/login?signup=success&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/login?signup=success';
    router.push(loginRedirect);
  };
```

### company-signup/step1/page.tsx — callbackUrl searchParam 추가

- [ ] `src/app/(auth)/company-signup/step1/page.tsx` 수정

```tsx
export default async function SignupStep1Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <BusinessSignupComponent callbackUrl={callbackUrl} />;
}
```

### BusinessSignupComponent.tsx — callbackUrl prop 수신

- [ ] `src/features/auth/components/BusinessSignupComponent.tsx` 수정: props 타입에 callbackUrl 추가

```tsx
// 기존 export default function BusinessSignupComponent() { 를 아래로 교체
export default function BusinessSignupComponent({ callbackUrl }: { callbackUrl?: string }) {
```

---

## Task 2: 개인 회원가입 후 성공 배너

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/features/auth/components/LoginContent.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

### login/page.tsx — signup searchParam 추가

- [ ] `src/app/(auth)/login/page.tsx` 수정

```tsx
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; signup?: string }>;
}) {
  const { callbackUrl, error, signup } = await searchParams;
  return <LoginContent callbackUrl={callbackUrl} error={error} signup={signup} />;
}
```

### LoginContent.tsx — signup 성공 배너 추가

- [ ] `src/features/auth/components/LoginContent.tsx` 수정: props 타입과 배너 렌더링

```tsx
interface LoginContentProps {
  callbackUrl?: string;
  error?: string;
  signup?: string; // 'success'일 때 성공 배너 표시
}

export default function LoginContent({ callbackUrl, error, signup }: LoginContentProps) {
  // ...기존 코드...

  // 에러 배너 바로 위 또는 바로 아래에 성공 배너 추가
  {signup === 'success' && (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-2.5 px-4 py-3 mb-6 rounded-lg bg-green-50 border border-green-200 text-caption-1 font-medium text-green-700"
      role="status"
    >
      <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
      <span>{t('signupSuccess')}</span>
    </motion.div>
  )}
```

### i18n 키 추가 (ko.json)

- [ ] `messages/ko.json`의 `auth.login` 블록에 추가

```json
"signupSuccess": "회원가입이 완료되었습니다! Google 계정으로 로그인해주세요.",
```

### i18n 키 추가 (en.json)

- [ ] `messages/en.json`의 `auth.login` 블록에 추가

```json
"signupSuccess": "Registration complete! Please sign in with your Google account.",
```

---

## Task 3: 기업 회원가입 후 자동 로그인

**Files:**
- Modify: `src/features/auth/components/BusinessSignupComponent.tsx`

### BusinessSignupComponent.tsx — useAuth 추가 및 자동 로그인 구현

- [ ] `src/features/auth/components/BusinessSignupComponent.tsx` 수정

imports에 추가:
```tsx
import { useAuth } from '@/features/auth/hooks/useAuth';
```

컴포넌트 내부 상단에 추가:
```tsx
const { login } = useAuth();
```

onSubmit 변경:
```tsx
const onSubmit = async (data: Step2Form) => {
  if (!requiredAgreed) { toast.error(t('toastRequiredTerms')); return; }
  try {
    await authApi.companySignup({
      company_number: data.businessNumber.replace(/[^0-9]/g, ''),
      company_name: data.company,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phoneNumber.replace(/[^0-9]/g, ''),
    });
    // 가입 직후 자동 로그인
    await authApi.companyLogin({ username: data.email, password: data.password });
    login('company');
    toast.success(t('toastSuccess'));
    router.push(callbackUrl || '/company');
  } catch (error: unknown) {
    logError(error, 'BusinessSignupComponent.onSubmit');
    const rawMessage = extractErrorMessage(error, '');
    const status = getErrorStatus(error);
    if (status === 400 && rawMessage.toLowerCase().includes('already exists')) {
      setError('email', { type: 'manual', message: t('errorEmailDuplicate') });
      toast.error(t('toastEmailDuplicate'));
    } else {
      toast.error(rawMessage || t('toastError'));
    }
  }
};
```

---

## Task 4: 진단 결과 CTA에 callbackUrl 전파

**Files:**
- Modify: `src/features/diagnosis/pages/DiagnosisResultClient.tsx`

### DiagnosisResultClient.tsx — usePathname 추가, handleSignup에 callbackUrl 전달

- [ ] `src/features/diagnosis/pages/DiagnosisResultClient.tsx` 수정

imports에 추가:
```tsx
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
```

handleSignup 수정:
```tsx
const pathname = usePathname();
const currentUrl = diagnosisId
  ? `${pathname}?id=${diagnosisId}`
  : pathname;

const handleSignup = () => {
  router.push(`/signup-select?callbackUrl=${encodeURIComponent(currentUrl)}`);
};

const handleLogin = () => {
  router.push(`/login-select?callbackUrl=${encodeURIComponent(currentUrl)}`);
};
```

CTA 버튼 영역에 로그인 버튼 추가 (비회원일 때):
```tsx
{!isAuthenticated && (
  <>
    <motion.button
      onClick={handleLogin}
      className="px-6 py-2.5 bg-white text-primary-600 font-semibold rounded-lg hover:bg-label-50 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-body-3 sm:text-body-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {t('loginButton')}
    </motion.button>
    <motion.button
      onClick={handleSignup}
      className="px-6 py-2.5 bg-white/20 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/30 transition-colors duration-150 border border-white/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-body-3 sm:text-body-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {t('signupButton')}
    </motion.button>
  </>
)}
```

i18n 추가 (`messages/ko.json` → `diagnosis.result`):
```json
"loginButton": "로그인하고 결과 저장"
```

i18n 추가 (`messages/en.json` → `diagnosis.result`):
```json
"loginButton": "Login to save results"
```

---

## Task 5: 뷰 전환 컨텍스트 유지

**Files:**
- Modify: `src/shared/components/layout/HeaderClient.tsx`

### HeaderClient.tsx — pathname 기반 스마트 뷰 전환

- [ ] `src/shared/components/layout/HeaderClient.tsx` 수정

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Header } from './Header';
import type { ViewType } from '@/shared/components/UserTypeToggle';

interface HeaderClientProps {
  type?: 'homepage' | 'business';
}

// 개인 뷰에서 접근 가능한 공개 경로 (뷰 전환 시 유지)
const PUBLIC_PATHS = ['/', '/jobs', '/diagnosis', '/self-diagnosis'];

export function HeaderClient({ type }: HeaderClientProps = {}) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const defaultView: ViewType = type
    ? type === 'business' ? 'company' : 'personal'
    : userType === 'company' ? 'company' : 'personal';

  const [viewType, setViewType] = useState<ViewType>(defaultView);

  useEffect(() => {
    if (!isLoading && !type) {
      setViewType(userType === 'company' ? 'company' : 'personal');
    }
  }, [isLoading, userType, type]);

  function handleViewTypeChange(next: ViewType) {
    setViewType(next);
    if (next === 'company') {
      // 기업 뷰로 전환: 항상 기업 대시보드/랜딩으로
      router.push('/company');
    } else {
      // 개인 뷰로 전환: 공개 페이지면 그 페이지 유지, 아니면 홈으로
      const isPublicPage = PUBLIC_PATHS.some(p =>
        p === '/' ? pathname === '/' : pathname.startsWith(p)
      );
      router.push(isPublicPage ? pathname : '/');
    }
  }

  return (
    <Header
      type={viewType === 'company' ? 'business' : 'homepage'}
      viewType={viewType}
      onViewTypeChange={handleViewTypeChange}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onLogout={logout}
    />
  );
}
```

---

## Task 6: OAuth 에러 메시지 세분화

**Files:**
- Modify: `src/features/auth/components/LoginContent.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

### LoginContent.tsx — OAUTH_ERROR_MESSAGES 확장

- [ ] `src/features/auth/components/LoginContent.tsx` 수정

```tsx
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: t('oauthFailed'),
  account_not_found: t('oauthAccountNotFound'),
  email_exists: t('oauthEmailExists'),
  suspended: t('oauthSuspended'),
  unknown: t('oauthUnknown'),
};
```

### i18n 키 추가 (ko.json)

- [ ] `messages/ko.json`의 `auth.login` 블록에 추가

```json
"oauthAccountNotFound": "등록되지 않은 계정입니다. 먼저 회원가입을 진행해주세요.",
"oauthEmailExists": "이미 다른 방식으로 가입된 이메일입니다.",
"oauthSuspended": "정지된 계정입니다. 고객센터에 문의해주세요.",
```

### i18n 키 추가 (en.json)

- [ ] `messages/en.json`의 `auth.login` 블록에 추가

```json
"oauthAccountNotFound": "Account not found. Please sign up first.",
"oauthEmailExists": "This email is already registered with a different method.",
"oauthSuspended": "This account has been suspended. Please contact support.",
```

---

## Task 7: 잘못된 권한 리다이렉트 시 토스트

**Files:**
- Modify: `middleware.ts`
- Modify: `src/features/profile/pages/MyProfileClient.tsx`
- Modify: `src/features/company/pages/CompanyProfileClient.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

### middleware.ts — userType 불일치 리다이렉트에 redirected=1 추가

- [ ] `middleware.ts` 수정: 잘못된 userType으로 접근 시 대시보드 URL에 `?redirected=1` 추가

```tsx
// User routes에서
if (userType !== 'user') {
  const url = new URL(getDashboardUrl(userType), request.url);
  url.searchParams.set('redirected', '1');
  return NextResponse.redirect(url);
}

// Company routes에서
if (userType !== 'company') {
  const url = new URL(getDashboardUrl(userType), request.url);
  url.searchParams.set('redirected', '1');
  return NextResponse.redirect(url);
}

// Admin routes에서
if (userType !== 'admin') {
  const url = new URL(getDashboardUrl(userType), request.url);
  url.searchParams.set('redirected', '1');
  return NextResponse.redirect(url);
}
```

### MyProfileClient.tsx — redirected 파라미터 감지 후 toast

- [ ] `src/features/profile/pages/MyProfileClient.tsx` 수정: useSearchParams 추가

imports에 추가:
```tsx
import { useSearchParams, useRouter } from 'next/navigation';
```

컴포넌트 내부 (기존 router/useQuery 선언 근처에 추가):
```tsx
const searchParams = useSearchParams();
const router = useRouter(); // 이미 있을 수 있음

useEffect(() => {
  if (searchParams.get('redirected') === '1') {
    toast.error('해당 페이지에 접근 권한이 없습니다.');
    // URL에서 파라미터 제거
    router.replace('/user/profile', { scroll: false });
  }
}, [searchParams, router]);
```

### CompanyProfileClient.tsx — redirected 파라미터 감지 후 toast

- [ ] `src/features/company/pages/CompanyProfileClient.tsx` 수정: 동일 패턴 적용

imports에 추가:
```tsx
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
```

컴포넌트 내부:
```tsx
const searchParams = useSearchParams();

useEffect(() => {
  if (searchParams.get('redirected') === '1') {
    toast.error('해당 페이지에 접근 권한이 없습니다.');
    router.replace('/company', { scroll: false });
  }
}, [searchParams, router]);
```

### i18n 키 (필요시 추가)
- toast 메시지는 하드코딩 또는 t() 사용 — 프로젝트 기존 패턴 따름
