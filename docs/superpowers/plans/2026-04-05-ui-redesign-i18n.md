# UI 리디자인 & i18n 전체 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 헤더 토글 UI를 Wanted 스타일(filled-active pill)로 리디자인하고, i18n 미적용 8개 컴포넌트에 `useTranslations`를 일괄 적용한다.

**Architecture:** 각 컴포넌트에서 하드코딩 문자열을 식별 → `messages/ko.json` + `messages/en.json`에 키 추가 → `useTranslations(namespace)` 주입 → `t('key')` 호출로 교체. UI 변경은 Tailwind 클래스 교체만으로 완료.

**Tech Stack:** Next.js 16, next-intl, Framer Motion, Tailwind CSS 4

---

## File Map

| 파일 | 변경 내용 |
|------|---------|
| `src/shared/components/UserTypeToggle.tsx` | 스타일 업데이트 (Approach A) |
| `src/shared/components/LanguageToggle.tsx` | 이모지 제거 + 스타일 업데이트 |
| `messages/ko.json` | 신규 키 추가 (Task 3~9) |
| `messages/en.json` | 신규 키 추가 (Task 3~9) |
| `src/features/auth/components/LoginContent.tsx` | i18n 적용 |
| `src/features/company/pages/CompanyLandingPage.tsx` | 가짜 섹션 제거 + i18n 적용 |
| `src/features/diagnosis/pages/DiagnosisClient.tsx` | i18n 적용 |
| `src/features/jobs/pages/CompanyPostCreateClient.tsx` | i18n 적용 |
| `src/features/jobs/pages/JobDetailActions.tsx` | i18n 적용 |
| `src/features/resume/components/TemplateSelector.tsx` | i18n 적용 |
| `src/features/resume/components/ResumeEditor.tsx` | i18n 적용 |
| `src/features/auth/components/BusinessSignupStep1.tsx` | i18n 적용 |

---

## Task 1: UserTypeToggle 스타일 업데이트

**Files:**
- Modify: `src/shared/components/UserTypeToggle.tsx`

- [ ] **Step 1: 컨테이너 + 버튼 스타일 교체**

`src/shared/components/UserTypeToggle.tsx` 전체를 아래로 교체:

```tsx
'use client';

import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export type ViewType = 'personal' | 'company';

interface UserTypeToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
  className?: string;
}

const OPTIONS = [
  { value: 'personal' as ViewType, label: '개인', Icon: User },
  { value: 'company' as ViewType, label: '기업', Icon: Building2 },
];

export function UserTypeToggle({ value, onChange, className }: UserTypeToggleProps) {
  return (
    <div
      className={cn(
        'relative flex items-center border border-slate-200 rounded-full bg-white p-0.5 gap-0.5',
        className
      )}
    >
      {OPTIONS.map(({ value: optValue, label, Icon }) => {
        const isActive = value === optValue;
        return (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            className={cn(
              'relative flex items-center gap-1 px-2.5 py-1 rounded-full text-caption-2 font-semibold transition-colors duration-200 cursor-pointer select-none z-10',
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'
            )}
            aria-label={`${label} 모드로 전환`}
          >
            {isActive && (
              <motion.span
                layoutId="user-type-bg"
                className="absolute inset-0 bg-blue-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={12} className="relative z-10 shrink-0" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 3: commit**

```bash
git add src/shared/components/UserTypeToggle.tsx
git commit -m "feat(ui): UserTypeToggle Approach A 스타일 적용 (filled blue active)"
```

---

## Task 2: LanguageToggle 스타일 업데이트 + 이모지 제거

**Files:**
- Modify: `src/shared/components/LanguageToggle.tsx`

- [ ] **Step 1: 이모지 제거 + Approach A 스타일 적용**

`src/shared/components/LanguageToggle.tsx` 전체를 아래로 교체:

```tsx
'use client';

import { cn } from '@/shared/lib/utils/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

interface LanguageToggleProps {
  className?: string;
  /** light: 흰 배경 헤더용 (기본), dark: 다크 네이비 헤더용 */
  variant?: 'light' | 'dark';
}

