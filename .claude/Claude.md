# WorkinKorea — Claude 작업 가이드

## 프로젝트 개요
외국인 구직자 ↔ 한국 기업 채용 플랫폼. Next.js 16 + FastAPI(:8000) + PostgreSQL, FSD 아키텍처.

---

## 아키텍처

```
FastAPI (:8000) → Next.js Route Handlers (src/app/api/**) → fetchClient → Components
```

**fetchClient** (`src/shared/api/fetchClient.ts` — 수정 금지)
- 서버: `SERVER_API_URL` (Docker 내부), 클라이언트: `""` (상대경로) 자동 감지
- `fetchClient.get/post/put/patch/delete<T>(url, options?)`
- `FetchError` (status, data), `normalizeError()` (isAuth/isNotFound/isServer)

---

## 캐싱 전략

| 데이터 | 전략 | 옵션 |
|--------|------|------|
| 공개 공고 목록/상세 | ISR | `{ next: { revalidate: 3600, tags: ['jobs'] } }` |
| 사용자 프로필/이력서/진단 | SSR | `{ cache: 'no-store' }` |
| 기업 프로필 | ISR | `{ next: { revalidate: 7200, tags: ['company'] } }` |

ISR 무효화: `POST /api/revalidate { "tag": "jobs", "secret": "..." }`

---

## 인증

- **refreshToken**: HttpOnly Cookie, **accessToken**: in-memory `tokenStore`, **userType**: Public Cookie
- 401 → `POST /api/auth/refresh` → 성공 시 재시도, 실패 시 로그인 리다이렉트
- JWT `type` 클레임: `access`→`/login`, `access_company`→`/company-login`, `admin_access`→`/admin/login`
- 미들웨어 보호: `/company/*`, `/user/*`, `/admin/*`

---

## API 엔드포인트 현황

### 구현됨
```
# Auth
GET  /api/auth/login/google[/callback]
POST /api/auth/signup, /auth/refresh, /auth/email/certify[/verify]
POST /api/auth/company/signup, /auth/company/login
DELETE /api/auth/logout

# Profile (User 인증)
GET/PUT /api/me, /api/contact, /api/account-config

# Company Profile (Company 인증)
GET/POST/PUT /api/company-profile

# Posts - Company
GET  /api/posts/company/list     공개 목록
GET  /api/posts/company          내 공고 (Company 인증)
GET  /api/posts/company/{id}     공개 상세
POST/PUT/DELETE /api/posts/company[/{id}]  (Company 인증)

# Posts - Resume (User 인증)
GET/POST /api/posts/resume, /posts/resume/list/me
GET/PUT/DELETE /api/posts/resume/{id}

# Diagnosis (User 인증)
POST /api/diagnosis/answer
GET  /api/diagnosis/answer/{id}
```

### 미구현 (서버 구현 필요)
| 기능 | 엔드포인트 | 우선순위 |
|------|-----------|--------|
| 채용 지원 | `POST /api/applications` | P0 |
| 지원 내역 | `GET /api/applications/me` | P0 |
| 지원 취소 | `DELETE /api/applications/{id}` | P1 |
| 지원자 목록 | `GET /api/posts/company/{id}/applicants` | P1 |
| 공개 기업 정보 | `GET /api/company/{id}` | P1 |
| 북마크 | `POST/DELETE /api/bookmarks` | P2 |

### Next.js Route Handlers (이 레포)
`GET /api/health`, `POST /api/revalidate`, `POST /api/verify-business`
> Route Handler는 시크릿 보호/ISR 재검증/파일 업로드/웹훅 수신 시만 작성. 일반 CRUD는 fetchClient 직접 사용.

---

## 타입 파일 위치

| 파일 | 용도 |
|------|------|
| `src/shared/types/api.ts` | FastAPI 요청/응답 타입 |
| `src/shared/types/common.types.ts` | UserInfo 등 공통 타입 |
| `src/shared/types/enums.ts` | 열거형 상수 |
| `src/shared/api/types.ts` | API 래퍼/에러 타입, 유틸 |
| `src/features/*/types/*.ts` | feature 내부 전용 |

타입 규칙: 필드명 `snake_case` 유지, Optional → `?:`, datetime → `string` (ISO 8601)

---

## 금지 사항
- `fetchClient.ts` 직접 수정
- `fetch()` 직접 호출
- `import React from 'react'` (React 19)
- `export default` (named export 사용)
- 하드코딩 API URL

---

## FSD 도메인 슬라이스

`auth` · `jobs` · `company` · `profile` · `resume` · `diagnosis` · `landing` · `admin` · `events` · `user` · `shared`

---

## 빠른 참조

```typescript
// Server ISR
const data = await fetchClient.get<T>('/api/endpoint', {
  next: { revalidate: 3600, tags: ['tag'] }
});

// Client (React Query)
const { data } = useQuery({
  queryKey: ['key', id],
  queryFn: () => fetchClient.get<T>(`/api/endpoint/${id}`),
});

// 에러 처리
const { isAuth, isNotFound, isServer, message } = normalizeError(error);

// 동적 Route Handler params (Next.js 16)
const { id } = await params; // params는 Promise
```

---

## 관련 Skills
- API 패턴: `.claude/skills/api-patterns/SKILL.md`
- 인증 패턴: `.claude/skills/auth-patterns/SKILL.md`
- FSD 패턴: `.claude/skills/fsd-patterns/SKILL.md`
- 디자인: `.claude/skills/design-patterns/SKILL.md`
