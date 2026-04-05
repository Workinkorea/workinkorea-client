# UI 리디자인 & i18n 전체 적용 — 설계 스펙

**날짜**: 2026-04-05
**브랜치**: feat/seo-mesaages
**범위**: 헤더 토글 UI 리디자인, i18n 미적용 페이지 일괄 적용, CompanyLandingPage 가짜 데이터 제거

---

## Task 1 — 헤더 토글 UI 리디자인

### 대상 컴포넌트
- `src/shared/components/UserTypeToggle.tsx`
- `src/shared/components/LanguageToggle.tsx`

### 디자인 방향 (Approach A — Filled active)

**공통 pill 컨테이너**
```
border border-slate-200 rounded-full bg-white p-0.5
```

**활성 버튼 (active state)**
```
bg-blue-600 text-white rounded-full
(Framer Motion layoutId spring 유지)
```

**비활성 버튼 (inactive state)**
```
text-slate-500 hover:text-slate-700 transition-colors
```

### UserTypeToggle 변경사항
- pill 토글 구조 유지
- 아이콘(User, Building2) 유지 — 의미 전달에 필요
- Framer Motion `layoutId="user-type-bg"` 배경 → `bg-blue-600` 으로 변경
- 활성 텍스트 → `text-white`, 비활성 → `text-slate-500`
- 컨테이너 배경 → `bg-slate-100` → `bg-white border border-slate-200`

### LanguageToggle 변경사항
- 이모지(🇰🇷, 🌐) 제거 → 텍스트 `KO` / `EN` 만 표시
- 동일한 Approach A 스타일 적용
- `variant` prop(light/dark) 유지 — dark 헤더 대응
  - dark variant container: `border-slate-600 bg-transparent`
  - dark active: `bg-blue-600 text-white`
  - dark inactive: `text-slate-400 hover:text-slate-200`

---

## Task 2 — i18n 미적용 페이지 일괄 적용 (admin 제외)

### 적용 대상 및 네임스페이스

| 파일 | 네임스페이스 | 상태 |
|------|------------|------|
| `features/auth/components/LoginContent.tsx` | `auth.login` | 키 일부 존재, 보완 |
| `features/company/pages/CompanyLandingPage.tsx` | `company.landing` | 신규 |
| `features/diagnosis/pages/DiagnosisClient.tsx` | `diagnosis.client` | 신규 (제목, 부제목, toast 에러) |
| `features/jobs/pages/CompanyPostCreateClient.tsx` | `jobs.postCreate` | 신규 (toast 메시지) |
| `features/jobs/pages/JobDetailActions.tsx` | `jobs.detail` | `backToList` 키 이미 존재 — 연결만 필요 |
| `features/resume/components/ResumeEditor.tsx` | `resume.editor` | 신규 |
| `features/resume/components/TemplateSelector.tsx` | `resume.template` | 신규 |
| `features/auth/components/BusinessSignupStep1.tsx` | `auth.companySignup` | 키 일부 존재 |

### 작업 방식
1. 각 파일의 하드코딩 한국어/영어 텍스트 식별
2. `messages/ko.json` + `messages/en.json`에 키 추가
3. `useTranslations(namespace)` 훅 주입
4. 하드코딩 문자열을 `t('key')` 호출로 교체

### 규칙
- 서버 컴포넌트: `getTranslations()` (async)
- 클라이언트 컴포넌트: `useTranslations()` (hook)
- 현재 파일 모두 `'use client'` → `useTranslations` 사용
- 신규 키는 기존 네임스페이스 구조에 병합

---

## Task 3 — CompanyLandingPage 가짜 데이터 제거

### 대상: `features/company/pages/CompanyLandingPage.tsx`

**제거할 섹션**
- 채용 현황 통계 카드 (12,000+, 580,000+, 48,000+, 4.8★) → 섹션 전체 삭제
- 고객센터 카드 (02-0000-0000, help@workinkorea.net, 평일 09:00~18:00) → 섹션 전체 삭제

**관련 코드 정리**
- `stats` 배열 및 렌더링 코드 제거
- 고객센터 렌더링 블록 제거
- 사용하지 않게 되는 lucide import (`Phone`, `Mail`, `Clock`) 제거

---

## 체크리스트

### Task 1
- [ ] `UserTypeToggle` 스타일 업데이트
- [ ] `LanguageToggle` 이모지 제거 + 스타일 업데이트

### Task 2
- [ ] `LoginContent.tsx` i18n 적용
- [ ] `CompanyLandingPage.tsx` i18n 적용
- [ ] `DiagnosisClient.tsx` i18n 적용
- [ ] `CompanyPostCreateClient.tsx` i18n 적용
- [ ] `JobDetailActions.tsx` i18n 적용
- [ ] `ResumeEditor.tsx` i18n 적용
- [ ] `TemplateSelector.tsx` i18n 적용
- [ ] `BusinessSignupStep1.tsx` i18n 적용
- [ ] `ko.json` 신규 키 추가
- [ ] `en.json` 신규 키 추가

### Task 3
- [ ] `CompanyLandingPage` 통계 섹션 제거
- [ ] `CompanyLandingPage` 고객센터 섹션 제거
- [ ] 미사용 import 정리
