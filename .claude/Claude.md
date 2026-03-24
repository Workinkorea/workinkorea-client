# Work in Korea - 핵심 가이드

## 1. 프로젝트 스택 & 아키텍처

- **Client**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS 4
- **Server**: FastAPI, SQLAlchemy 2.0, PostgreSQL, Redis, MinIO
- **Architecture**: FSD (Feature-Sliced Design)
- **State**: Zustand (전역 클라이언트/인증), React Query (서버 데이터)

## 2. 디자인 시스템 (Blue Design)

- **Colors**: Primary `blue-600`, Text `slate-800`, Bg `white`
- **Typography**:
  - `Pretendard` (본문), `Plus Jakarta Sans` (로고/브랜드)
  - ⚠️ **절대 규칙**: 임의의 픽셀(`text-[13px]`)이나 Tailwind 기본 크기(`text-sm`) **사용 금지**. 반드시 Canonical 클래스 사용 (`text-display-1`, `text-title-2`, `text-body-1`, `text-caption-1` 등)
- **Spacing/Radius**: 4배수 간격, radius `sm`~`full`

## 3. 개발/배포 규칙

- **모듈/컴포넌트**: ES 모듈, Named export 지향, `React.FC` 및 `import React` 금지 (React 19)
- **레이아웃**: `page.tsx` 내부에서 `max-w-*` 직접 사용 금지. 반드시 `layout.tsx`에서 주입.
- **성능/최적화**: React Compiler(자동 메모이제이션), `next/image` 필수, `next/dynamic` 적극 활용.

## 4. 폴더 구조 (FSD 요약)

- `app/`: 라우팅 및 페이지 레이아웃 (`(admin)`, `(auth)`, `(main)`)
- `features/`: 11개 도메인 슬라이스 (admin, auth, company, diagnosis, jobs, 등)
- `shared/`: 공용 API, 컴포넌트, UI, 훅, 상수, 유틸

---

## 🤖 Claude AI 작업 지침 및 참조 파일

이 프로젝트에서 코드를 작성하거나 수정할 때는 본 가이드를 우선 숙지하고, **작업 맥락에 맞는 아래의 상세 가이드 파일을 반드시 먼저 읽으세요.**

### 📚 Core Guidelines (핵심 참조)

- **상태 관리 및 커스텀 훅 가이드**: `.claude/skills/hooks-patterns.md` 읽기
- **UI 컴포넌트 및 디자인 패턴 가이드**: `.claude/skills/ui-patterns.md` 읽기

### 🕵️‍♂️ Agents

- @.claude/agents/auth-specialist.md
- @.claude/agents/nextjs-specialist.md
- @.claude/agents/code-reviewer.md
- @.claude/agents/debugger.md
- @.claude/agents/feature-architect.md
- @.claude/agents/planner.md
- @.claude/agents/testing-specialist.md
- @.claude/agents/ui-specialist.md

### 🛠️ Skills (Patterns)

- @.claude/skills/api-patterns/SKILL.md
- @.claude/skills/auth-patterns/SKILL.md
- @.claude/skills/design-patterns/SKILL.md
- @.claude/skills/form-patterns/SKILL.md
- @.claude/skills/fsd-patterns/SKILL.md
- @.claude/skills/testing-patterns/SKILL.md
- @.claude/skills/hooks-patterns.md
- @.claude/skills/ui-patterns.md
