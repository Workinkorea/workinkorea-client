# Userflow + Tests + Storybook Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan.

**Goal:** 유저플로우 문서 작성, Storybook 설치+스토리 작성, 전체 테스트 코드(API/Unit/Flow) 작성

**Architecture:** 3개 독립 서브시스템을 병렬 실행. 유저플로우 문서 → Storybook 설치 → 테스트 코드 순서.

**Tech Stack:** Vitest, React Testing Library, Storybook 8 (Next.js), MSW (optional)

---

## Task 1: 유저플로우 문서 작성

**Files:**
- Create: `docs/userflow.md`

전체 유저플로우를 비회원/개인회원/기업회원 기준으로 작성. 백엔드 API 엔드포인트 매핑 포함.

---

## Task 2: Storybook 설치 + 설정

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Modify: `package.json`

---

## Task 3: shared/ui 컴포넌트 스토리 작성

**Files:**
- Create: `src/shared/ui/Button.stories.tsx`
- Create: `src/shared/ui/Input.stories.tsx`
- Create: `src/shared/ui/Modal.stories.tsx`
- Create: `src/shared/ui/Badge.stories.tsx`
- Create: `src/shared/ui/Card.stories.tsx`
- Create: `src/shared/ui/Skeleton.stories.tsx`
- Create: `src/shared/ui/EmptyState.stories.tsx`
- Create: `src/shared/ui/StatCard.stories.tsx`
- Create: `src/shared/ui/LoadingSpinner.stories.tsx`
- Create: `src/shared/ui/Callout.stories.tsx`
- Create: `src/shared/ui/IconButton.stories.tsx`
- Create: `src/shared/ui/Divider.stories.tsx`

---

## Task 4: 컴포넌트 단위 테스트 (B)

**Files:**
- Create/Update: `src/shared/ui/__tests__/Input.test.tsx`
- Create: `src/shared/ui/__tests__/Modal.test.tsx`
- Create: `src/shared/ui/__tests__/Badge.test.tsx`
- Create: `src/shared/ui/__tests__/Card.test.tsx`
- Create: `src/shared/ui/__tests__/EmptyState.test.tsx`
- Create: `src/shared/ui/__tests__/IconButton.test.tsx`
- Create: `src/shared/ui/__tests__/Skeleton.test.tsx`
- Create: `src/shared/ui/__tests__/LoadingSpinner.test.tsx`

---

## Task 5: API 연동 테스트 (A) — 프로덕션 스모크 포함

**Files:**
- Update: `tests/api/auth.test.ts`
- Update: `tests/api/profile.test.ts`
- Update: `tests/api/company-posts.test.ts`
- Create: `tests/api/smoke-production.test.ts`

---

## Task 6: 유저플로우 통합 테스트 (C)

**Files:**
- Create: `tests/flows/guest-flow.test.ts`
- Create: `tests/flows/user-flow.test.ts`
- Create: `tests/flows/company-flow.test.ts`
