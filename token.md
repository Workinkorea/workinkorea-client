# 🔐 현재 로그인 토큰 관리 구조 정리

이 문서는 workinkorea-client 프로젝트에서 **개인(유저) 토큰 / 회사 토큰**이 어떻게 저장되고 관리되는지,  
그리고 **Axios 인터셉터 + useAuth 훅**이 어떤 방식으로 인증 흐름을 구성하는지 한눈에 볼 수 있게 정리한 문서입니다.

---

## 1. Token 저장/조회 레이어 — `tokenManager`

### ✔ 저장 키 구조

| 타입    | 저장 키              |
| ------- | -------------------- |
| user    | `accessToken`        |
| company | `companyAccessToken` |

---

## ✔ 저장 위치 (rememberMe 기반)

### 개인(User) 토큰

- `rememberMe = true` → `localStorage`
- `rememberMe = false` → `sessionStorage`
- 저장 시 반대 스토리지에서는 같은 키 삭제 → **중복 저장 방지**

조회 시:

- `localStorage` 우선 → 없으면 `sessionStorage`

### 회사(Company) 토큰

개인 토큰과 구조 동일.  
키만 다르고 저장되는 방식은 동일합니다.

---

## ✔ 공통 제공 메서드

- `setToken(token, type, rememberMe)`
- `getToken(type)`
- `removeToken(type)`
- `clearAllTokens()`

유효성 관련:

- `isTokenValid(type)`
- `isTokenExpiringSoon(type)`
- `getTokenRemainingTime(type)`
- `isTokenInLocalStorage(type)`

tokenManager는 **저장소 + JWT 만료 계산**만 담당하고,  
Refresh / 재시도 / 라우팅 가드는 다른 레이어에서 수행됩니다.

---

# 2. HTTP 인증 레이어 — `apiClient` (Axios 기반)

## ✔ 유효한 토큰 자동 선택

```ts
getValidToken() {
  // user → company 순으로 유효한 토큰을 자동 선택
}
```

우선순위:

1. 유효한 유저 토큰
2. 유효한 회사 토큰
3. 없으면 null

---

## ✔ 요청 인터셉터 (Request Interceptor)

모든 API 요청에 자동으로 Authorization 헤더를 붙입니다.

```ts
Authorization: Bearer<token>;
```

옵션:

- `{ skipAuth: true }` → Authorization 헤더 없이 호출 (login, signup, refresh 등에 사용)

---

## ✔ 응답 인터셉터 (Response Interceptor)

401(토큰 만료) 발생 시 자동 처리.

### 흐름

1. 첫 401 → refresh 시도
2. refresh 중이면 → 현재 요청은 큐에 저장 후 refresh 종료될 때 재시도
3. refresh 성공 → 큐에 있던 요청 모두 재실행
4. refresh 실패 → 자동 로그아웃

### 자동 로그아웃 규칙

- user 토큰 만료 → `/login` 이동
- company 토큰 만료 → `/company-login` 이동

---

# 3. 페이지 인증 상태 레이어 — `useAuth`

`useAuth`는 **페이지 단위 인증 제어**를 담당하며 다음 역할을 가집니다.

---

## ✔ 주요 기능

### 1) 경로 기반 인증 판단

- 로그인 페이지(`/login`, `/signup` 등)에서는 토큰 검사하지 않음
- `PROTECTED_PATHS` 또는 `required: true` 옵션이 있는 페이지는 **로그인 필수**

---

### 2) 토큰 유효성 검사 및 user/company 타입 판정

```ts
if (valid user token) userType = 'user'
else if (valid company token) userType = 'company'
```

---

### 3) 토큰 만료 전 자동 refresh (타이머 기반)

- 남은 시간이 5분 이하 → 50% 시점에 refresh
- 남은 시간이 충분 → 만료 5분 전에 refresh
- refresh 실패 시 인증 해제

---

### 4) login / logout 동작

- login: 토큰 저장 + refresh 타이머 등록
- logout: 토큰 제거 + 서버에 로그아웃 요청

---

# 🔎 전체 구조 요약

| 레이어                | 역할                                                                |
| --------------------- | ------------------------------------------------------------------- |
| **tokenManager**      | 저장소(local/session) 관리, 토큰 타입 분리(user/company), 만료 계산 |
| **apiClient (Axios)** | 요청 자동 토큰 부착, 401 자동 refresh, refresh 실패 자동 로그아웃   |
| **useAuth**           | 페이지 인증 여부 결정, 토큰 상태 제공, refresh 타이머 관리          |

---

# 📌 현재 아키텍처의 특징

- 개인/회사 토큰을 **완전 분리**하면서도 “유효한 것만 자동 선택”
- Axios 인터셉터가 모든 인증 오류를 자동 처리해 **페이지 로직 단순화**
- useAuth 훅은 UI단 인증 상태 관리자가 되어 역할 분리 선명함

---

# 📘 향후 개선 가능 포인트

- useAuth에서 refresh 로직 완전히 제거하고 **axios 인터셉터만으로 refresh 처리 일원화**
- 로그인/로그아웃 후 리다이렉트 규칙 통일화
- 회사/유저 인증을 하나의 `authContext`로 묶는 방식도 가능

---

이 문서(token.md)는 프로젝트의 인증 시스템을 유지·확장할 때 기준이 되는 문서입니다.
