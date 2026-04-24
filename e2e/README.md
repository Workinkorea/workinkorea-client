# E2E Test Suite

프로덕션(`workinkorea.net`) 대상 read-only Playwright 테스트 스위트.

## 실행

```bash
# 비회원만 (credentials 불필요)
npm run test:e2e:pw:anon

# 기업회원 포함 (global-setup 이 자동 로그인)
E2E_COMPANY_EMAIL=test@test.com E2E_COMPANY_PASSWORD=<secret> npm run test:e2e:pw

# 로컬 개발 서버 대상
E2E_BASE_URL=http://localhost:3000 npm run test:e2e:pw:anon

# 개인회원 (수동 세션 생성 필요 — e2e/user/README.md 참조)
RUN_USER_E2E=1 npm run test:e2e:pw:user

# 리포트 보기
npm run test:e2e:pw:report

# UI 모드 (로컬 디버깅)
npm run test:e2e:pw:ui
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

## 프로젝트 구조

- `anonymous/` — 비로그인 (항상 실행)
- `company/` — 기업 로그인 (global-setup 이 storageState 생성)
- `user/` — 개인 로그인 (수동 storageState, `RUN_USER_E2E=1` 필요)
- `fixtures/`, `helpers/` — 공용 유틸

## `test.fixme` 전략

현재 프로덕션에서 확인된 버그(P2/P3) 는 `test.fixme()` 로 작성하고,
수정 PR 에서 `test.fixme` → `test` 로 변경하여 한 번에 **수정 + 리그레션 가드** 를 들여온다.

Fixme 로 남아있는 테스트 목록 (2026-04-23 기준):
- `/jobs` Server Components render error (production bug)
- `/support` mailto 링크 누락 (P3)
- `/company-login` main 내부 회원가입/개인로그인 링크 (P3)
- i18n EN 토글 시 `<title>` 미전환 (P2)
- UserTypeToggle 쿠키/히어로 전환 미동작 (P2)
- 공고 등록 폼 `aria-invalid` 미설정 (P2)
- 공고 등록 submit 버튼 DOM 중복 (P3)
- 기업 프로필 수정 axe label rule (P2)
