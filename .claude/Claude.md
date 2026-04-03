# Work in Korea — PM 가이드

## 프로젝트 개요

**Work in Korea**는 외국인 구직자와 한국 기업을 연결하는 채용 플랫폼이다.

| 구분 | 내용 |
|------|------|
| 핵심 사용자 | 구직자(외국인), 기업 담당자, 관리자 |
| 핵심 가치 | 언어 장벽 없는 취업 매칭 |
| 기술 스택 | Next.js 16 + FastAPI + PostgreSQL |
| 아키텍처 | FSD (Feature-Sliced Design), 11개 도메인 슬라이스 |

---

## 기능 도메인 맵

| 도메인 슬라이스 | 비즈니스 목적 | 주요 사용자 |
|---------------|------------|-----------|
| `auth` | 회원가입/로그인 (Google OAuth + 이메일) | 구직자, 기업 |
| `jobs` | 채용공고 탐색·필터·상세 조회 | 구직자 |
| `company` | 기업 대시보드, 공고 관리 | 기업 담당자 |
| `profile` | 구직자 프로필 관리 | 구직자 |
| `resume` | 이력서 작성·편집 | 구직자 |
| `diagnosis` | 직무 적합도 자가진단 | 구직자 |
| `landing` | 랜딩/홈 페이지 | 미인증 방문자 |
| `admin` | 사용자·기업·공고 관리 | 관리자 |
| `events` | 채용 이벤트/공지 | 전체 |
| `user` | 마이페이지 (지원 내역 등) | 구직자 |
| `shared` | 공통 컴포넌트, API 유틸 | — |

---

## API 현황 (실제 서버 기반)

### 구현 완료된 엔드포인트

```
# Auth
GET  /api/auth/login/google
GET  /api/auth/login/google/callback
POST /api/auth/signup
DELETE /api/auth/logout
POST /api/auth/refresh
POST /api/auth/email/certify
POST /api/auth/email/certify/verify
POST /api/auth/company/signup
POST /api/auth/company/login

# Profile (구직자, 인증 필요)
GET  /api/me           → 프로필 조회
PATCH /api/me          → 프로필 수정 (일부 필드만 가능)
GET  /api/contact      → 연락처 조회
PATCH /api/contact     → 연락처 수정
GET  /api/account-config
PATCH /api/account-config

# Company Profile
GET  /api/company-profile
POST /api/company-profile
PATCH /api/company-profile

# Posts - Company (채용공고)
GET  /api/posts/company/list     → 공개 채용공고 목록 (skip/limit)
GET  /api/posts/company          → 내 회사 공고 목록 (기업 인증)
GET  /api/posts/company/{id}     → 공고 상세 (공개)
POST /api/posts/company          → 공고 생성 (기업 인증)
PUT  /api/posts/company/{id}     → 공고 수정 (기업 인증)
DELETE /api/posts/company/{id}   → 공고 삭제 (기업 인증)

# Posts - Resume (이력서)
GET  /api/posts/resume/list/me   → 내 이력서 목록 (인증)
GET  /api/posts/resume/{id}      → 이력서 상세 (인증)
POST /api/posts/resume           → 이력서 생성 (인증)
PUT  /api/posts/resume/{id}      → 이력서 수정 (인증)
DELETE /api/posts/resume/{id}    → 이력서 삭제 (인증)

# Diagnosis
POST /api/diagnosis/answer       → 진단 답변 저장
GET  /api/diagnosis/answer/{id}  → 진단 결과 조회
```

### 미구현 (서버 구현 필요)

| 기능 | 예상 엔드포인트 | 우선순위 |
|------|--------------|--------|
| 채용공고 지원 | `POST /api/applications` | P0 |
| 지원 내역 조회 | `GET /api/applications/me` | P0 |
| 지원 취소 | `DELETE /api/applications/{id}` | P1 |
| 공고에 달린 지원자 목록 | `GET /api/posts/company/{id}/applicants` | P1 |
| 북마크 저장/삭제 | `POST/DELETE /api/bookmarks` | P2 |
| 공개 기업 정보 조회 | `GET /api/company/{id}` | P1 |

---

## PM 작업 가이드

### Acceptance Criteria 작성 원칙

- **Given/When/Then** 형식 사용
- 각 AC는 하나의 행동만 검증
- Happy path + Edge case 모두 포함
- API 응답 코드까지 명시 (200/201/400/401/404)

### AC 템플릿

```markdown
## Feature: [기능명]

### Scenario: [시나리오명]
**Given** [사전 조건]
**When** [사용자 액션]
**Then** [기대 결과]

### Edge Cases
- [ ] 빈 입력값 처리
- [ ] 인증 만료 처리
- [ ] 네트워크 에러 처리
```

### 우선순위 기준 (MoSCoW)

| 레벨 | 기준 |
|------|------|
| P0 Must | 핵심 플로우 없이 제품 동작 불가 |
| P1 Should | 사용자 경험에 직접 영향 |
| P2 Could | 있으면 좋지만 없어도 동작 |
| P3 Won't | 이번 릴리즈 제외 |

---

## Claude AI 작업 지침 (PM용)

AI에게 요구사항 관련 작업을 요청할 때:

```
# 좋은 요청 예시
"GET /api/posts/company/list 응답에서 company_name이 없는데,
 JobCard에 회사명을 표시해야 해. 서버 수정 없이 클라이언트에서
 어떻게 처리할 수 있을지 방안 2가지 제시해줘"

"이력서 지원 플로우 acceptance criteria 작성해줘.
 POST /api/applications 미구현 상태 고려해서 작성해."
```

- 항상 **실제 API 엔드포인트** 기반으로 요청
- 미구현 기능은 반드시 명시
- 클라이언트/서버 구분 명확히

---

## 관련 Skills & Agents

- **FSD 구조**: `.claude/skills/fsd-patterns/SKILL.md`
- **API 패턴**: `.claude/skills/api-patterns/SKILL.md`
- **인증 흐름**: `.claude/skills/auth-patterns/SKILL.md`
- **Planner Agent**: `@.claude/agents/planner.md`
- **Feature Architect**: `@.claude/agents/feature-architect.md`