export function LanguageToggle({ className, variant = 'light' }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (lang: 'ko' | 'en') => {
    if (lang === locale || isPending) return;
    document.cookie = `locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => { router.refresh(); });
  };

  const containerCls = variant === 'dark'
    ? 'border-slate-600 bg-transparent'
    : 'border-slate-200 bg-white';

  const activeCls = 'bg-blue-600 text-white';

  const inactiveCls = variant === 'dark'
    ? 'text-slate-400 hover:text-slate-200'
    : 'text-slate-500 hover:text-slate-700';

  return (
    <div className={cn('flex items-center rounded-full border p-0.5 gap-0.5 overflow-hidden', containerCls, className)}>
      {(['ko', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          disabled={isPending}
          aria-label={lang === 'ko' ? '한국어로 변경' : 'Switch to English'}
          className={cn(
            'px-2.5 py-1 rounded-full text-caption-2 font-semibold transition-colors cursor-pointer select-none uppercase',
            locale === lang ? activeCls : inactiveCls,
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 3: commit**

```bash
git add src/shared/components/LanguageToggle.tsx
git commit -m "feat(ui): LanguageToggle 이모지 제거 + Approach A 스타일 적용"
```

---

## Task 3: LoginContent i18n 적용

**Files:**
- Modify: `src/features/auth/components/LoginContent.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json `auth.login`에 누락 키 추가**

`messages/ko.json`의 `"auth"` → `"login"` 객체 끝에 아래 키들을 추가:

```json
"leftBadge": "개인 구직 파트너",
"leftTitle": "한국 취업,\n지금 바로 시작하세요",
"leftFeature1": "맞춤형 채용 공고 추천",
"leftFeature2": "이력서 관리 및 자동 저장",
"leftFeature3": "자가진단 및 커리어 상담",
"oauthFailed": "Google 로그인에 실패했습니다. 다시 시도해주세요.",
"oauthUnknown": "인증 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
"googleStart": "Google로 시작하기",
"loggingInGoogle": "로그인 중...",
"companyLoginBtn": "기업 로그인",
"divider": "또는",
"noAccountYet": "아직 회원이 아니신가요?",
"termsAgreement": "로그인함으로써 이용약관 및 개인정보처리방침에 동의합니다."
```

- [ ] **Step 2: en.json `auth.login`에 동일 키 영어로 추가**

`messages/en.json`의 `"auth"` → `"login"` 객체 끝에 추가:

```json
"leftBadge": "Personal Job Partner",
"leftTitle": "Start Your Korea\nJob Journey Now",
"leftFeature1": "Personalized job recommendations",
"leftFeature2": "Resume management & auto-save",
"leftFeature3": "Self-assessment & career counseling",
"oauthFailed": "Google sign-in failed. Please try again.",
"oauthUnknown": "An error occurred during authentication. Please try again.",
"googleStart": "Continue with Google",
"loggingInGoogle": "Signing in...",
"companyLoginBtn": "Company Login",
"divider": "or",
"noAccountYet": "Don't have an account yet?",
"termsAgreement": "By logging in, you agree to our Terms of Service and Privacy Policy."
```

- [ ] **Step 3: LoginContent.tsx에 useTranslations 적용**

파일 상단에 import 추가 후 하드코딩 문자열을 `t()` 호출로 교체:

```tsx
// 상단 import에 추가
import { useTranslations } from 'next-intl';

// features 배열과 OAUTH_ERROR_MESSAGES를 컴포넌트 내부로 이동
export default function LoginContent({ callbackUrl, error }: LoginContentProps) {
  const t = useTranslations('auth.login');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const features = [
    t('leftFeature1'),
    t('leftFeature2'),
    t('leftFeature3'),
  ];

  const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: t('oauthFailed'),
    unknown: t('oauthUnknown'),
  };

  const errorMessage = error ? (OAUTH_ERROR_MESSAGES[error] ?? OAUTH_ERROR_MESSAGES.unknown) : null;
  // ... 나머지 로직 유지
```

JSX 내 교체:
- `'개인 구직 파트너'` → `{t('leftBadge')}`
- `'한국 취업,\n지금 바로 시작하세요'` → 두 줄로 유지: `{t('leftTitle').split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}`
- `'개인 로그인'` → `{t('title')}` (기존 키)
- `'Google 계정으로 간편하게 시작하세요'` → `{t('subtitle')}` (기존 키)
- `isGoogleLoading ? '로그인 중...' : 'Google로 시작하기'` → `isGoogleLoading ? t('loggingInGoogle') : t('googleStart')`
- `'또는'` → `{t('divider')}`
- `'기업 로그인'` → `{t('companyLoginBtn')}`
- `'아직 회원이 아니신가요?'` → `{t('noAccountYet')}`
- `'회원가입'` → `{t('signupLink')}` (기존 키)
- `'로그인함으로써 이용약관 및 개인정보처리방침에 동의합니다.'` → `{t('termsAgreement')}`

파일 최상단의 `const features = [...]`와 `const OAUTH_ERROR_MESSAGES = {...}` 상수 블록은 삭제한다 (컴포넌트 내부로 이동).

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: commit**

```bash
git add src/features/auth/components/LoginContent.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): LoginContent useTranslations 적용"
```

---

## Task 4: CompanyLandingPage 가짜 섹션 제거 + i18n 적용

**Files:**
- Modify: `src/features/company/pages/CompanyLandingPage.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json에 `company.landing` 네임스페이스 추가**

`messages/ko.json`의 `"company"` 객체 안에 `"landing"` 키 추가:

```json
"landing": {
  "promoBadge": "WorkInKorea Hiring",
  "promoTitle": "외국인 채용, 더 쉽게 시작하세요",
  "promoSubtitle": "검증된 외국인 인재와 기업을 연결하는 글로벌 채용 플랫폼",
  "serviceHeaderTitle": "우리 회사에 딱 맞는 방식으로 채용을 시작해보세요!",
  "serviceHeaderSubtitle": "직접 등록부터 전담 매니저 케어까지, 필요한 방식을 선택하세요",
  "service1Title": "직접 공고 등록",
  "service1Desc": "우리 회사 공고를 직접 등록할 수 있어요. 간단한 정보를 입력하고 채용을 시작하세요.",
  "service1Highlight": "직접 등록",
  "service2Title": "채용 전담 매니저",
  "service2Desc": "공고 등록부터 FIT한 합격자까지! 전담 매니저의 밀착 케어를 받아보세요.",
  "service2Highlight": "전담 매니저의 밀착 케어",
  "service3Title": "인재 검색",
  "service3Desc": "기다리지 말고 인재를 직접 검색해보세요. 조건에 맞는 추천 인재도 확인할 수 있어요!",
  "service3Highlight": "인재를 직접 검색",
  "step1Title": "기업 회원가입",
  "step1Desc": "간단한 정보 입력으로 30초 만에 가입 완료",
  "step2Title": "채용 공고 작성",
  "step2Desc": "직무·급여·복지 정보를 상세하게 등록하세요",
  "step3Title": "지원자 관리",
  "step3Desc": "지원서를 검토하고 단계별로 관리하세요",
  "step4Title": "채용 완료",
  "step4Desc": "최적의 인재와 함께 성장하세요",
  "stepsTitle": "간단한 4단계로 채용을 완료하세요",
  "sidebarWelcome": "환영합니다.",
  "sidebarLoginHint": "로그인 후 이용하세요.",
  "login": "로그인",
  "signup": "회원가입",
  "quickMenuTitle": "채용 시작하기",
  "quickMenu1": "채용 공고 등록",
  "quickMenu2": "인재 검색하기",
  "quickMenu3": "기업 회원가입",
  "benefit1": "채용 공고 1건 무료 등록",
  "benefit2": "외국인 인재 DB 무료 열람",
  "benefit3": "전담 매니저 1:1 상담",
  "benefitTitle": "지금 가입하면",
  "benefitCta": "무료로 시작하기",
  "jobSeekerBannerTitle": "구직자이신가요?",
  "jobSeekerBannerDesc": "한국 취업을 원하는 외국인 구직자라면 개인 페이지를 이용하세요",
  "jobSeekerBannerCta": "개인 페이지 →"
}
```

- [ ] **Step 2: en.json에 `company.landing` 추가**

`messages/en.json`의 `"company"` 객체 안에 추가:

```json
"landing": {
  "promoBadge": "WorkInKorea Hiring",
  "promoTitle": "Foreign Talent Hiring, Made Simple",
  "promoSubtitle": "A global recruitment platform connecting verified foreign talent with Korean companies",
  "serviceHeaderTitle": "Start hiring the way that fits your company best!",
  "serviceHeaderSubtitle": "From direct posting to dedicated manager care — choose your way",
  "service1Title": "Post Directly",
  "service1Desc": "Post your company's jobs directly. Enter basic info and start recruiting.",
  "service1Highlight": "Post Directly",
  "service2Title": "Dedicated Recruiting Manager",
  "service2Desc": "From posting to the perfect hire! Get dedicated manager support.",
  "service2Highlight": "dedicated manager support",
  "service3Title": "Talent Search",
  "service3Desc": "Don't wait — search for talent yourself. Find recommended candidates that fit your criteria!",
  "service3Highlight": "search for talent yourself",
  "step1Title": "Company Sign Up",
  "step1Desc": "Register in 30 seconds with basic info",
  "step2Title": "Write Job Posting",
  "step2Desc": "Add detailed job, salary, and benefits info",
  "step3Title": "Manage Applicants",
  "step3Desc": "Review applications and manage by stage",
  "step4Title": "Hiring Complete",
  "step4Desc": "Grow with the right talent",
  "stepsTitle": "Complete hiring in 4 simple steps",
  "sidebarWelcome": "Welcome.",
  "sidebarLoginHint": "Please log in to continue.",
  "login": "Log In",
  "signup": "Sign Up",
  "quickMenuTitle": "Start Recruiting",
  "quickMenu1": "Post a Job",
  "quickMenu2": "Search Talent",
  "quickMenu3": "Company Sign Up",
  "benefit1": "1 free job posting",
  "benefit2": "Free access to foreign talent DB",
  "benefit3": "1:1 dedicated manager consultation",
  "benefitTitle": "Sign up now and get",
  "benefitCta": "Start for Free",
  "jobSeekerBannerTitle": "Are you a job seeker?",
  "jobSeekerBannerDesc": "If you're a foreign job seeker looking to work in Korea, use the personal page",
  "jobSeekerBannerCta": "Personal Page →"
}
```

- [ ] **Step 3: CompanyLandingPage.tsx — 가짜 섹션 제거 + i18n 적용**

파일을 아래로 교체 (stats/고객센터 섹션 제거, useTranslations 적용, 불필요 import 제거):

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Search,
  ChevronRight,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export function CompanyLandingPage() {
  const t = useTranslations('company.landing');

  const services = [
    {
      key: 'post',
      bg: 'bg-primary-50', border: 'border-blue-100',
      iconBg: 'bg-primary-100', iconColor: 'text-primary-500',
      icon: <FileText size={28} />,
      title: t('service1Title'),
      href: '/company-login',
    },
    {
      key: 'manager',
      bg: 'bg-teal-50', border: 'border-teal-100',
      iconBg: 'bg-teal-100', iconColor: 'text-teal-500',
      icon: <Users size={28} />,
      title: t('service2Title'),
      href: '/company-login',
    },
    {
      key: 'search',
      bg: 'bg-violet-50', border: 'border-violet-100',
      iconBg: 'bg-violet-100', iconColor: 'text-violet-500',
      icon: <Search size={28} />,
      title: t('service3Title'),
      href: '/company-login',
    },
  ];

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', title: t('step4Title'), desc: t('step4Desc') },
  ];

  const quickMenuItems = [
    { label: t('quickMenu1'), href: '/company-login', icon: <FileText size={14} className="text-primary-500" /> },
    { label: t('quickMenu2'), href: '/company-login', icon: <Search  size={14} className="text-teal-500" /> },
    { label: t('quickMenu3'), href: '/company-signup', icon: <CheckCircle2 size={14} className="text-violet-500" /> },
  ];

  return (
    <div className="min-h-screen bg-label-100">
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">

          {/* ── 좌측 메인 ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* 프로모 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-[#1B2C4A] to-[#243658] rounded-xl p-5 flex items-center justify-between overflow-hidden relative"
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute bottom-0 right-20 w-16 h-16 rounded-full bg-primary-500/10" />
              <div className="relative">
                <p className="text-caption-3 font-semibold text-blue-300 uppercase tracking-widest mb-1">
                  {t('promoBadge')}
                </p>
                <p className="text-body-2 font-extrabold text-white mb-0.5">
                  {t('promoTitle')}
                </p>
                <p className="text-caption-2 text-label-400">
                  {t('promoSubtitle')}
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl border border-white/20">
                <Building2 size={24} className="text-blue-300" />
              </div>
            </motion.div>

            {/* 서비스 선택 헤더 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-body-2 font-extrabold text-label-900 mb-0.5">
                {t('serviceHeaderTitle')}
              </h2>
              <p className="text-caption-1 text-label-400">
                {t('serviceHeaderSubtitle')}
              </p>
            </motion.div>

            {/* 서비스 카드 3개 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {services.map((svc, i) => (
                <motion.div key={svc.key} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <Link
                    href={svc.href}
                    className={cn(
                      'flex flex-col justify-between h-full',
                      'rounded-xl border p-5 min-h-[120px] group',
                      'hover:shadow-md transition-all duration-200 cursor-pointer',
                      svc.bg, svc.border,
                    )}
                  >
                    <p className="text-caption-1 font-extrabold text-label-800 mb-2">
                      {svc.title}
                    </p>
                    <div className="flex justify-end mt-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        svc.iconBg, svc.iconColor,
                        'group-hover:scale-110 transition-transform',
                      )}>
                        {svc.icon}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 채용 프로세스 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-line-400 rounded-xl p-5"
            >
              <p className="text-caption-1 font-bold text-label-900 mb-4">
                {t('stepsTitle')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {steps.map((step, i) => (
                  <div key={i} className="relative">
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-label-100 -translate-y-1/2 z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mb-2">
                        <span className="text-caption-3 font-black text-white">{step.num}</span>
                      </div>
                      <p className="text-caption-2 font-bold text-label-800 mb-0.5">{step.title}</p>
                      <p className="text-caption-3 text-label-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── 우측 사이드바 ──────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* 로그인/회원가입 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-line-400 rounded-xl p-5"
            >
              <p className="text-body-3 font-extrabold text-label-900 mb-0.5">{t('sidebarWelcome')}</p>
              <p className="text-caption-2 text-label-400 mb-4">{t('sidebarLoginHint')}</p>
              <div className="flex gap-2">
                <Link
                  href="/company-login"
                  className={cn(
                    'flex-1 py-2.5 bg-primary-600 text-white text-caption-1 font-semibold rounded-lg text-center',
                    'hover:bg-primary-700 transition-colors cursor-pointer',
                  )}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/company-signup"
                  className={cn(
                    'flex-1 py-2.5 border border-line-400 text-label-600 text-caption-1 font-semibold rounded-lg text-center',
                    'hover:bg-label-50 transition-colors cursor-pointer',
                  )}
                >
                  {t('signup')}
                </Link>
              </div>
            </motion.div>

            {/* 빠른 메뉴 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white border border-line-400 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-line-200">
                <p className="text-caption-1 font-bold text-label-900">{t('quickMenuTitle')}</p>
              </div>
              {quickMenuItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-label-50 transition-colors border-b border-line-200 last:border-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-caption-2 font-medium text-label-700">
                    {item.icon}
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="text-label-300 group-hover:text-primary-400 transition-colors" />
                </Link>
              ))}
            </motion.div>

            {/* 혜택 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-primary-50 border border-blue-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-primary-500" />
                <p className="text-caption-1 font-bold text-label-800">{t('benefitTitle')}</p>
              </div>
              <ul className="space-y-1.5">
                {[t('benefit1'), t('benefit2'), t('benefit3')].map(benefit => (
                  <li key={benefit} className="flex items-center gap-2 text-caption-2 text-label-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/company-signup"
                className={cn(
                  'mt-4 flex items-center justify-center gap-1.5 w-full py-2',
                  'bg-primary-600 text-white text-caption-2 font-semibold rounded-lg',
                  'hover:bg-primary-700 transition-colors cursor-pointer',
                )}
              >
                {t('benefitCta')}
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── 하단 개인회원 유도 배너 ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-white border border-line-400 rounded-xl px-6 py-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-caption-1 font-bold text-label-900 mb-0.5">{t('jobSeekerBannerTitle')}</p>
            <p className="text-caption-2 text-label-400">{t('jobSeekerBannerDesc')}</p>
          </div>
          <Link
            href="/"
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-4 py-2',
              'border border-line-400 rounded-lg text-caption-2 font-semibold text-label-600',
              'hover:bg-label-50 transition-colors cursor-pointer whitespace-nowrap',
            )}
          >
            {t('jobSeekerBannerCta')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: commit**

```bash
git add src/features/company/pages/CompanyLandingPage.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): CompanyLandingPage 가짜 섹션 제거 + useTranslations 적용"
```

---

## Task 5: DiagnosisClient i18n 적용

**Files:**
- Modify: `src/features/diagnosis/pages/DiagnosisClient.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json에 `diagnosis.client` 추가**

`messages/ko.json`의 `"diagnosis"` 객체 안에 추가 (없으면 최상위에 `"diagnosis": {}` 생성):

```json
"client": {
  "title": "한국 취업 자가진단",
  "subtitle": "당신에게 딱 맞는 직업을 찾기 위한 맞춤형 진단을 시작해보세요",
  "submitError": "진단 결과 제출에 실패했습니다. 다시 시도해주세요."
}
```

- [ ] **Step 2: en.json에 `diagnosis.client` 추가**

```json
"client": {
  "title": "Korea Job Self-Assessment",
  "subtitle": "Start a personalized assessment to find the right career for you",
  "submitError": "Failed to submit assessment results. Please try again."
}
```

- [ ] **Step 3: DiagnosisClient.tsx에 useTranslations 적용**

파일 상단에 추가:
```tsx
import { useTranslations } from 'next-intl';
```

`DiagnosisClient` 컴포넌트 내부 첫 줄에 추가:
```tsx
const t = useTranslations('diagnosis.client');
```

교체:
- `'진단 결과 제출에 실패했습니다. 다시 시도해주세요.'` → `t('submitError')`
- `'한국 취업 자가진단'` → `{t('title')}`
- `'당신에게 딱 맞는 직업을 찾기 위한 맞춤형 진단을 시작해보세요'` → `{t('subtitle')}`

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: commit**

```bash
git add src/features/diagnosis/pages/DiagnosisClient.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): DiagnosisClient useTranslations 적용"
```

---

## Task 6: CompanyPostCreateClient + JobDetailActions i18n 적용

**Files:**
- Modify: `src/features/jobs/pages/CompanyPostCreateClient.tsx`
- Modify: `src/features/jobs/pages/JobDetailActions.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json에 `jobs.postCreate` 추가**

`messages/ko.json`의 `"jobs"` 객체 안에 추가:

```json
"postCreate": {
  "successToast": "공고가 성공적으로 등록되었습니다!",
  "errorToast": "공고 등록에 실패했습니다. 다시 시도해주세요."
}
```

- [ ] **Step 2: en.json에 `jobs.postCreate` 추가**

```json
"postCreate": {
  "successToast": "Job posting created successfully!",
  "errorToast": "Failed to create job posting. Please try again."
}
```

- [ ] **Step 3: CompanyPostCreateClient.tsx에 useTranslations 적용**

상단에 추가:
```tsx
import { useTranslations } from 'next-intl';
```

컴포넌트 내부 첫 줄에 추가:
```tsx
const t = useTranslations('jobs.postCreate');
```

교체:
- `toast.success('공고가 성공적으로 등록되었습니다!')` → `toast.success(t('successToast'))`
- `const message = extractErrorMessage(error, '공고 등록에 실패했습니다. 다시 시도해주세요.')` → `const message = extractErrorMessage(error, t('errorToast'))`

- [ ] **Step 4: JobDetailActions.tsx에 useTranslations 적용**

`src/features/jobs/pages/JobDetailActions.tsx`를 아래로 교체 (`jobs.detail.backToList` 키는 이미 ko.json에 존재):

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function JobDetailActions() {
  const router = useRouter();
  const t = useTranslations('jobs.detail');

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-label-600 hover:text-label-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>{t('backToList')}</span>
      </button>
    </>
  );
}
```

- [ ] **Step 5: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 6: commit**

```bash
git add src/features/jobs/pages/CompanyPostCreateClient.tsx src/features/jobs/pages/JobDetailActions.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): CompanyPostCreateClient + JobDetailActions useTranslations 적용"
```

---

## Task 7: TemplateSelector i18n 적용

**Files:**
- Modify: `src/features/resume/components/TemplateSelector.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json에 `resume.template` 추가**

`messages/ko.json` 최상위에 `"resume"` 키 추가:

```json
"resume": {
  "template": {
    "title": "이력서 템플릿 선택",
    "subtitle": "나에게 맞는 템플릿을 선택해서 이력서를 작성해보세요",
    "featuresLabel": "주요 특징",
    "nextBtn": "다음 단계로",
    "changeHint": "템플릿은 나중에 변경할 수 있습니다",
    "modernName": "모던",
    "modernDesc": "깔끔하고 현대적인 디자인으로 IT 업계에 적합",
    "modernF1": "심플한 레이아웃",
    "modernF2": "아이콘 활용",
    "modernF3": "컬러 포인트",
    "classicName": "클래식",
    "classicDesc": "전통적이고 신뢰감 있는 스타일로 모든 업계에 적합",
    "classicF1": "정형화된 구조",
    "classicF2": "읽기 쉬운 폰트",
    "classicF3": "안정적인 인상",
    "creativeName": "크리에이티브",
    "creativeDesc": "창의적이고 독특한 레이아웃으로 디자인 분야에 적합",
    "creativeF1": "독창적인 디자인",
    "creativeF2": "시각적 효과",
    "creativeF3": "개성 표현",
    "minimalName": "미니멀",
    "minimalDesc": "간단하고 깔끔한 구성으로 핵심 정보에 집중",
    "minimalF1": "여백 활용",
    "minimalF2": "핵심 정보 강조",
    "minimalF3": "깔끔한 인상",
    "professionalName": "프로페셔널",
    "professionalDesc": "비즈니스 환경에 최적화된 공식적인 스타일",
    "professionalF1": "공식적인 형식",
    "professionalF2": "비즈니스 적합",
    "professionalF3": "전문성 강조"
  }
}
```

- [ ] **Step 2: en.json에 `resume.template` 추가**

```json
"resume": {
  "template": {
    "title": "Choose Resume Template",
    "subtitle": "Select a template that fits you and start writing your resume",
    "featuresLabel": "Key Features",
    "nextBtn": "Next Step",
    "changeHint": "You can change the template later",
    "modernName": "Modern",
    "modernDesc": "Clean and contemporary design, ideal for IT industry",
    "modernF1": "Simple layout",
    "modernF2": "Icon usage",
    "modernF3": "Color accents",
    "classicName": "Classic",
    "classicDesc": "Traditional and trustworthy style, suitable for all industries",
    "classicF1": "Structured format",
    "classicF2": "Easy-to-read font",
    "classicF3": "Stable impression",
    "creativeName": "Creative",
    "creativeDesc": "Creative and unique layout, ideal for design fields",
    "creativeF1": "Unique design",
    "creativeF2": "Visual effects",
    "creativeF3": "Personal expression",
    "minimalName": "Minimal",
    "minimalDesc": "Simple and clean layout focused on key information",
    "minimalF1": "Use of white space",
    "minimalF2": "Key info highlighted",
    "minimalF3": "Clean impression",
    "professionalName": "Professional",
    "professionalDesc": "Formal style optimized for business environments",
    "professionalF1": "Formal format",
    "professionalF2": "Business-appropriate",
    "professionalF3": "Professional emphasis"
  }
}
```

- [ ] **Step 3: TemplateSelector.tsx에 useTranslations 적용**

파일 상단에 추가:
```tsx
import { useTranslations } from 'next-intl';
```

`TemplateSelector` 컴포넌트 내부 첫 줄에 추가:
```tsx
const t = useTranslations('resume.template');
```

`templates` 배열을 `t()` 호출로 교체:
```tsx
const templates = [
  {
    type: 'modern' as ResumeTemplate,
    name: t('modernName'),
    description: t('modernDesc'),
    preview: '📝',
    color: 'bg-primary-50 border-primary-200 text-primary-700',
    features: [t('modernF1'), t('modernF2'), t('modernF3')],
  },
  {
    type: 'classic' as ResumeTemplate,
    name: t('classicName'),
    description: t('classicDesc'),
    preview: '📄',
    color: 'bg-label-50 border-line-400 text-label-700',
    features: [t('classicF1'), t('classicF2'), t('classicF3')],
  },
  {
    type: 'creative' as ResumeTemplate,
    name: t('creativeName'),
    description: t('creativeDesc'),
    preview: '🎨',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    features: [t('creativeF1'), t('creativeF2'), t('creativeF3')],
  },
  {
    type: 'minimal' as ResumeTemplate,
    name: t('minimalName'),
    description: t('minimalDesc'),
    preview: '📋',
    color: 'bg-green-50 border-green-200 text-green-700',
    features: [t('minimalF1'), t('minimalF2'), t('minimalF3')],
  },
  {
    type: 'professional' as ResumeTemplate,
    name: t('professionalName'),
    description: t('professionalDesc'),
    preview: '💼',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    features: [t('professionalF1'), t('professionalF2'), t('professionalF3')],
  },
];
```

JSX 내 교체:
- `'이력서 템플릿 선택'` → `{t('title')}`
- `'나에게 맞는 템플릿을 선택해서 이력서를 작성해보세요'` → `{t('subtitle')}`
- `'주요 특징'` → `{t('featuresLabel')}`
- `'다음 단계로'` → `{t('nextBtn')}`
- `'템플릿은 나중에 변경할 수 있습니다'` → `{t('changeHint')}`

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: commit**

```bash
git add src/features/resume/components/TemplateSelector.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): TemplateSelector useTranslations 적용"
```

---

## Task 8: ResumeEditor i18n 적용

**Files:**
- Modify: `src/features/resume/components/ResumeEditor.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json에 `resume.editor` 추가**

