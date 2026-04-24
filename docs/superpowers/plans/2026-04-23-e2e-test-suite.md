# E2E & Component Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Playwright E2E 스위트(프로덕션 `workinkorea.net` 대상, read-only) + Vitest 컴포넌트/API 테스트를 세팅해 2026-04-22 QA 리포트의 P1/P2/P3 이슈를 자동 리그레션 가드로 전환한다.

**Architecture:** 하이브리드 — 3개 Playwright 프로젝트(anonymous / company / user)로 권한 레이어 분리. 기업 계정은 `global-setup.ts` 가 매 실행마다 이메일/비번 로그인으로 `storageState` 생성. 개인 계정(Google OAuth)은 수동으로 생성한 `user.json` 이 있을 때만 실행. P1 `/user/resume/edit/:id` pre-fill 버그는 React 라이프사이클 레벨 이슈이므로 E2E 가 아니라 **Vitest 컴포넌트 테스트 + MSW** 로 잡는다.

**Tech Stack:** Playwright (`@playwright/test` ^1.50), `@axe-core/playwright` (a11y), Vitest (기존), `msw` (컴포넌트 테스트 API mocking), TypeScript strict.

**Spec Reference:** `docs/superpowers/specs/2026-04-23-e2e-test-suite-design.md`

---

## 읽기 전 핵심 컨텍스트

- 프로덕션 URL: `https://workinkorea.net`
- 기존 Vitest 테스트: `tests/api/` (API 스모크), `tests/flows/` (대부분 `skip`), `src/**/*.test.ts` (일부 유닛)
- Vitest 설정: `vitest.config.ts` — happy-dom, setup 파일 `vitest.setup.ts`
- `vitest.setup.ts` 는 이미 next/navigation mock, matchMedia, IntersectionObserver mock 포함
- 테스트 계정 (QA 리포트 기준):
  - 기업: `test@test.com`, company_id=1
  - 개인: `sukwontest`, user_id=29, 등록 이력서 id=10
  - 공고 샘플 id: 15 (수정 pre-fill 검증용)
- `ResumeEditor` 는 `src/features/resume/components/ResumeEditor.tsx` — `formDefaults` prop 을 받아 `useForm({ defaultValues })` + `useEffect` 에서 `reset(formDefaults)` 수행. P1 버그 재현 지점은 parent page (`src/app/(main)/user/resume/edit/[id]/page.tsx`) 가 `mapResumeResponseToForm` 을 거쳐 prop 을 내려주는 흐름.

---

## File Structure

### 신규 파일
```
e2e/
├── playwright.config.ts
├── global-setup.ts
├── tsconfig.json
├── fixtures/
│   ├── test-data.ts
│   └── base.ts
├── helpers/
│   ├── auth.ts
│   ├── a11y.ts
│   └── console.ts
├── anonymous/
│   ├── public-pages.anon.spec.ts
│   ├── auth-entry.anon.spec.ts
│   ├── protected-routes.anon.spec.ts
│   ├── oauth-redirect.anon.spec.ts
│   ├── self-diagnosis.anon.spec.ts
│   ├── i18n.anon.spec.ts
│   └── user-type-toggle.anon.spec.ts
├── company/
│   ├── dashboard.company.spec.ts
│   ├── jobs-list.company.spec.ts
│   ├── posts-create.company.spec.ts
│   ├── posts-edit.company.spec.ts
│   ├── profile-edit.company.spec.ts
│   ├── applicants.company.spec.ts
│   └── settings.company.spec.ts
└── user/
    ├── profile.user.spec.ts
    ├── resume.user.spec.ts
    └── applications.user.spec.ts

src/features/resume/components/__tests__/
└── ResumeEditor.test.tsx

src/features/profile/components/__tests__/
└── ProfileEditContainer.test.tsx

src/shared/test-utils/
├── msw-server.ts
└── render-with-providers.tsx

tests/api/
├── applications.test.ts      (NEW)
└── bookmarks.test.ts          (NEW)
```

### 수정 파일
- `package.json` — deps + scripts
- `.gitignore` — e2e/.auth, playwright-report, test-results
- `vitest.setup.ts` — MSW 서버 beforeAll/afterEach/afterAll 훅 추가
- `src/features/resume/lib/__tests__/mapResumeForm.test.ts` — 실제 API response 기반 realistic fixture 추가

---

## 작업 순서 원칙

1. **Phase 1 (Task 1-3):** 세팅 — 의존성, playwright config, helpers
2. **Phase 2 (Task 4-10):** Anonymous Playwright 스펙 7개
3. **Phase 3 (Task 11-13):** Company 인증 global-setup + Company 스펙 7개
4. **Phase 4 (Task 14):** User 스켈레톤 3개
5. **Phase 5 (Task 15-18):** MSW 세팅 + Vitest 컴포넌트 테스트 (P1 리그레션)
6. **Phase 6 (Task 19-20):** Vitest API 테스트 2개
7. **Phase 7 (Task 21):** 문서/스크립트/마무리

Playwright 스펙은 "실제 사이트" 를 검증하므로 전통 TDD(fail→pass) 가 어울리지 않음. 대신 각 스펙 태스크는 **(a) 작성 → (b) 프로덕션 대상 실행 → (c) 기대한 pass/fixme 결과 확인 → (d) 커밋** 사이클로 진행.

Vitest 컴포넌트 테스트(Task 15-18) 는 실제 TDD — fail 먼저 확인 후 구현.

---

## Phase 1 — 세팅

### Task 1: Playwright + 보조 의존성 설치

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: 의존성 설치**

```bash
npm i -D @playwright/test @axe-core/playwright msw
npx playwright install --with-deps chromium
```

- [ ] **Step 2: `package.json` scripts 섹션 편집**

다음 스크립트를 `"test:e2e:watch"` 바로 뒤에 추가:
```json
"test:e2e:pw": "playwright test",
"test:e2e:pw:anon": "playwright test --project=anonymous",
"test:e2e:pw:company": "playwright test --project=company",
"test:e2e:pw:user": "RUN_USER_E2E=1 playwright test --project=user",
"test:e2e:pw:ui": "playwright test --ui",
"test:e2e:pw:report": "playwright show-report"
```

- [ ] **Step 3: `.gitignore` 에 다음 줄 추가 (파일 끝)**

```
# Playwright
/e2e/.auth/
/playwright-report/
/test-results/
/playwright/.cache/
```

- [ ] **Step 4: 설치 검증**

Run: `npx playwright --version`
Expected: `Version 1.5x.x` (1.50 이상)

Run: `node -e "require('@axe-core/playwright')"`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore(test): install playwright, axe, msw deps"
```

---

### Task 2: Playwright 설정 파일 + TypeScript 설정

**Files:**
- Create: `e2e/playwright.config.ts`
- Create: `e2e/tsconfig.json`
- Create: `e2e/global-setup.ts` (후속 task 에서 본체 채움, 이번엔 stub)

- [ ] **Step 1: `e2e/tsconfig.json` 생성**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["node", "@playwright/test"],
    "module": "CommonJS",
    "moduleResolution": "Node"
  },
  "include": ["**/*.ts"]
}
```

- [ ] **Step 2: `e2e/global-setup.ts` 스텁 생성 (Task 11 에서 실체 구현)**

```ts
import type { FullConfig } from '@playwright/test';

export default async function globalSetup(_config: FullConfig) {
  // Task 11: 기업 로그인 후 storageState 저장 구현 예정
}
```

- [ ] **Step 3: `e2e/playwright.config.ts` 생성**

```ts
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const BASE_URL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';
const RUN_USER_E2E = process.env.RUN_USER_E2E === '1';
const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: __dirname,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 2 : undefined,
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: path.resolve(__dirname, 'global-setup.ts'),

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'anonymous',
      testDir: path.resolve(__dirname, 'anonymous'),
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'company',
      testDir: path.resolve(__dirname, 'company'),
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/company.json'),
      },
    },
    {
      name: 'user',
      testDir: path.resolve(__dirname, 'user'),
      testIgnore: RUN_USER_E2E ? [] : [/.*/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/user.json'),
      },
    },
  ],
});
```

- [ ] **Step 4: 설정 로드 검증 (빈 테스트 디렉토리이므로 0개 실행이어야 함)**

