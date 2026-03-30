# Feature Roadmap

## 현재 구현 상태 요약

### 완료된 핵심 기능
- 구직자 Google OAuth 로그인 / 이메일 회원가입
- 기업 이메일 로그인 / 회원가입
- 채용공고 목록 조회, 필터, 정렬 (클라이언트 사이드)
- 채용공고 상세 조회
- 구직자 프로필 조회/수정
- 이력서 CRUD
- 기업 대시보드 (공고 CRUD)
- 직무 적합도 자가진단
- 관리자 페이지 (사용자/기업/공고 관리 UI)
- 다국어(한/영) 지원

---

## 미구현 기능 우선순위

### P0 — Must Have (핵심 플로우 차단)

| 기능 | 필요 서버 API | 비즈니스 가치 | 구현 복잡도 |
|------|------------|------------|-----------|
| **채용공고 지원하기** | `POST /api/applications` | 플랫폼 핵심 기능 | 중 |
| **내 지원 내역 조회** | `GET /api/applications/me` | 구직자 재방문 유도 | 하 |
| **공개 채용공고 목록 API** | `GET /api/posts/company/list` | 현재 404 반환 중 | 하 |

> ⚠️ `GET /api/posts/company/list` 는 클라이언트에서 사용 중이나 서버에 미구현. 현재 빈 결과 표시됨.

---

### P1 — Should Have (UX 직접 영향)

| 기능 | 필요 서버 API | 비즈니스 가치 | 구현 복잡도 |
|------|------------|------------|-----------|
| **지원 취소** | `DELETE /api/applications/{id}` | 구직자 신뢰도 | 하 |
| **공개 기업 프로필 조회** | `GET /api/company/{id}` | 기업 신뢰도 | 하 |
| **공고 지원자 목록 (기업용)** | `GET /api/posts/company/{id}/applicants` | 기업 가치 | 중 |
| **지원자 상태 업데이트** | `PATCH /api/applications/{id}/status` | 채용 플로우 완성 | 중 |

---

### P2 — Could Have (있으면 좋음)

| 기능 | 필요 서버 API | 비즈니스 가치 | 구현 복잡도 |
|------|------------|------------|-----------|
| **채용공고 북마크** | `POST/DELETE /api/bookmarks` | 재방문율 | 중 |
| **북마크 목록** | `GET /api/bookmarks` | 재방문율 | 하 |
| **공고 추천 알고리즘** | 서버 ML 필요 | 매칭 품질 | 상 |
| **이메일 알림** | 서버 메일 서비스 필요 | 리텐션 | 상 |

---

### P3 — Won't Have (이번 릴리즈 제외)

- 채팅/메시지 시스템
- 영상 면접 기능
- 자동 번역 (JD 한↔영)
- 모바일 앱 (React Native)

---

## 현재 알려진 버그 / 갭

| 이슈 | 원인 | 임시 처리 | 영구 수정 방법 |
|------|------|---------|------------|
| 공고 목록 빈 화면 | `/api/posts/company/list` 서버 미구현 | EmptyState 표시 | 서버 엔드포인트 구현 |
| 공고 카드에 회사명 없음 | `CompanyPostResponse`에 company_name 없음 | "기업 채용공고" 표시 | 서버 응답에 company_name 추가 |
| 지원 기능 동작 안함 | `POST /api/applications` 서버 미구현 | 버튼 disabled | 서버 엔드포인트 구현 |

---

## 다음 스프린트 제안 (2주)

### Week 1: 서버 P0 API 구현 요청
- [ ] 서버팀에 `POST /api/applications` 구현 요청
- [ ] 서버팀에 `GET /api/posts/company/list` 구현 요청
- [ ] 클라이언트 지원하기 UI 완성 (이미 모달 구조 있음)

### Week 2: 클라이언트 P0 연동
- [ ] `POST /api/applications` 연동
- [ ] 내 지원 내역 페이지 (`/user/applications`)
- [ ] 기업 지원자 목록 (`/company/jobs/{id}/applicants`)