`messages/ko.json`의 `"resume"` 객체 안에 `"editor"` 추가:

```json
"editor": {
  "titleCreate": "새 이력서 작성",
  "titleEdit": "이력서 편집",
  "templateHint": "{template} 템플릿으로 이력서를 작성하고 있습니다",
  "createSuccess": "이력서가 생성되었습니다.",
  "createError": "이력서 생성에 실패했습니다.",
  "updateSuccess": "이력서가 수정되었습니다.",
  "updateError": "이력서 수정에 실패했습니다.",
  "imageTypeError": "이미지 파일만 업로드할 수 있습니다.",
  "imageSizeError": "이미지 크기는 5MB 이하여야 합니다.",
  "imageSuccess": "이미지가 업로드되었습니다.",
  "imageError": "이미지 업로드에 실패했습니다.",
  "introTitle": "자기소개"
}
```

- [ ] **Step 2: en.json에 `resume.editor` 추가**

`messages/en.json`의 `"resume"` 객체 안에 추가:

```json
"editor": {
  "titleCreate": "Create New Resume",
  "titleEdit": "Edit Resume",
  "templateHint": "Writing resume with {template} template",
  "createSuccess": "Resume created successfully.",
  "createError": "Failed to create resume.",
  "updateSuccess": "Resume updated successfully.",
  "updateError": "Failed to update resume.",
  "imageTypeError": "Only image files can be uploaded.",
  "imageSizeError": "Image size must be 5MB or less.",
  "imageSuccess": "Image uploaded successfully.",
  "imageError": "Failed to upload image.",
  "introTitle": "Introduction"
}
```