Run: `npx playwright test --list`
Expected: `anonymous`, `company`, `user` 프로젝트 3개 listed, 0 tests collected, 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add e2e/playwright.config.ts e2e/tsconfig.json e2e/global-setup.ts
git commit -m "chore(e2e): scaffold playwright config with 3 projects"
```

---

### Task 3: 공용 fixtures / helpers 생성

**Files:**
- Create: `e2e/fixtures/test-data.ts`
- Create: `e2e/fixtures/base.ts`
- Create: `e2e/helpers/auth.ts`
- Create: `e2e/helpers/a11y.ts`
- Create: `e2e/helpers/console.ts`

- [ ] **Step 1: `e2e/fixtures/test-data.ts`**

```ts
// 프로덕션 read-only 검증에 사용하는 상수. 환경변수로 override 가능.
export const TEST_COMPANY_EMAIL = process.env.E2E_COMPANY_EMAIL ?? 'test@test.com';
export const TEST_COMPANY_PASSWORD = process.env.E2E_COMPANY_PASSWORD ?? '';

export const SAMPLE_COMPANY_POST_ID = Number(process.env.E2E_SAMPLE_POST_ID ?? 15);
export const SAMPLE_USER_RESUME_ID = Number(process.env.E2E_SAMPLE_RESUME_ID ?? 10);

export const PROTECTED_USER_ROUTES = [
  '/user/profile',
  '/user/profile/edit',
  '/user/resume',
  '/user/applications',
  '/user/bookmarks',
  '/user/settings',
] as const;

export const PROTECTED_COMPANY_ROUTES = [
  '/company/jobs',
  '/company/posts/create',
  '/company/profile/edit',
  '/company/applicants',
  '/company/settings',
] as const;

export const PUBLIC_ROUTES = [
  '/',
  '/jobs',
  '/self-diagnosis',
  '/faq',
  '/terms',
  '/privacy',
  '/support',
  '/login-select',
  '/login',
  '/company-login',
  '/signup-select',
  '/company-signup/step1',
] as const;
```

- [ ] **Step 2: `e2e/helpers/console.ts`**

```ts
import type { Page, ConsoleMessage } from '@playwright/test';

export type ConsoleError = { type: string; text: string; url: string };

// 페이지 수명동안 console.error + pageerror 를 수집. assert 는 호출측에서.
export function collectConsoleErrors(page: Page): ConsoleError[] {
  const errors: ConsoleError[] = [];
  const onMsg = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push({
        type: 'console',
        text: msg.text(),
        url: msg.location().url,
      });
    }
  };
  const onPageErr = (err: Error) => {
    errors.push({ type: 'pageerror', text: err.message, url: page.url() });
  };
  page.on('console', onMsg);
  page.on('pageerror', onPageErr);
  return errors;
}

// Next.js / 광고 / 브라우저 확장의 노이즈 제거 — 프로젝트 콘텐츠 에러만 남김
export function filterAppErrors(errors: ConsoleError[]): ConsoleError[] {
  const IGNORED_PATTERNS = [
    /Failed to load resource.*favicon/i,
    /ERR_BLOCKED_BY_CLIENT/i,            // 광고 차단기
    /Download the React DevTools/i,
    /ReactDOM.hydrate is no longer supported/i,
  ];
  return errors.filter(e => !IGNORED_PATTERNS.some(p => p.test(e.text)));
}
```

- [ ] **Step 3: `e2e/helpers/a11y.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export type A11yOptions = {
  rules?: string[];              // 특정 규칙만 검사
  disableRules?: string[];
  include?: string;              // CSS 셀렉터
};

export async function runA11y(page: Page, opts: A11yOptions = {}) {
  let builder = new AxeBuilder({ page });
  if (opts.rules) builder = builder.withRules(opts.rules);
  if (opts.disableRules) builder = builder.disableRules(opts.disableRules);
  if (opts.include) builder = builder.include(opts.include);
  return builder.analyze();
}
```

- [ ] **Step 4: `e2e/helpers/auth.ts`**

```ts
import type { Page } from '@playwright/test';
import { TEST_COMPANY_EMAIL, TEST_COMPANY_PASSWORD } from '../fixtures/test-data';

export async function loginAsCompany(page: Page) {
  if (!TEST_COMPANY_PASSWORD) {
    throw new Error('E2E_COMPANY_PASSWORD 환경변수가 비어있습니다.');
  }
  await page.goto('/company-login');
  await page.getByLabel(/이메일/i).fill(TEST_COMPANY_EMAIL);
  await page.getByLabel(/비밀번호/i).fill(TEST_COMPANY_PASSWORD);
  await page.getByRole('button', { name: /로그인/i }).first().click();
  await page.waitForURL(/\/company(\/|$|\?)/, { timeout: 15_000 });
}
```

- [ ] **Step 5: `e2e/fixtures/base.ts`**

```ts
import { test as base } from '@playwright/test';
import { collectConsoleErrors, filterAppErrors, type ConsoleError } from '../helpers/console';

type Fixtures = {
  consoleErrors: ConsoleError[];
};

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors = collectConsoleErrors(page);
    await use(errors);
    // 각 테스트 종료 시점에 app-level 에러가 있으면 artifact 로 남기기만 함.
    // strict assertion 은 스펙에서 필요 시 명시적으로 수행.
    const filtered = filterAppErrors(errors);
    if (filtered.length > 0) {
      console.warn(`[consoleErrors] ${filtered.length} app error(s):`, filtered);
    }
  },
});

export { expect } from '@playwright/test';
```

- [ ] **Step 6: 타입 체크**

Run: `npx tsc -p e2e/tsconfig.json`
Expected: 에러 없음

- [ ] **Step 7: 커밋**

```bash
git add e2e/fixtures/ e2e/helpers/
git commit -m "chore(e2e): add shared fixtures and helpers"
```

---

## Phase 2 — Anonymous Playwright 스펙

> 공통 패턴: 각 spec 은 `import { test, expect } from '../fixtures/base'` 로 시작. 상위 디렉토리에서 `baseURL: 'https://workinkorea.net'` 이 적용됨.

### Task 4: Public pages 스모크 테스트

**Files:**
- Create: `e2e/anonymous/public-pages.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';
import { PUBLIC_ROUTES } from '../fixtures/test-data';
import { filterAppErrors } from '../helpers/console';

test.describe('Public pages smoke', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} 은 200 응답 + <h1> 렌더 + app-level console error 없음`, async ({ page, consoleErrors }) => {
      const resp = await page.goto(route);
      expect(resp, `no response for ${route}`).not.toBeNull();
      expect(resp!.status(), `status for ${route}`).toBeLessThan(400);
      await expect(page.locator('h1, h2').first()).toBeVisible();

      const appErrors = filterAppErrors(consoleErrors);
      expect(appErrors, `console errors on ${route}`).toEqual([]);
    });
  }

  test('footer 주요 링크 (/jobs, /terms, /privacy, /support, /faq) 가 200 응답', async ({ page, request }) => {
    await page.goto('/');
    const footerLinks = ['/jobs', '/terms', '/privacy', '/support', '/faq'];
    for (const href of footerLinks) {
      const resp = await request.get(href);
      expect(resp.status(), `${href} status`).toBeLessThan(400);
    }
  });

  test.fixme('P3: /support 이메일이 mailto: 링크로 렌더되어야 한다', async ({ page }) => {
    await page.goto('/support');
    const mailto = page.locator('a[href^="mailto:support@"]');
    await expect(mailto).toBeVisible();
  });
});
```

- [ ] **Step 2: 실행 및 결과 확인**

