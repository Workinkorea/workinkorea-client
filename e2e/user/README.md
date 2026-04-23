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