- [ ] **Step 3: ResumeEditor.tsx에 useTranslations 적용**

파일 상단에 추가:
```tsx
import { useTranslations } from 'next-intl';
```

`ResumeEditor` 컴포넌트 내부 첫 줄에 추가:
```tsx
const t = useTranslations('resume.editor');
```

toast 메시지 교체:
- `toast.success('이력서가 생성되었습니다.')` → `toast.success(t('createSuccess'))`
- `toast.error('이력서 생성에 실패했습니다.')` → `toast.error(t('createError'))`
- `toast.success('이력서가 수정되었습니다.')` → `toast.success(t('updateSuccess'))`
- `toast.error('이력서 수정에 실패했습니다.')` → `toast.error(t('updateError'))`
- `toast.error('이미지 파일만 업로드할 수 있습니다.')` → `toast.error(t('imageTypeError'))`
- `toast.error('이미지 크기는 5MB 이하여야 합니다.')` → `toast.error(t('imageSizeError'))`
- `toast.success('이미지가 업로드되었습니다.')` → `toast.success(t('imageSuccess'))`
- `toast.error('이미지 업로드에 실패했습니다.')` → `toast.error(t('imageError'))`

JSX 내 교체:
- `isEditMode ? '이력서 편집' : '새 이력서 작성'` → `isEditMode ? t('titleEdit') : t('titleCreate')`
- `{templateType} 템플릿으로 이력서를 작성하고 있습니다` → `{t('templateHint', { template: templateType })}`
- `defaultValues.introduction` 배열의 `title: '자기소개'` → `title: t('introTitle')` (단, `useForm` 의 `defaultValues` 안에서는 훅 호출 후로 이동 필요)