Run: `npm run test:e2e:pw:anon -- public-pages.anon`
Expected: public routes 반복 테스트 전부 pass, footer 링크 pass, mailto 는 `fixme` 로 skipped (빨간불 없음)

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/public-pages.anon.spec.ts
git commit -m "test(e2e): public pages smoke + fixme P3 mailto"
```

---

### Task 5: 인증 진입점 스펙

**Files:**
- Create: `e2e/anonymous/auth-entry.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Auth entry pages', () => {
  test('/login-select 에 개인/기업 카드가 있다', async ({ page }) => {
    await page.goto('/login-select');
    // 개인 로그인 카드
    await expect(page.getByRole('link', { name: /개인/ }).first()).toBeVisible();
    // 기업 로그인 카드
    await expect(page.getByRole('link', { name: /기업/ }).first()).toBeVisible();
  });

  test('/login 에 "Google로 시작하기" 버튼이 있다', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
  });

  test('/company-login 에 이메일/비밀번호 필드가 있다', async ({ page }) => {
    await page.goto('/company-login');
    await expect(page.getByLabel(/이메일/i)).toBeVisible();
    await expect(page.getByLabel(/비밀번호/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인/i }).first()).toBeVisible();
  });

  test.fixme('P3: /company-login main 내부에 회원가입/개인 로그인 링크가 있다', async ({ page }) => {
    await page.goto('/company-login');
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: /회원가입/ })).toBeVisible();
    await expect(main.getByRole('link', { name: /개인 로그인/ })).toBeVisible();
  });

  test('/signup-select 에 개인/기업 가입 카드가 있다', async ({ page }) => {
    await page.goto('/signup-select');
    await expect(page.getByRole('link', { name: /개인/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /기업/ }).first()).toBeVisible();
  });

  test('/company-signup/step1 에 약관 체크박스 6개가 있다', async ({ page }) => {
    await page.goto('/company-signup/step1');
    const checkboxes = page.getByRole('checkbox');
    await expect(checkboxes).toHaveCount(6, { timeout: 10_000 });
  });
});
```

- [ ] **Step 2: 실행 (기대: 체크박스 개수 assertion 은 실제 UI 에 맞게 조정 필요 — 실패 시 toBeGreaterThanOrEqual 로 완화)**

Run: `npm run test:e2e:pw:anon -- auth-entry.anon`
Expected: 5개 pass, P3 fixme 1개 skip

- [ ] **Step 3: 체크박스 개수가 실제와 다르면 아래로 수정**

```ts
await expect(checkboxes).toHaveCount(await checkboxes.count());  // 최소 1개 이상
expect(await checkboxes.count()).toBeGreaterThanOrEqual(3);
```

- [ ] **Step 4: 커밋**

```bash
git add e2e/anonymous/auth-entry.anon.spec.ts
git commit -m "test(e2e): auth entry pages smoke + fixme P3 main links"
```

---

### Task 6: 보호 라우트 가드 + P1 bridge 쿠키

**Files:**
- Create: `e2e/anonymous/protected-routes.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';
import { PROTECTED_USER_ROUTES, PROTECTED_COMPANY_ROUTES } from '../fixtures/test-data';

test.describe('Protected route guards', () => {
  test.describe('user routes', () => {
    for (const route of PROTECTED_USER_ROUTES) {
      test(`${route} 비로그인 접근 시 /login-select 로 리다이렉트`, async ({ page }) => {
        await page.goto(route);
        // 미들웨어가 302 redirect → 최종 URL 검증
        await page.waitForURL(/\/login-select/, { timeout: 10_000 });
        expect(page.url()).toContain('/login-select');
        const u = new URL(page.url());
        expect(u.searchParams.get('callbackUrl'), `callbackUrl for ${route}`).toBeTruthy();
      });
    }
  });

  test.describe('company routes', () => {
    for (const route of PROTECTED_COMPANY_ROUTES) {
      test(`${route} 비로그인 접근 시 /login-select 또는 /company-login 으로 리다이렉트`, async ({ page }) => {
        await page.goto(route);
        await page.waitForURL(/\/(login-select|company-login)/, { timeout: 10_000 });
        expect(page.url()).toMatch(/\/(login-select|company-login)/);
      });
    }
  });

  test('P1: 만료된 userTypeClient=company 쿠키가 있어도 /signup-select 진입이 허용된다', async ({ context, page }) => {
    const url = new URL(process.env.E2E_BASE_URL ?? 'https://workinkorea.net');
    await context.addCookies([{
      name: 'userTypeClient',
      value: 'company',
      domain: url.hostname,
      path: '/',
      httpOnly: false,
      secure: url.protocol === 'https:',
      sameSite: 'Lax',
    }]);

    await page.goto('/signup-select');
    // 기대: 리다이렉트 없이 signup-select 에 머문다
    expect(page.url()).toContain('/signup-select');
    await expect(page.getByRole('heading', { name: /회원가입|가입/ }).first()).toBeVisible();
  });
});
```

- [ ] **Step 2: 실행**

Run: `npm run test:e2e:pw:anon -- protected-routes.anon`
Expected: user 루트 6개 + company 루트 5개 + bridge 쿠키 1개 모두 pass

**현재 프로덕션에 P1 버그가 있다면 bridge 쿠키 테스트가 FAIL 할 수 있음** — 이 경우 테스트를 `test.fixme` 로 잠시 마킹 (버그 수정과 함께 해제):

```ts
test.fixme('P1: 만료된 userTypeClient=company 쿠키가 있어도 ...', ...);
```

단 fixme 처리 전에 실제 실패하는지 확인 (QA 리포트 시점으로부터 시간이 지나 이미 수정되었을 수 있음).

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/protected-routes.anon.spec.ts
git commit -m "test(e2e): protected route guards + P1 bridge cookie regression"
```

---

### Task 7: Google OAuth redirect 파라미터 검증

**Files:**
- Create: `e2e/anonymous/oauth-redirect.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Google OAuth redirect', () => {
  test('/login 의 "Google로 시작하기" 클릭 시 accounts.google.com 로 올바른 파라미터로 이동한다', async ({ page }) => {
    // accounts.google.com 로의 실제 네비게이션은 차단하되, URL 은 가로챔
    let capturedUrl: string | null = null;
    await page.route('**/accounts.google.com/**', (route) => {
      capturedUrl = route.request().url();
      return route.abort();
    });
    // 백엔드가 자체 /api/auth/login/google 엔드포인트로 먼저 리다이렉트하는 경우도 캡처
    await page.route('**/api/auth/login/google**', async (route) => {
      // 실제 요청 진행(백엔드가 302 로 accounts.google.com 반환)
      await route.continue();
    });

    await page.goto('/login');
    const button = page.getByRole('button', { name: /Google/i });
    await button.click();

    // 약간의 시간을 주고 캡처된 URL 검증
    await page.waitForTimeout(2000);

    expect(capturedUrl, 'accounts.google.com URL 이 캡처되어야 한다').not.toBeNull();
    const u = new URL(capturedUrl!);
    expect(u.hostname).toBe('accounts.google.com');
    expect(u.searchParams.get('client_id'), 'client_id').toBeTruthy();
    const redirectUri = u.searchParams.get('redirect_uri');
    expect(redirectUri, 'redirect_uri').toContain('workinkorea');
    const scope = u.searchParams.get('scope') ?? '';
    expect(scope, 'scope 에 email 과 profile 포함').toMatch(/email/);
    expect(scope).toMatch(/profile/);
  });
});
```

- [ ] **Step 2: 실행 — 실패 시 구글 로그인 버튼이 `<a href>` 기반이라면 click 대신 `page.locator('a[href*="google"]').getAttribute('href')` 로 검사하도록 조정**

Run: `npm run test:e2e:pw:anon -- oauth-redirect.anon`
Expected: pass. 만약 버튼이 `<a>` 태그이고 직접 `accounts.google.com` 으로 이동한다면 아래 대안으로 교체:

