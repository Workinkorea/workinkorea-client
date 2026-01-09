# Project Skills

## Token Refresh 패턴

- Promise 재사용 패턴 사용 (Queue 배열 대신)
- Proactive refresh: 만료 1분 전 사전 갱신
- TokenService 클래스로 캡슐화

## API Client 규칙

- axios interceptor로 토큰 자동 첨부
- skipAuth 옵션으로 인증 스킵 가능
- userType별 refresh 엔드포인트 분기 (user/company/admin)

## 코드 스타일

- TypeScript strict mode
- 전역 변수 최소화
- 클래스 기반 서비스 패턴 선호