`defaultValues` 내 `introduction` 초기값:
```tsx
introduction: initialData?.content?.objective ? [{
  title: t('introTitle'),
  content: initialData.content.objective
}] : [{ title: t('introTitle'), content: '' }],
```

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: commit**

```bash
git add src/features/resume/components/ResumeEditor.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): ResumeEditor useTranslations 적용"
```

---

## Task 9: BusinessSignupStep1 i18n 적용

**Files:**
- Modify: `src/features/auth/components/BusinessSignupStep1.tsx`
- Modify: `messages/ko.json`
- Modify: `messages/en.json`

- [ ] **Step 1: ko.json `auth.companySignup`에 누락 키 추가**

`messages/ko.json`의 `"auth"` → `"companySignup"` 객체 끝에 추가 (기존 키 중복 추가 금지):

```json
"step1Title": "회원가입 정보동의",
"agreeAllLabel": "전체 동의",
"terms1Label": "서비스 이용약관 동의 (필수)",
"terms1View": "서비스 이용약관 보기",
"terms1Key": "서비스 이용약관",
"terms2Label": "개인(신용)정보 수집 및 이용동의 (필수)",
"terms2View": "개인정보 수집 및 이용 보기",
"terms2Key": "개인정보 수집 및 이용",
"terms3Label": "개인(신용)정보 제공 및 위탁동의 (필수)",
"terms3View": "개인정보 제공 및 위탁 보기",
"terms3Key": "개인정보 제공 및 위탁",
"terms4Label": "개인(신용)정보 조회 동의 (필수)",
"terms4View": "개인정보 조회 보기",
"terms4Key": "개인정보 조회",
"terms5Label": "마케팅 활용 및 광고성 정보 수신동의",
"nextBtn": "다음"
```