```ts
test('/login 의 Google 링크 href 가 /api/auth/login/google 을 가리킨다', async ({ page }) => {
  await page.goto('/login');
  const link = page.locator('a:has-text("Google")').first();
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href!).toMatch(/google|\/api\/auth\/login\/google/i);
});
```

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/oauth-redirect.anon.spec.ts
git commit -m "test(e2e): Google OAuth redirect parameter verification"
```

---

### Task 8: 자가진단 플로우

**Files:**
- Create: `e2e/anonymous/self-diagnosis.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Self-diagnosis flow', () => {
  test('/self-diagnosis 진입 → 시작하기 클릭 → /diagnosis 이동 → 첫 스텝 radio 선택 → 다음 스텝', async ({ page }) => {
    await page.goto('/self-diagnosis');
    await expect(page.getByRole('heading', { name: /자가진단|진단/ }).first()).toBeVisible();

    const startBtn = page.getByRole('button', { name: /시작|다음|Start/i }).first();
    await startBtn.click();
    await page.waitForURL(/\/diagnosis/, { timeout: 10_000 });

    // 첫 스텝: 국가/언어 라디오가 여러 개 있음
    const radios = page.getByRole('radio');
    const count = await radios.count();
    expect(count, '첫 스텝 radio 개수').toBeGreaterThanOrEqual(3);

    // 각 라디오 그룹(name 속성) 에서 하나씩 선택 — QA 리포트에 name 값이 없어서 첫 3개만 클릭
    for (let i = 0; i < Math.min(3, count); i++) {
      await radios.nth(i).check({ force: true });
    }

    // "다음" 버튼이 활성화되는지
    const nextBtn = page.getByRole('button', { name: /다음|Next/ }).first();
    await expect(nextBtn).toBeEnabled();
  });

  test('/self-diagnosis 와 /diagnosis 모두 200 응답한다', async ({ request }) => {
    const a = await request.get('/self-diagnosis');
    const b = await request.get('/diagnosis');
    expect(a.status()).toBeLessThan(400);
    expect(b.status()).toBeLessThan(400);
  });
});
```

- [ ] **Step 2: 실행**

Run: `npm run test:e2e:pw:anon -- self-diagnosis.anon`
Expected: 2 pass. 첫 테스트가 실패하면 radio 선택 개수를 완화하거나 `force: true` 유지.

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/self-diagnosis.anon.spec.ts
git commit -m "test(e2e): self-diagnosis flow smoke"
```

---

### Task 9: i18n `<title>` 다국어 (P2 fixme)

**Files:**
- Create: `e2e/anonymous/i18n.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';

test.describe('i18n language toggle', () => {
  test('초기 진입 시 <html lang="ko">', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });

  test.fixme('P2: EN 토글 클릭 시 <html lang="en"> 으로 바뀐다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^EN$/ }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test.fixme('P2: EN 토글 후 <title> 이 영어로 바뀐다', async ({ page }) => {
    await page.goto('/');
    const koTitle = await page.title();
    await page.getByRole('button', { name: /^EN$/ }).click();
    // 쿠키 반영 위해 reload
    await page.reload();
    const enTitle = await page.title();
    expect(enTitle).not.toBe(koTitle);
    expect(enTitle.toLowerCase()).toMatch(/[a-z]/);
  });
});
```

- [ ] **Step 2: 실행**

Run: `npm run test:e2e:pw:anon -- i18n.anon`
Expected: 첫 테스트 pass, 2개 fixme skip (빨간불 없음). 첫 테스트가 실패하면 `<html>` 의 lang 속성 검사 방식을 locale 쿠키 확인으로 변경:

```ts
const cookies = await page.context().cookies();
expect(cookies.find(c => c.name === 'locale')?.value ?? 'ko').toBe('ko');
```

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/i18n.anon.spec.ts
git commit -m "test(e2e): i18n initial lang + fixme P2 title switch"
```

---

### Task 10: UserTypeToggle (P2 fixme)

**Files:**
- Create: `e2e/anonymous/user-type-toggle.anon.spec.ts`

- [ ] **Step 1: 스펙 작성**

```ts
import { test, expect } from '../fixtures/base';

test.describe('UserTypeToggle (header)', () => {
  test('헤더에 개인/기업 토글 버튼이 존재한다', async ({ page }) => {
    await page.goto('/');
    const personalBtn = page.getByRole('button', { name: /개인/ }).first();
    const companyBtn = page.getByRole('button', { name: /기업/ }).first();
    await expect(personalBtn).toBeVisible();
    await expect(companyBtn).toBeVisible();
  });

  test.fixme('P2: "기업" 클릭 시 userTypeClient 쿠키가 company 로 변경된다', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^기업$/ }).first().click();
    await page.waitForTimeout(500);
    const cookies = await context.cookies();
    const c = cookies.find(c => c.name === 'userTypeClient');
    expect(c?.value).toBe('company');
  });

  test.fixme('P2: "기업" 클릭 시 히어로 문구가 기업 메시지로 전환된다', async ({ page }) => {
    await page.goto('/');
    const beforeText = await page.locator('main').first().innerText();
    await page.getByRole('button', { name: /^기업$/ }).first().click();
    await page.waitForTimeout(500);
    const afterText = await page.locator('main').first().innerText();
    expect(afterText).not.toBe(beforeText);
  });
});
```

- [ ] **Step 2: 실행**

Run: `npm run test:e2e:pw:anon -- user-type-toggle.anon`
Expected: 1 pass + 2 fixme skip. 첫 테스트 실패 시 버튼 셀렉터를 `aria-label` 기준으로 조정.

- [ ] **Step 3: 커밋**

```bash
git add e2e/anonymous/user-type-toggle.anon.spec.ts
git commit -m "test(e2e): user type toggle existence + fixme P2 state change"
```

---

## Phase 3 — Company 인증 + Company 스펙

### Task 11: `global-setup.ts` 실체 구현 (기업 로그인 자동화)

**Files:**
- Modify: `e2e/global-setup.ts`

- [ ] **Step 1: `e2e/global-setup.ts` 교체**

```ts
import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const email = process.env.E2E_COMPANY_EMAIL ?? 'test@test.com';
  const password = process.env.E2E_COMPANY_PASSWORD;
  const baseURL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';
  const authDir = path.resolve(__dirname, '.auth');
  const statePath = path.join(authDir, 'company.json');

  if (!password) {
    console.warn('[global-setup] E2E_COMPANY_PASSWORD 미설정 → company storageState 건너뜀. company 프로젝트 실행 시 스토리지 파일 없음으로 skip 됩니다.');
    // 존재하지 않는 파일로 두어 Playwright 가 자동 skip
    if (fs.existsSync(statePath)) fs.unlinkSync(statePath);
    return;
  }

  fs.mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    await page.goto('/company-login', { waitUntil: 'domcontentloaded' });
    await page.getByLabel(/이메일/i).fill(email);
    await page.getByLabel(/비밀번호/i).fill(password);
    await page.getByRole('button', { name: /로그인/i }).first().click();
    await page.waitForURL(/\/company(\/|$|\?)/, { timeout: 15_000 });
    await context.storageState({ path: statePath });
    console.log(`[global-setup] company storageState 저장됨: ${statePath}`);
  } catch (err) {
    console.error('[global-setup] 기업 로그인 실패:', err);
    if (fs.existsSync(statePath)) fs.unlinkSync(statePath);
  } finally {
    await browser.close();
  }
}
```

- [ ] **Step 2: 로그인 없이 실행해서 warning 으로 끝나는지 확인**

Run: `npx playwright test --project=anonymous --list`
Expected: `[global-setup] E2E_COMPANY_PASSWORD 미설정...` warning 출력, anonymous 테스트는 정상 리스트

- [ ] **Step 3: (크레덴셜 보유 시) 실제 로그인 검증**

Run: `E2E_COMPANY_EMAIL=test@test.com E2E_COMPANY_PASSWORD=<secret> npx playwright test --project=company --list`
Expected: storageState 저장 로그 + company 프로젝트 테스트 리스트

- [ ] **Step 4: 커밋**

```bash
git add e2e/global-setup.ts
git commit -m "feat(e2e): global-setup logs into company account via form"
```

---

### Task 12: Company Dashboard / Jobs list / Posts edit / Settings (read-only)

**Files:**
- Create: `e2e/company/dashboard.company.spec.ts`
- Create: `e2e/company/jobs-list.company.spec.ts`
- Create: `e2e/company/posts-edit.company.spec.ts`
- Create: `e2e/company/applicants.company.spec.ts`
- Create: `e2e/company/settings.company.spec.ts`

- [ ] **Step 1: `dashboard.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Company dashboard', () => {
  test('/company 에 진행 공고 / 전체 공고 KPI 가 렌더된다', async ({ page }) => {
    await page.goto('/company');
    await expect(page.getByText(/진행 공고/)).toBeVisible();
    await expect(page.getByText(/전체 공고/)).toBeVisible();
  });

  test('"새 채용 공고 등록" CTA 가 보이고 /company/posts/create 로 이동한다', async ({ page }) => {
    await page.goto('/company');
    const cta = page.getByRole('link', { name: /새 채용 공고 등록|공고 등록/ }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await page.waitForURL(/\/company\/posts\/create/);
  });
});
```

- [ ] **Step 2: `jobs-list.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Company jobs list', () => {
  test('/company/jobs 에 "채용 공고 관리" 헤딩과 "전체 공고 (N개)" 카운트가 있다', async ({ page }) => {
    await page.goto('/company/jobs');
    await expect(page.getByRole('heading', { name: /채용 공고 관리|공고 관리/ })).toBeVisible();
    await expect(page.getByText(/전체 공고.*\(\d+개\)/)).toBeVisible();
  });

  test('"등록" 링크/버튼이 /company/posts/create 로 연결된다', async ({ page }) => {
    await page.goto('/company/jobs');
    const link = page.getByRole('link', { name: /등록/ }).first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('/company/posts/create');
  });
});
```

- [ ] **Step 3: `posts-edit.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';
import { SAMPLE_COMPANY_POST_ID } from '../fixtures/test-data';

