---
date: 2026-04-23
title: E2E & Component Test Suite 설계
target: workinkorea.net (프로덕션) + 로컬 컴포넌트 레벨
tools: Playwright, Vitest, @axe-core/playwright, MSW
owner: 장석원
---

# E2E & Component Test Suite 설계 — 2026-04-23

2026-04-22 수동 QA 리포트에서 드러난 P1/P2/P3 이슈들을 **자동화된 리그레션 가드**로 코드화하기 위한 테스트 스위트 설계 문서.

## 목표

1. 프로덕션(`workinkorea.net`) 에 대해 **read-only smoke + 리그레션 가드** 를 자동화한다.
2. QA 리포트의 P1 이슈(특히 `/user/resume/edit/:id` pre-fill 실패) 가 다시 발생하면 즉시 CI 또는 로컬에서 잡는다.
3. 파괴적(쓰기) 플로우는 E2E 에서 다루지 않고 **Vitest API / 컴포넌트 테스트** 로 대체한다.
4. 구글 OAuth 는 자동화하지 않되, **redirect 파라미터 smoke + storageState 기반 read-only E2E + 컴포넌트 단위 리그레션** 3단 구조로 커버한다.

## 범위 — 하이브리드 전략

| 레이어 | 대상 | 실행 환경 |
|---|---|---|
| Playwright E2E (프로덕션) | 비회원 + 기업회원 (이메일/비번) | `https://workinkorea.net` |
| Playwright E2E (선택적) | 개인회원 | storageState 있을 때만 |
| Vitest 컴포넌트 (MSW) | pre-fill, 라우터, a11y | JSDom/happy-dom |
| Vitest API (기존) | API 쓰기 플로우 | `localhost:8000` |

---

## 1. 디렉토리 구조

```
e2e/
├── playwright.config.ts
├── global-setup.ts                   기업 로그인 후 storageState 생성
├── .auth/                            (.gitignore)
│   ├── company.json
│   └── user.json                     (수동 생성, optional)
├── fixtures/
│   ├── test-data.ts
│   └── base.ts                       axe 주입 Playwright fixture
├── helpers/
│   ├── auth.ts
│   ├── a11y.ts
│   └── selectors.ts
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
└── user/                             storageState 존재 시 실행
    ├── profile.user.spec.ts
    ├── resume.user.spec.ts
    └── applications.user.spec.ts
```

### 기존 테스트와의 관계

- `tests/api/` (Vitest, 기존) — 그대로 유지. API 스모크/쓰기 플로우 담당.
- `tests/flows/` (Vitest, 기존) — 기존 skip 된 user/company 플로우에 대한 실제 구현 추가.
- **신규**: `src/features/**/*.test.tsx` (Vitest + MSW) — 컴포넌트 레벨 pre-fill 검증.

---

## 2. Playwright 설정

### `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';
const RUN_USER_E2E = process.env.RUN_USER_E2E === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : 'list',
  globalSetup: require.resolve('./e2e/global-setup.ts'),

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'anonymous',
      testDir: './e2e/anonymous',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'company',
      testDir: './e2e/company',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/company.json',
      },
    },
    {
      name: 'user',
      testDir: './e2e/user',
      testIgnore: RUN_USER_E2E ? [] : [/.*/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
    },
  ],
});
```

### `global-setup.ts` — 기업 로그인 자동화

```ts
import { chromium, FullConfig } from '@playwright/test';