> 참고: `"termsRequired": "필수 약관에 모두 동의해주세요"` 키는 이미 존재함.

- [ ] **Step 2: en.json `auth.companySignup`에 동일 키 추가**

```json
"step1Title": "Terms & Consent",
"agreeAllLabel": "Agree to All",
"terms1Label": "Terms of Service Agreement (Required)",
"terms1View": "View Terms of Service",
"terms1Key": "Terms of Service",
"terms2Label": "Personal Information Collection & Use Consent (Required)",
"terms2View": "View Privacy Policy",
"terms2Key": "Privacy Policy",
"terms3Label": "Personal Information Provision & Delegation Consent (Required)",
"terms3View": "View Personal Info Provision",
"terms3Key": "Personal Info Provision",
"terms4Label": "Personal Information Inquiry Consent (Required)",
"terms4View": "View Personal Info Inquiry",
"terms4Key": "Personal Info Inquiry",
"terms5Label": "Marketing & Advertising Information Consent",
"nextBtn": "Next"
```

- [ ] **Step 3: BusinessSignupStep1.tsx에 useTranslations 적용**

파일 상단에 추가:
```tsx
import { useTranslations } from 'next-intl';
```

컴포넌트 내부 첫 줄에 추가:
```tsx
const t = useTranslations('auth.companySignup');
```