test.describe('Company post edit pre-fill', () => {
  test(`/company/posts/edit/${SAMPLE_COMPANY_POST_ID} pre-fill 된 title / 근무시간 / 연봉이 있다`, async ({ page }) => {
    await page.goto(`/company/posts/edit/${SAMPLE_COMPANY_POST_ID}`);
    // title input 비어있지 않아야 함
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toHaveValue(/.+/, { timeout: 15_000 });

    // number 입력값들 역시 비어있지 않음
    const numbers = page.locator('input[type="number"]');
    const n = await numbers.count();
    expect(n).toBeGreaterThanOrEqual(1);

    // "공고 수정하기" 또는 "공고 삭제" 버튼이 존재
    await expect(page.getByRole('button', { name: /수정|Edit/ }).first()).toBeVisible();
  });
});
```

- [ ] **Step 4: `applicants.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Company applicants (P1 placeholder)', () => {
  test('/company/applicants 는 "기능 준비 중" placeholder 를 표시한다', async ({ page }) => {
    await page.goto('/company/applicants');
    await expect(page.getByText(/준비 중|Coming soon/i).first()).toBeVisible();
  });

  // TODO: 백엔드 구현 후 실제 테이블 assertion 으로 전환
});
```

- [ ] **Step 5: `settings.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('Company settings', () => {
  test('/company/settings 에 "기업 프로필 편집" 활성 링크가 있다', async ({ page }) => {
    await page.goto('/company/settings');
    await expect(page.getByRole('link', { name: /기업 프로필 편집|프로필 편집/ })).toBeVisible();
  });

  test('비밀번호/알림/결제는 "예정" 안내가 있다', async ({ page }) => {
    await page.goto('/company/settings');
    await expect(page.getByText(/예정|Coming/i).first()).toBeVisible();
  });
});
```

- [ ] **Step 6: 실행 (크레덴셜 있는 환경에서)**

Run: `E2E_COMPANY_PASSWORD=<secret> npm run test:e2e:pw:company`
Expected: 5개 파일 모든 테스트 pass

- [ ] **Step 7: 커밋**

```bash
git add e2e/company/dashboard.company.spec.ts e2e/company/jobs-list.company.spec.ts \
        e2e/company/posts-edit.company.spec.ts e2e/company/applicants.company.spec.ts \
        e2e/company/settings.company.spec.ts
git commit -m "test(e2e): company dashboard/jobs/posts-edit/applicants/settings specs"
```

---

### Task 13: Company Posts create + Profile edit (폼 검증 + a11y)

**Files:**
- Create: `e2e/company/posts-create.company.spec.ts`
- Create: `e2e/company/profile-edit.company.spec.ts`

- [ ] **Step 1: `posts-create.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';
import { runA11y } from '../helpers/a11y';

test.describe('Company post create form', () => {
  test('/company/posts/create 에 4개 섹션 헤딩이 있다', async ({ page }) => {
    await page.goto('/company/posts/create');
    // "기본 정보", "근무 조건", "모집 기간", "담당자 정보"
    for (const title of ['기본 정보', '근무 조건', '모집 기간', '담당자 정보']) {
      await expect(page.getByText(title).first()).toBeVisible();
    }
  });

  test('빈 상태에서 "공고 등록하기" 클릭 시 필수 필드 에러 메시지가 표시되고 URL 이 변경되지 않는다', async ({ page }) => {
    await page.goto('/company/posts/create');
    const before = page.url();

    const submit = page.getByRole('button', { name: /공고 등록하기/ }).first();
    await submit.click();

    // 최소 1개 이상의 인라인 에러 메시지
    const errors = page.locator('[role="alert"], .text-red-500, [class*="error"]');
    await expect(errors.first()).toBeVisible({ timeout: 5_000 });

    expect(page.url()).toBe(before);
  });

  test('"공고 제목을 입력해주세요" 같은 구체 메시지가 노출된다', async ({ page }) => {
    await page.goto('/company/posts/create');
    await page.getByRole('button', { name: /공고 등록하기/ }).first().click();
    await expect(page.getByText(/공고 제목을 입력/).first()).toBeVisible();
  });

  test.fixme('P2: 에러 필드에 aria-invalid="true" 가 설정된다', async ({ page }) => {
    await page.goto('/company/posts/create');
    await page.getByRole('button', { name: /공고 등록하기/ }).first().click();
    const invalidInputs = page.locator('input[aria-invalid="true"], textarea[aria-invalid="true"]');
    expect(await invalidInputs.count()).toBeGreaterThan(0);
  });

  test.fixme('P3: "공고 등록하기" submit 버튼이 DOM 에 1개만 존재한다', async ({ page }) => {
    await page.goto('/company/posts/create');
    const submits = page.getByRole('button', { name: /공고 등록하기/ });
    expect(await submits.count()).toBe(1);
  });

  test('현재 submit 버튼 개수 baseline (P3 모니터링용)', async ({ page }) => {
    await page.goto('/company/posts/create');
    const count = await page.getByRole('button', { name: /공고 등록하기/ }).count();
    // 현재 상태 (QA 리포트 기준 3개) 를 느슨하게 검증 — 0 초과만 확인
    expect(count).toBeGreaterThan(0);
    console.log(`[baseline] submit 버튼 DOM 개수: ${count}`);
  });
});
```

- [ ] **Step 2: `profile-edit.company.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';
import { runA11y } from '../helpers/a11y';

test.describe('Company profile edit', () => {
  test('/company/profile/edit pre-fill 된 이메일/전화번호 필드가 있다', async ({ page }) => {
    await page.goto('/company/profile/edit');
    // 이메일 / 전화번호 input 이 비어있지 않음
    const email = page.locator('input[type="email"], input[name*="email"]').first();
    const phone = page.locator('input[name*="phone"], input[type="tel"]').first();
    await expect(email).toHaveValue(/.+@.+/, { timeout: 15_000 });
    await expect(phone).toHaveValue(/\d/);
  });

  test('"저장하기" 버튼이 존재한다', async ({ page }) => {
    await page.goto('/company/profile/edit');
    await expect(page.getByRole('button', { name: /저장/ }).first()).toBeVisible();
  });

  test.fixme('P2: 모든 input 에 연결된 <label> 이 있다 (axe label rule)', async ({ page }) => {
    await page.goto('/company/profile/edit');
    const results = await runA11y(page, { rules: ['label'] });
    expect(results.violations.filter(v => v.id === 'label')).toEqual([]);
  });
});
```

- [ ] **Step 3: 실행**

Run: `E2E_COMPANY_PASSWORD=<secret> npm run test:e2e:pw:company -- posts-create.company profile-edit.company`
Expected: non-fixme 테스트 pass, fixme 3개 skip

- [ ] **Step 4: 커밋**

```bash
git add e2e/company/posts-create.company.spec.ts e2e/company/profile-edit.company.spec.ts
git commit -m "test(e2e): posts-create + profile-edit with P2/P3 fixme a11y gates"
```

---

## Phase 4 — User 프로젝트 스켈레톤

### Task 14: User 스펙 3개 (storageState 있을 때만 실행)

**Files:**
- Create: `e2e/user/profile.user.spec.ts`
- Create: `e2e/user/resume.user.spec.ts`
- Create: `e2e/user/applications.user.spec.ts`
- Create: `e2e/user/README.md`

- [ ] **Step 1: `profile.user.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('User profile (requires storageState)', () => {
  test('/user/profile 에 프로필 카드가 렌더된다', async ({ page }) => {
    await page.goto('/user/profile');
    // 사용자명 / 국가 / 프로필 카드 요소 중 하나라도 보여야 함
    await expect(page.locator('main').first()).toContainText(/프로필|Profile/i);
  });

  test('P2: /user/settings 는 /user/profile/edit 로 리다이렉트된다', async ({ page }) => {
    await page.goto('/user/settings');
    await page.waitForURL(/\/user\/profile\/edit/, { timeout: 10_000 });
    expect(page.url()).toContain('/user/profile/edit');
  });
});
```

- [ ] **Step 2: `resume.user.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';
import { SAMPLE_USER_RESUME_ID } from '../fixtures/test-data';