export default async function globalSetup(_: FullConfig) {
  const email = process.env.E2E_COMPANY_EMAIL;
  const password = process.env.E2E_COMPANY_PASSWORD;
  const baseURL = process.env.E2E_BASE_URL ?? 'https://workinkorea.net';

  if (!email || !password) {
    console.warn('[global-setup] E2E_COMPANY_EMAIL/PASSWORD 미설정 → company 프로젝트 skip 예상');
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto('/company-login');
  await page.getByLabel(/이메일/i).fill(email);
  await page.getByLabel(/비밀번호/i).fill(password);
  await page.getByRole('button', { name: /로그인/i }).click();
  await page.waitForURL('**/company**', { timeout: 15_000 });
  await context.storageState({ path: 'e2e/.auth/company.json' });
  await browser.close();
}
```

매 실행마다 새 세션으로 로그인 → storageState 파일 만료 이슈 없음. 실패 시 `company` 프로젝트 전체 skip (storageState 파일 없음으로 Playwright 가 자동 감지).

---

## 3. QA 이슈 → 테스트 매핑

| QA 이슈 | 우선순위 | 레이어 | 파일 |
|---|---|---|---|
| `/user/resume/edit/:id` pre-fill 실패 | P1 | Vitest 컴포넌트 | `src/features/resume/components/ResumeEditor.test.tsx` |
| `/user/applications` 미구현 | P1 | Vitest API + Playwright | `tests/api/applications.test.ts` + `user/applications.user.spec.ts` |
| 미들웨어 bridge 쿠키 redirect 오작동 | P1 | Playwright anon | `protected-routes.anon.spec.ts` |
| `/company/applicants` 미구현 | P1 | Playwright company | `applicants.company.spec.ts` |
| `UserTypeToggle` 미동작 | P2 | Playwright anon | `user-type-toggle.anon.spec.ts` (fixme) |
| i18n `<title>` 한국어 고정 | P2 | Playwright anon | `i18n.anon.spec.ts` (fixme) |
| `aria-invalid` 누락 | P2 | Playwright + axe | `posts-create.company.spec.ts` |
| `<label>` 태그 누락 | P2 | Playwright + axe | `profile-edit.company.spec.ts` |
| `/user/settings` redirect | P2 | Playwright user | `profile.user.spec.ts` |
| `/api/bookmarks` 미구현 | P2 | Vitest API | `tests/api/bookmarks.test.ts` |
| submit 버튼 중복 렌더 | P3 | Playwright company | `posts-create.company.spec.ts` |
| `/support` mailto 누락 | P3 | Playwright anon | `public-pages.anon.spec.ts` (fixme) |
| `/company-login` main 링크 누락 | P3 | Playwright anon | `auth-entry.anon.spec.ts` (fixme) |

### `test.fixme()` 정책

**현재 프로덕션에서 실패가 확인된 P2/P3 이슈**는 `test.fixme(title, fn)` 으로 작성한다.

- 테스트 본문은 **올바른 동작** 을 검증하도록 작성 (수정 후 기대값)
- `fixme` 는 Playwright 가 "알려진 실패" 로 보고, 실패해도 CI 레드 안 함
- 이슈 수정 PR 에서 `fixme` → `test` 로 변경 — 한 커밋에서 수정과 리그레션 가드가 함께 들어옴
- 현재 깨진 항목: `i18n <title>`, `UserTypeToggle`, `support mailto`, `company-login main 링크`

`/user/resume/edit/:id` P1 도 동일 원칙 — Vitest 컴포넌트 테스트에서 `it.fails()` 가 아니라 실제 버그 수정과 함께 테스트를 `.skip` 해제하는 방식.

---

## 4. Spec별 핵심 검증 내용

### `anonymous/public-pages.anon.spec.ts`
- 루프: `['/', '/jobs', '/faq', '/terms', '/privacy', '/support']` 각각 → `<h1>` 존재, 콘솔 에러 0건, 404/500 응답 없음
- Footer 5개 링크 href 검증
- `/support` → `a[href^="mailto:"]` 존재 (fixme, P3)
- 이미지 브로큰 감시: `page.on('response', r => r.status() >= 400 ...)`

### `anonymous/auth-entry.anon.spec.ts`
- `/login-select`: 개인/기업 카드 링크 → `/login`, `/company-login`
- `/login`: Google OAuth 버튼, 기업/회원가입 보조 링크
- `/company-login`: 이메일/비번/자동로그인 체크박스 필드 존재
- `/company-login` main 내부 "회원가입"/"개인 로그인" 링크 (fixme, P3)
- `/signup-select`: 2개 카드
- `/company-signup/step1`: 약관 체크박스 6개

### `anonymous/protected-routes.anon.spec.ts` — **P1 핵심**
- 루프: 전 보호 라우트 (`/user/profile`, `/user/resume`, `/user/applications`, `/user/bookmarks`, `/company/jobs`, `/company/posts/create`, `/company/profile/edit`, `/company/applicants`, `/company/settings`) → `/login-select?callbackUrl=...` 리다이렉트 검증
- **bridge 쿠키 재현 시나리오**:
  ```ts
  test('만료된 userTypeClient=company 쿠키가 있어도 /signup-select 진입 허용', async ({ context, page }) => {
    await context.addCookies([{ name: 'userTypeClient', value: 'company',
      domain: 'workinkorea.net', path: '/', httpOnly: false }]);
    await page.goto('/signup-select');
    expect(page.url()).toContain('/signup-select');
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible();
  });
  ```

### `anonymous/oauth-redirect.anon.spec.ts`
- `/login` 이동 → "Google로 시작하기" 버튼 클릭 이벤트 감지
- `page.route('**/accounts.google.com/**', r => r.abort())` 로 실제 도달 차단
- Playwright `waitForRequest` 로 Google OAuth URL 파라미터 검증:
  - `client_id` 존재
  - `redirect_uri` 가 `workinkorea.net/auth/callback` 포함
  - `scope` 에 `email`, `profile` 포함

### `anonymous/self-diagnosis.anon.spec.ts`
- `/self-diagnosis` → 5단계 한국어 수준 radio 그룹
- "시작하기" 클릭 → `/diagnosis` 이동
- 1단계 10개 radio 선택 → "다음" 클릭 → 다음 스텝 렌더

### `anonymous/i18n.anon.spec.ts` — P2 fixme
- `/` 접근 → `<html lang="ko">` 확인
- 언어 토글 `EN` 클릭 → `<html lang="en">`, `document.title` 영어로 변경 **(fixme)**

### `anonymous/user-type-toggle.anon.spec.ts` — P2 fixme
- 헤더 "기업" 버튼 클릭 → `userTypeClient` 쿠키 값 `company` 로 변경 **(fixme)**
- 히어로 문구 기업용으로 변경 **(fixme)**

### `company/dashboard.company.spec.ts`
- `/company` → KPI 카드 4개 (진행 공고, 전체 지원자, 미검토 지원, 전체 공고) 렌더
- 진행중인 채용 공고 카드 존재
- 기업 정보 카드 (전화번호 포함) 렌더

### `company/jobs-list.company.spec.ts`
- `/company/jobs` → "채용 공고 관리" 헤딩
- "전체 공고 (N개)" 카운트 패턴 매칭
- "등록" 버튼 존재

### `company/posts-create.company.spec.ts` — **P2/P3 핵심**
- `/company/posts/create` → 4개 섹션 헤딩 렌더
- **필수값 검증**: 빈 상태 submit → 4종 에러 메시지 노출, URL 미변경
- **a11y**: `axe(page)` 실행 → `aria-invalid` violation 리포팅 (P2, fixme 상태로 감시)
- **DOM 개수**: `page.locator('button:has-text("공고 등록하기")').count()` → 현재 3 이지만 1 로 수정 시 리그레션 가드 (P3, fixme)
- **실제 등록은 수행하지 않음** — 프로덕션 DB 오염 방지

### `company/posts-edit.company.spec.ts` — read-only
- `/company/posts/edit/15` (QA 리포트에서 확인된 ID) 진입
- title / 근무시간 / 연봉 / textarea pre-fill 값 assert
- "수정하기", "삭제" 버튼 존재 (클릭은 하지 않음)

### `company/profile-edit.company.spec.ts`
- pre-fill 값 검증 (industry_type, email, phone_number)
- `axe(page, { runOnly: { type: 'rule', values: ['label'] } })` 실행 → label violation 개수 assert (P2, fixme)

### `company/applicants.company.spec.ts`
- `/company/applicants` → "지원자 관리 기능 준비 중" placeholder 텍스트 노출 확인
- 백엔드 구현 후 실제 테이블 테스트로 전환 예정

### `company/settings.company.spec.ts`
- `/company/settings` → 활성 링크: "기업 프로필 편집"
- 비활성 항목: "비밀번호 변경(예정)", "알림 설정(예정)", "결제/구독 관리(예정)"

### `user/profile.user.spec.ts` (storageState 있을 때만)
- `/user/profile` → 프로필 카드, 레이더 차트 컨테이너 렌더
- `/user/settings` → `/user/profile/edit` 로 리다이렉트 (P2 확인)

### `user/resume.user.spec.ts`
- `/user/resume` → 등록된 이력서 카드 존재

### `user/applications.user.spec.ts`
- `/user/applications` → "지원 내역 기능 준비 중" placeholder (구현 전)

---

## 5. Vitest 신규 파일

### `src/features/resume/components/ResumeEditor.test.tsx` — **P1 리그레션**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ResumeEditor pre-fill (P1 리그레션)', () => {
  it('GET /api/posts/resume/:id 응답을 받으면 title 필드에 값이 채워진다', async () => {
    server.use(
      http.get('/api/posts/resume/10', () => HttpResponse.json({
        id: 10,
        title: 'QA 테스트 이력서 (수정됨)',
        profile_url: '',
        language_skills: [{ language: 'ko', level: 'native' }],
        schools: [],
        career_history: [],
        introduction: [],
        licenses: [],
      })),
    );

    const client = new QueryClient({ defaultOptions: { queries: { retry: false }}});
    render(
      <QueryClientProvider client={client}>
        <ResumeEditor resumeId={10} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/제목/i)).toHaveValue('QA 테스트 이력서 (수정됨)');
    });
  });

  it('field array 항목(language_skills) 도 pre-fill 된다', async () => {
    // 동일 패턴
  });
});
```

### `src/features/profile/components/ProfileEditor.test.tsx`
- 유사 패턴 — `GET /api/me` mock → form value assertion

### `tests/api/applications.test.ts`
- `POST /api/applications`, `GET /api/applications/me`, `DELETE /api/applications/:id` 현재 404 검증
- 백엔드 구현 후: 실제 생성/조회/취소 플로우로 전환

### `tests/api/bookmarks.test.ts`
- `POST /api/bookmarks`, `DELETE /api/bookmarks/:id` 현재 404 검증

---

## 6. 의존성

```bash
npm i -D @playwright/test @axe-core/playwright msw
npx playwright install chromium
```

`package.json` scripts 추가:
```json
"test:e2e:pw": "playwright test",
"test:e2e:pw:anon": "playwright test --project=anonymous",
"test:e2e:pw:company": "playwright test --project=company",
"test:e2e:pw:ui": "playwright test --ui"
```

`.gitignore` 추가:
```
e2e/.auth/
test-results/
playwright-report/
playwright/.cache/
```

`vitest.setup.ts` — MSW 서버 핸들러 등록 (현재 파일 재사용).

---

## 7. 실행 가이드

### 로컬 개발

```bash
# 비회원만 (credential 불필요, 가장 빠름)
npm run test:e2e:pw:anon

# 기업회원 포함 (환경변수 필요)
E2E_COMPANY_EMAIL=test@test.com E2E_COMPANY_PASSWORD=xxx npm run test:e2e:pw

# 로컬 Next 서버 대상으로 실행
E2E_BASE_URL=http://localhost:3000 npm run test:e2e:pw:anon

# 개인회원 플로우 (storageState 수동 생성 후)
npx playwright open --save-storage=e2e/.auth/user.json https://workinkorea.net/login
# → 사용자가 Google 로그인 완료 후 브라우저 닫기
RUN_USER_E2E=1 npm run test:e2e:pw

# 컴포넌트/API 테스트
npm run test               # 전체 Vitest
npm run test:unit          # src/ 만
npm run test:e2e           # tests/api/ 만
```

### CI (이번 스코프 외, 별도 PR)

- `.github/workflows/e2e.yml` 작성 예정
- `anonymous` + `company` 프로젝트만 자동 실행
- Secrets: `E2E_COMPANY_EMAIL`, `E2E_COMPANY_PASSWORD`
- `user` 프로젝트는 `workflow_dispatch` 수동 트리거로만

---

## 8. 이번 작업의 산출물 (deliverables)

1. `e2e/playwright.config.ts`, `e2e/global-setup.ts`
2. `e2e/fixtures/`, `e2e/helpers/` 헬퍼 유틸
3. `e2e/anonymous/` 7개 spec 파일
4. `e2e/company/` 7개 spec 파일
5. `e2e/user/` 3개 spec skeleton (내용은 구현, storageState 없을 때 전체 skip)
6. `src/features/resume/components/ResumeEditor.test.tsx`
7. `src/features/profile/components/ProfileEditor.test.tsx`
8. `tests/api/applications.test.ts`
9. `tests/api/bookmarks.test.ts`
10. `package.json` 스크립트, `.gitignore` 업데이트
11. `tests/flows/user-flow.test.ts` / `company-flow.test.ts` 기존 skip 테스트 중 token 불필요한 항목 실구현 전환

## 9. 이번 작업 제외 (out of scope)

- GitHub Actions CI 워크플로 파일 — 별도 PR
- 백엔드 `POST /api/auth/test-login` 엔드포인트 — 장기 로드맵
- 실제 공고 등록/이력서 저장 같은 프로덕션 쓰기 플로우 — 영구 제외
- 모바일 viewport 테스트 — 향후 확장

---

## 10. 성공 기준

- [ ] `npm run test:e2e:pw:anon` — 프로덕션 대상 전 anonymous 테스트 녹색 (fixme 제외)
- [ ] `E2E_COMPANY_*` 주입 후 company 프로젝트 녹색
- [ ] `npm run test` — 신규 컴포넌트 테스트 포함 전체 Vitest 녹색
- [ ] QA 리포트 P1 이슈 (`/user/resume/edit/:id` pre-fill) 수정 시 Vitest 컴포넌트 테스트가 실패→통과 전환됨을 확인
- [ ] `fixme` 마킹된 P2/P3 항목이 수정 PR 에서 정상 테스트로 승격됨을 확인