교체:
- `toast.error('필수 약관에 모두 동의해주세요.')` → `toast.error(t('termsRequired'))`
- `'회원가입 정보동의'` (h1 내부) → `{t('step1Title')}`
- `label="전체 동의"` → `label={t('agreeAllLabel')}`
- `label="서비스 이용약관 동의 (필수)"` → `label={t('terms1Label')}`
- `label="서비스 이용약관 보기"` (IconButton aria) → `label={t('terms1View')}`
- `handleViewTerms('서비스 이용약관')` → `handleViewTerms(t('terms1Key'))`
- `label="개인(신용)정보 수집 및 이용동의 (필수)"` → `label={t('terms2Label')}`
- `label="개인정보 수집 및 이용 보기"` → `label={t('terms2View')}`
- `handleViewTerms('개인정보 수집 및 이용')` → `handleViewTerms(t('terms2Key'))`
- `label="개인(신용)정보 제공 및 위탁동의 (필수)"` → `label={t('terms3Label')}`
- `label="개인정보 제공 및 위탁 보기"` → `label={t('terms3View')}`
- `handleViewTerms('개인정보 제공 및 위탁')` → `handleViewTerms(t('terms3Key'))`
- `label="개인(신용)정보 조회 동의 (필수)"` → `label={t('terms4Label')}`
- `label="개인정보 조회 보기"` → `label={t('terms4View')}`
- `handleViewTerms('개인정보 조회')` → `handleViewTerms(t('terms4Key'))`
- `label="마케팅 활용 및 광고성 정보 수신동의"` → `label={t('terms5Label')}`
- `'다음'` (Button 내부) → `{t('nextBtn')}`

- [ ] **Step 4: typecheck 실행**

```bash
npm run typecheck
```
Expected: 오류 없음

- [ ] **Step 5: 최종 빌드 검증**

```bash
npm run build
```
Expected: 빌드 성공, 오류 없음

- [ ] **Step 6: commit**

```bash
git add src/features/auth/components/BusinessSignupStep1.tsx messages/ko.json messages/en.json
git commit -m "feat(i18n): BusinessSignupStep1 useTranslations 적용 + 전체 i18n 완료"
```