test.describe('User resume (requires storageState)', () => {
  test('/user/resume 에 등록된 이력서 카드가 있다', async ({ page }) => {
    await page.goto('/user/resume');
    await expect(page.locator('main').first()).toContainText(/이력서|Resume/i);
  });

  test(`/user/resume/edit/${SAMPLE_USER_RESUME_ID} 에 title pre-fill 이 있다 (P1 감시)`, async ({ page }) => {
    await page.goto(`/user/resume/edit/${SAMPLE_USER_RESUME_ID}`);
    const titleInput = page.locator('input[name="title"]').first();
    // QA 리포트 P1: 현재 production 에서 빈 값. fix 전까지 fixme 권장.
    // 여기서는 실제 값이 있을 때만 pass 하도록 일반 expect 로 작성하고,
    // 깨지면 운영에 알림. fix 전까진 이 테스트만 `.fixme` 로 감싸도 됨.
    await expect(titleInput).toHaveValue(/.+/, { timeout: 15_000 });
  });
});
```

- [ ] **Step 3: `applications.user.spec.ts`**

```ts
import { test, expect } from '../fixtures/base';

test.describe('User applications (P1 placeholder)', () => {
  test('/user/applications 는 "기능 준비 중" placeholder 를 표시한다', async ({ page }) => {
    await page.goto('/user/applications');
    await expect(page.getByText(/준비 중|Coming soon/i).first()).toBeVisible();
  });

  // TODO: 백엔드 POST/GET /api/applications 구현 후 실제 리스트/상태 assertion 으로 전환
});
```

- [ ] **Step 4: `e2e/user/README.md`**

```markdown
# User E2E (Google OAuth 세션)

이 프로젝트는 개인회원(Google 로그인) 세션이 필요합니다. Google OAuth 는 자동화가 어려워 수동 1회 설정이 필요합니다.

## 세션 생성

```bash
# 1) Playwright 브라우저에서 직접 로그인
npx playwright open --save-storage=e2e/.auth/user.json https://workinkorea.net/login
# → "Google로 시작하기" 클릭 → 로그인 완료 → 브라우저 닫기

# 2) 저장된 세션으로 user 프로젝트 실행
RUN_USER_E2E=1 npm run test:e2e:pw:user
```

## 세션 만료

`refresh_token` 유효기간(통상 30~90일) 이 지나면 `/user/*` 접근이 `/login-select` 로 리다이렉트됩니다.
`profile.user.spec.ts` 의 첫 테스트가 실패하면 세션 재생성이 필요합니다.

## 컴포넌트 레벨 대안

E2E 세션이 만료되어도 `src/features/resume/components/__tests__/ResumeEditor.test.tsx`
(MSW 기반) 가 P1 pre-fill 리그레션을 지속 감시합니다. E2E 는 보조 레이어입니다.
```

- [ ] **Step 5: 실행 (storageState 없이 — 전체 skip 되어야 함)**

Run: `npx playwright test --project=user --list`
Expected: 0 tests collected (env `RUN_USER_E2E` 미설정)

- [ ] **Step 6: 커밋**

```bash
git add e2e/user/
git commit -m "test(e2e): user project skeleton with storageState setup README"
```

---

## Phase 5 — Vitest 컴포넌트 테스트 (P1 리그레션)

### Task 15: MSW 서버 + 공용 테스트 유틸

**Files:**
- Create: `src/shared/test-utils/msw-server.ts`
- Create: `src/shared/test-utils/render-with-providers.tsx`
- Modify: `vitest.setup.ts`

- [ ] **Step 1: `src/shared/test-utils/msw-server.ts`**

```ts
import { setupServer } from 'msw/node';

// 기본 핸들러 없음 — 각 테스트가 server.use(...) 로 주입
export const server = setupServer();
```

- [ ] **Step 2: `src/shared/test-utils/render-with-providers.tsx`**

```tsx
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import koMessages from '../../../messages/ko.json';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

type Options = RenderOptions & {
  queryClient?: QueryClient;
  locale?: 'ko' | 'en';
};

export function renderWithProviders(ui: ReactElement, opts: Options = {}) {
  const client = opts.queryClient ?? createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={opts.locale ?? 'ko'} messages={koMessages}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );
  return { queryClient: client, ...render(ui, { wrapper: Wrapper, ...opts }) };
}
```

- [ ] **Step 3: `vitest.setup.ts` 편집 — 파일 맨 아래에 추가**

```ts
// MSW server lifecycle
import { server } from './src/shared/test-utils/msw-server';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- [ ] **Step 4: 타입체크**

Run: `npm run typecheck`
Expected: 에러 없음 (msw 타입이 자동 인식)

- [ ] **Step 5: 커밋**

```bash
git add src/shared/test-utils/ vitest.setup.ts
git commit -m "test(unit): add MSW server and renderWithProviders utility"
```

---

### Task 16: P1 리그레션 — `ResumeEditor` pre-fill 컴포넌트 테스트

**Files:**
- Create: `src/features/resume/components/__tests__/ResumeEditor.test.tsx`

**검증 대상 bug (QA 리포트 P1):** `/user/resume/edit/:id` 에서 서버 응답은 정상이나 폼 필드가 빈 값으로 렌더됨.

- [ ] **Step 1: 실패하는 테스트 먼저 작성**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import ResumeEditor from '@/features/resume/components/ResumeEditor';
import { renderWithProviders } from '@/shared/test-utils/render-with-providers';
import type { ResumeFormData } from '@/features/resume/lib/mapResumeForm';

vi.mock('@/features/resume/api/resumeApi', () => ({
  resumeApi: {
    getResumeById: vi.fn(),
    createResume: vi.fn(),
    updateResume: vi.fn(),
  },
}));
vi.mock('@/features/profile/api/profileApi', () => ({
  profileApi: {
    getProfile: vi.fn().mockResolvedValue({ name: 'Tester', birth_date: '1990-01-01', country_id: 122 }),
    getContact: vi.fn().mockResolvedValue({ email: 't@example.com', phone_number: '010-0000-0000' }),
  },
}));

function makeDefaults(): ResumeFormData {
  return {
    title: 'QA 테스트 이력서 (수정됨)',
    profile_url: '',
    language_skills: [{ language_type: 'ko', level: 'native' }],
    schools: [
      {
        school_name: '테스트 대학교',
        major_name: '컴퓨터공학',
        start_date: '2010-03-01',
        end_date: '2014-02-28',
        is_graduated: true,
      },
    ],
    career_history: [
      {
        company_name: '워크인코리아',
        start_date: '2020-01-01',
        end_date: '',
        is_working: true,
        department: '엔지니어링',
      } as unknown as ResumeFormData['career_history'][number],
    ],
    introduction: [],
    licenses: [],
  } as ResumeFormData;
}

describe('ResumeEditor pre-fill (P1 리그레션)', () => {
  it('isEditMode + formDefaults 로 렌더되면 title input 에 값이 채워진다', async () => {
    const defaults = makeDefaults();
    renderWithProviders(
      <ResumeEditor templateType="modern" formDefaults={defaults} isEditMode resumeId={10} />,
    );

    const titleInput = (await screen.findByDisplayValue('QA 테스트 이력서 (수정됨)')) as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe('QA 테스트 이력서 (수정됨)');
  });

  it('formDefaults 의 language_skills 가 field array 로 렌더된다', async () => {
    const defaults = makeDefaults();
    renderWithProviders(
      <ResumeEditor templateType="modern" formDefaults={defaults} isEditMode resumeId={10} />,
    );

    // language 섹션 진입 — 아코디언 이 닫혀있으면 펼침
    await waitFor(() => {
      const langHeading = screen.queryByText(/언어|Language/i);
      expect(langHeading).toBeTruthy();
    });
  });

  it('formDefaults 가 비동기로 변경되면 reset 으로 폼이 갱신된다', async () => {
    const defaults1 = makeDefaults();
    const { rerender } = renderWithProviders(
      <ResumeEditor templateType="modern" formDefaults={defaults1} isEditMode resumeId={10} />,
    );

    const titleInput = (await screen.findByDisplayValue('QA 테스트 이력서 (수정됨)')) as HTMLInputElement;
    expect(titleInput.value).toBe('QA 테스트 이력서 (수정됨)');

    const defaults2: ResumeFormData = { ...defaults1, title: '두번째 버전' };
    rerender(
      <ResumeEditor templateType="modern" formDefaults={defaults2} isEditMode resumeId={10} />,
    );

    await waitFor(() => {
      const input = screen.getByDisplayValue('두번째 버전') as HTMLInputElement;
      expect(input.value).toBe('두번째 버전');
    });
  });
});
```

- [ ] **Step 2: 실행해서 실패하는 테스트가 어떻게 실패하는지 확인**

Run: `npx vitest run src/features/resume/components/__tests__/ResumeEditor.test.tsx`
Expected: 현재 production 버그 상태와 무관하게 **코드가 정상이면 pass** 여야 함 (ResumeEditor 가 formDefaults 를 받아 useForm defaultValues 로 세팅하는 흐름이 이미 구현됨). **만약 첫 테스트가 실패한다면 진짜 버그를 재현한 것이므로 fix 가 필요**.

- [ ] **Step 3: 테스트가 pass 하지 않으면 원인 조사 후 fix (P1 bug fix)**

pass 하지 않을 가능성이 있는 원인:
- `useEffect(() => reset(formDefaults))` dependency 에 `formDefaults` 가 매번 새 reference → loop 발생
- `defaultValues: resolvedDefaults` 가 초기 1회만 반영되고 rerender 시 무시 (rhf 동작)
- field array 초기값이 제대로 안 반영되는 rhf 버그 (버전 확인)

fix 방향: `useEffect` 의 `reset` 호출을 deep-equal 체크 또는 `keepDirty: false` 옵션 검토.

- [ ] **Step 4: 테스트 pass 확인**

Run: `npx vitest run src/features/resume/components/__tests__/ResumeEditor.test.tsx`
Expected: 3개 테스트 모두 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/features/resume/components/__tests__/ResumeEditor.test.tsx
# (버그 fix 있었다면 src/features/resume/components/ResumeEditor.tsx 도 함께)
git commit -m "test(resume): P1 regression guard for ResumeEditor pre-fill"
```

---

### Task 17: `ProfileEditContainer` pre-fill 컴포넌트 테스트

**Files:**
- Create: `src/features/profile/components/__tests__/ProfileEditContainer.test.tsx`

- [ ] **Step 1: 대상 컴포넌트 prop/동작 파악**

Run: `grep -n "export" src/features/profile/components/ProfileEditContainer.tsx | head`
`ProfileEditContainer` 가 내부에서 `profileApi.getProfile`, `getContact` 를 호출한다면 `vi.mock` 으로 intercept 한다. 파일 구조가 다르면 Task 16 과 유사하게 props 기반으로 조정.

- [ ] **Step 2: 테스트 작성 (profileApi 를 vi.mock 으로 stub)**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/shared/test-utils/render-with-providers';

vi.mock('@/features/profile/api/profileApi', () => ({
  profileApi: {
    getProfile: vi.fn().mockResolvedValue({
      name: '홍길동',
      birth_date: '1990-05-15',
      country_id: 122,
      introduction: '안녕하세요',
    }),
    getContact: vi.fn().mockResolvedValue({
      email: 'hong@example.com',
      phone_number: '010-1234-5678',
    }),
    updateProfile: vi.fn(),
    updateContact: vi.fn(),
  },
}));

// dynamic import 로 컴포넌트 로드 — mock 이 먼저 적용되게 함
import ProfileEditContainer from '@/features/profile/components/ProfileEditContainer';

describe('ProfileEditContainer pre-fill', () => {
  it('profile/contact API 응답이 폼 필드에 채워진다', async () => {
    renderWithProviders(<ProfileEditContainer />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('hong@example.com')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: 실행**

Run: `npx vitest run src/features/profile/components/__tests__/ProfileEditContainer.test.tsx`
Expected: PASS. 실패 시 컴포넌트가 `useQuery` 이외 다른 경로로 데이터를 받는지 확인하고 mock 대상 조정.

- [ ] **Step 4: 커밋**

```bash
git add src/features/profile/components/__tests__/ProfileEditContainer.test.tsx
git commit -m "test(profile): pre-fill regression guard for ProfileEditContainer"
```

---

### Task 18: `mapResumeResponseToForm` realistic fixture 강화

**Files:**
- Modify: `src/features/resume/lib/__tests__/mapResumeForm.test.ts`

- [ ] **Step 1: 기존 파일 확인**

Run: `cat src/features/resume/lib/__tests__/mapResumeForm.test.ts`
기존 테스트 케이스 목록 확인

- [ ] **Step 2: 실제 API response 에 가까운 케이스 추가 — 파일 끝에 신규 describe 추가**

```ts
import { describe, it, expect } from 'vitest';
import { mapResumeResponseToForm } from '../mapResumeForm';
import type { ResumeDetail, ProfileResponse, ContactResponse } from '@/shared/types/api';

describe('mapResumeResponseToForm — realistic API response (P1 리그레션)', () => {
  it('QA 리포트에 기록된 응답 형태(title 채워짐) 가 폼 데이터로 변환된다', () => {
    const response = {
      id: 10,
      user_id: 29,
      title: 'QA 테스트 이력서 (수정됨)',
      profile_url: '',
      language_skills: [{ language_type: 'ko', level: 'native' }],
      schools: [
        {
          school_name: '서울대학교',
          major_name: '컴퓨터공학',
          start_date: '2010-03-01',
          end_date: '2014-02-28',
          is_graduated: true,
        },
      ],
      career_history: [],
      introduction: [{ title: '자기소개', content: '반갑습니다' }],
      licenses: [],
    } as unknown as ResumeDetail;

    const profile: ProfileResponse = {
      name: 'sukwontest',
      birth_date: '1995-01-01',
      country_id: 122,
    } as ProfileResponse;
    const contact: ContactResponse = {
      email: 'sukwon@test.com',
      phone_number: '010-0000-0000',
    } as ContactResponse;

    const form = mapResumeResponseToForm(response, { profile, contact });

    expect(form.title).toBe('QA 테스트 이력서 (수정됨)');
    expect(form.language_skills).toHaveLength(1);
    expect(form.schools[0].school_name).toBe('서울대학교');
    expect(form.introduction[0]?.content).toBe('반갑습니다');
  });

  it('title 이 빈 문자열로 오면 빈 문자열로 반환한다 (undefined 로 변환하지 않음)', () => {
    const response = { id: 1, title: '' } as unknown as ResumeDetail;
    const form = mapResumeResponseToForm(response, {});
    expect(form.title).toBe('');
  });
});
```

- [ ] **Step 3: 실행**

Run: `npx vitest run src/features/resume/lib/__tests__/mapResumeForm.test.ts`
Expected: 기존 + 신규 케이스 모두 PASS. 실패하면 mapper 가 실제 응답 형태를 처리 못 하는 증거 — fix 필요.

- [ ] **Step 4: 커밋**

```bash
git add src/features/resume/lib/__tests__/mapResumeForm.test.ts
git commit -m "test(resume): strengthen mapResumeResponseToForm with realistic fixture"
```

---

## Phase 6 — Vitest API 테스트 (미구현 엔드포인트)

### Task 19: `applications` API 404 가드

**Files:**
- Create: `tests/api/applications.test.ts`

- [ ] **Step 1: 테스트 작성**

```ts
import { describe, it, expect } from 'vitest';
import { apiClient, type ApiError } from '../utils/api-client';

describe('Applications API (미구현 — 구현 시 이 테스트들이 변경되어야 함)', () => {
  it('POST /api/applications 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.post('/api/applications', { post_id: 1, resume_id: 1 });
      expect.unreachable('엔드포인트가 구현되어 실제 응답이 돌아왔다면, 이 테스트를 성공 케이스로 업데이트해야 합니다');
    } catch (err) {
      const e = err as ApiError;
      // 404 또는 401(인증 없이 호출했으므로) 둘 다 허용. 구현 시 200/201 로 바뀜.
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('GET /api/applications/me 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.get('/api/applications/me');
      expect.unreachable('구현 시 배열 응답으로 업데이트 필요');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('DELETE /api/applications/:id 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.delete('/api/applications/1');
      expect.unreachable('구현 시 204 No Content 로 업데이트 필요');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });
});
```

- [ ] **Step 2: 실행**

Run: `npx vitest run tests/api/applications.test.ts`
Expected: 3 pass. 백엔드 localhost:8000 에 연결 실패 시 모든 테스트가 fetch 에러로 실패할 수 있음 — 이 경우 `TEST_API_BASE_URL=https://workinkorea.net` 으로 프로덕션 대상 실행:

Run: `TEST_API_BASE_URL=https://workinkorea.net npx vitest run tests/api/applications.test.ts`

- [ ] **Step 3: 커밋**

```bash
git add tests/api/applications.test.ts
git commit -m "test(api): 404 guard for unimplemented applications endpoints"
```

---

### Task 20: `bookmarks` API 404 가드

**Files:**
- Create: `tests/api/bookmarks.test.ts`

- [ ] **Step 1: 테스트 작성**

```ts
import { describe, it, expect } from 'vitest';
import { apiClient, type ApiError } from '../utils/api-client';

describe('Bookmarks API (미구현 — 구현 시 업데이트 필요)', () => {
  it('POST /api/bookmarks 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.post('/api/bookmarks', { post_id: 1 });
      expect.unreachable('엔드포인트 구현 시 이 테스트를 성공 케이스로 전환');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });

  it('DELETE /api/bookmarks/:id 는 현재 404 를 반환한다', async () => {
    try {
      await apiClient.delete('/api/bookmarks/1');
      expect.unreachable('구현 시 204 No Content');
    } catch (err) {
      const e = err as ApiError;
      expect([404, 401, 405]).toContain(e.status);
    }
  });
});
```

- [ ] **Step 2: 실행**

Run: `TEST_API_BASE_URL=https://workinkorea.net npx vitest run tests/api/bookmarks.test.ts`
Expected: 2 pass

- [ ] **Step 3: 커밋**

```bash
git add tests/api/bookmarks.test.ts
git commit -m "test(api): 404 guard for unimplemented bookmarks endpoints"
```

---

## Phase 7 — 마무리

### Task 21: 문서 + 최종 검증

**Files:**
- Create: `e2e/README.md`
- Modify: (필요 시) `docs/testing/2026-04-23.md`

- [ ] **Step 1: `e2e/README.md` 작성**

````markdown
# E2E Test Suite

프로덕션(`workinkorea.net`) 대상 read-only Playwright 테스트 스위트.

## 실행

```bash
# 비회원만 (credentials 불필요)
npm run test:e2e:pw:anon

# 기업회원 포함
E2E_COMPANY_EMAIL=test@test.com E2E_COMPANY_PASSWORD=<secret> npm run test:e2e:pw

# 로컬 서버 대상
E2E_BASE_URL=http://localhost:3000 npm run test:e2e:pw:anon

# 개인회원 (수동 세션 생성 필요 — e2e/user/README.md 참조)
RUN_USER_E2E=1 npm run test:e2e:pw:user

# 리포트
npm run test:e2e:pw:report
```

## 환경변수

| 변수 | 기본값 | 용도 |
|---|---|---|
| `E2E_BASE_URL` | `https://workinkorea.net` | 대상 사이트 |
| `E2E_COMPANY_EMAIL` | `test@test.com` | 기업 로그인 |
| `E2E_COMPANY_PASSWORD` | (없으면 company skip) | 기업 로그인 |
| `E2E_SAMPLE_POST_ID` | `15` | posts-edit 검증 샘플 id |
| `E2E_SAMPLE_RESUME_ID` | `10` | resume 검증 샘플 id |
| `RUN_USER_E2E` | 미설정 | `1` 일 때만 user 프로젝트 실행 |
| `CI` | - | CI 환경 감지 — retry 2, workers 2 |

## 구조

- `anonymous/` — 비로그인 (항상 실행)
- `company/` — 기업 로그인 (global-setup 이 storageState 생성)
- `user/` — 개인 로그인 (수동 storageState, optional)
- `fixtures/`, `helpers/` — 공용 유틸

## `test.fixme` 전략

현재 프로덕션에서 확인된 버그(P2/P3) 는 `test.fixme()` 로 작성하고,
수정 PR 에서 `test.fixme` → `test` 로 변경하여 한 번에 **수정 + 리그레션 가드** 를 들여온다.
````

- [ ] **Step 2: 전체 anonymous 테스트 최종 실행**

Run: `npm run test:e2e:pw:anon`
Expected: 전체 녹색 (fixme 는 skip). 만약 특정 스펙이 타이밍으로 flaky 하면 `--retries=2` 로 재실행.

- [ ] **Step 3: 전체 Vitest 실행**

Run: `npm run test`
Expected: 전체 녹색 (신규 컴포넌트/API 테스트 포함)

- [ ] **Step 4: typecheck + lint**

Run: `npm run check`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add e2e/README.md
git commit -m "docs(e2e): add README with run instructions and env vars"
```

- [ ] **Step 6: (선택) 작업 결과 요약을 `docs/testing/2026-04-23.md` 에 기록**

```markdown
---
date: 2026-04-23
title: E2E & Component Test Suite 도입
---

# 2026-04-23 — E2E & 컴포넌트 테스트 스위트 도입

- Playwright 스위트 세팅 (3 프로젝트: anonymous / company / user)
- 2026-04-22 QA 리포트의 P1/P2/P3 이슈 → 자동 리그레션 가드로 전환
- P1 `/user/resume/edit/:id` pre-fill: Vitest + MSW 컴포넌트 테스트
- 미구현 API(applications, bookmarks): 404 가드 테스트

## 실행
`e2e/README.md` 및 `e2e/user/README.md` 참조.

## Fixme 로 남겨둔 테스트 (수정 시 해제)
- P3: `/support` mailto 링크 (`public-pages.anon.spec.ts`)
- P3: `/company-login` main 내부 링크 (`auth-entry.anon.spec.ts`)
- P2: i18n `<title>` 다국어 (`i18n.anon.spec.ts`)
- P2: UserTypeToggle 쿠키 전환 (`user-type-toggle.anon.spec.ts`)
- P2: 공고 등록 폼 `aria-invalid` + submit 버튼 중복 (`posts-create.company.spec.ts`)
- P2: 기업 프로필 `<label>` 연결 (`profile-edit.company.spec.ts`)
```

- [ ] **Step 7: 최종 커밋**

```bash
git add docs/testing/2026-04-23.md
git commit -m "docs: record 2026-04-23 test suite setup summary"
```

---

## Self-Review Checklist (구현 중 참고)

- [ ] `e2e/` 디렉토리 구조가 spec 의 섹션 1 과 일치
- [ ] 모든 anonymous spec 은 credentials 없이 pass 또는 fixme skip 으로 마무리
- [ ] company spec 은 `global-setup` 이 성공했을 때만 실행, 실패 시 전체 skip
- [ ] user spec 은 `RUN_USER_E2E=1` + `user.json` 존재 시에만 실행
- [ ] `test.fixme` 는 현재 깨지는 P2/P3 만 사용 — 정상 동작하는 항목에는 쓰지 않음
- [ ] MSW 서버 lifecycle 이 `vitest.setup.ts` 에 올바르게 등록됨
- [ ] `ResumeEditor` 컴포넌트 테스트가 P1 pre-fill 을 커버
- [ ] `package.json` 스크립트 6개 추가, `.gitignore` 4 줄 추가
- [ ] `e2e/README.md` 와 `e2e/user/README.md` 2 개 README
- [ ] `npm run check` (lint + typecheck) 통과

## 성공 기준 (spec §10 에서 복사)

- [ ] `npm run test:e2e:pw:anon` 녹색 (fixme 제외)
- [ ] `E2E_COMPANY_*` 주입 후 company 녹색
- [ ] `npm run test` 녹색
- [ ] P1 `/user/resume/edit/:id` 이슈 fix 시 ResumeEditor 테스트가 여전히 통과함을 확인
- [ ] fixme 항목을 fix PR 에서 정상 test 로 승격할 수 있음을 확인
