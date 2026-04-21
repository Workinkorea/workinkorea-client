# WorkInKorea 재테스트 리포트 — 2026-04-21

> **테스터**: 장석원 (swj981128@gmail.com)  
> **환경**: https://workinkorea.net (프로덕션)  
> **방법**: Chrome MCP 직접 테스트 + API 레벨 검증  
> **페르소나**: 비회원 → 개인회원(Google OAuth) → 기업회원(이메일)  
> **이전 테스트**: 2026-04-20 ([[재테스트 리포트 2026-04-20]], [[재테스트 Addendum 2026-04-20]])  
> **관련 문서**: [[WorkInKorea MOC]], [[이슈 목록 2026-04-21]]

---

## 🎯 한 줄 결론

**서버 API는 거의 다 작동한다 — 프론트엔드가 막고 있다.**  
기업/개인 모두의 **핵심 워크플로우(공고 등록, 지원하기, 이력서 저장, 프로필 로드)가 UI 레벨에서 깨져 있으며**, 서버 API는 직접 호출 시 200을 반환한다. 런치 전 반드시 **프론트엔드 단일 주간 스프린트**가 필요하다.

---

## 📊 심각도 요약 (총 29개 이슈)

| 심각도       | 개수 | 대표 증상                                                                                           |
| ------------ | ---- | --------------------------------------------------------------------------------------------------- |
| **Critical** | 8    | 공고 등록 CTA 전원 무반응, 이력서 저장 422 silent 실패, /jobs SSR 에러, /user/profile 영구 스켈레톤 |
| **High**     | 13   | 지원하기/북마크 무반응, `/user/resume/edit/{id}` 데이터 미로드, 기업명 "기업 #1" 하드코딩           |
| **Medium**   | 6    | 진단 결과 100% 고정 의심, 로그인 상태 UI 미반영, refresh 401 루프                                   |
| **Low**      | 2    | 헤더 KO/EN 대소문자 토글 혼용, 결과페이지 CTA 문구                                                  |

---

## 🔄 이전 테스트 대비 변경점

### ✅ 고쳐진 이슈 (Regression 없음 확인)

- **ISSUE-10/11 FIXED**: `/terms`, `/privacy` Markdown raw 노출 → HTML 정상 렌더링
- **ISSUE-65 FIXED**: 급여 `3800` → `"3,800만원"` 정상
- **기업 대시보드 FIXED**: 이전의 skeleton 영구 로딩 증상 해결 (렌더링 정상)
- **/company/posts/create 초기 진입 개선**: 페이지 자체는 존재 (라우트 404 해결)

### ❌ 여전히 깨진 이슈 (Persisting)

- `/jobs` 페이지 SSR 에러 (`[JobsPage] Render error: Server Components render`)
- 공고의 `start_date == end_date` → 전부 마감 표시
- 페이지네이션 `limit=10` 파라미터 무시 (API가 전체 반환)
- 로그인 직후 UI 상태 미반영 (5-10초 LCP 딜레이)

### 🆕 새로 발견된 Critical (8개)

1. 기업 **공고 등록 CTA 4개 전원 무반응** (새 등록 / 공고 등록 / 첫 공고 등록하기 / + 채용 공고 등록)
2. 개인 **이력서 저장 422 + 에러 피드백 0** (서버는 빈 배열 거부, 클라이언트는 빈 배열 기본값 전송)
3. 개인 **이력서 편집 폼 데이터 미로드** (`/user/resume/edit/{id}`에서 기존 값 prefill 안 됨)
4. 개인 **/user/profile 영구 스켈레톤** (백그라운드 탭 hydration 실패)
5. 개인 **`/api/me` 401 → refresh 401 20+회 루프** (tokenStore/쿠키 인증 방식 충돌)
6. 기업 **대시보드 내 공고 카드 클릭 무반응** (상세/편집 진입 경로 없음)
7. 개인 **지원하기 버튼 → /user/profile 리다이렉트** (지원 API 호출 없음)
8. 기업 **`/company/posts/edit/{id}` 가드 오작동** (HEAD 200이지만 실제 이동 시 /company로 리턴)

---

## 🧪 테스트 커버리지

### 비회원 (✅ 완료)

- [x] 랜딩 페이지 렌더링
- [x] 공고 목록(/jobs) SSR 에러 재현
- [x] 공고 상세 (마감/활성 공고 각각)
- [x] 회원가입/로그인 선택 페이지
- [x] 약관/개보/고객센터/FAQ 정적 페이지 (모두 정상)
- [x] EN 토글 동작 (부분 작동: 헤더만 번역)

### 개인회원 (✅ 완료)

- [x] Google OAuth 로그인 후 `/api/me` 200 (실 사용자 데이터)
- [x] 자가진단 4 스텝 플로우 + 결과 페이지
- [x] 이력서 생성 (POST /api/posts/resume)
- [x] 이력서 수정 (API 레벨 PUT 성공)
- [x] 프로필 편집 (`/user/profile/edit` 정상 작동)
- [x] 지원하기 버튼 (무반응 확인)
- [x] 북마크 버튼 (무반응 확인)

### 기업회원 (✅ 완료)

- [x] 이메일 로그인 후 대시보드 렌더
- [x] 공고 등록 CTA 4개 전원 무반응 확인
- [x] `/company/applicants` "준비 중"
- [x] `/company/settings` "준비 중"
- [x] 기업 프로필 편집(`/company/profile/edit`) 정상 prefill
- [x] API 직접 호출로 공고 등록 성공(id=37) — UI 없이 백엔드는 작동
- [x] 내 공고 카드 클릭 무반응

---

## 🔍 루트 원인 분석

### 1. 인증 아키텍처 충돌 (Critical)

**증거:**

- 쿠키 탭 스크린샷: `access_token`, `refresh_token`, `userType` 모두 HttpOnly로 정상 발급
- 하지만 `/api/me` 호출이 20+회 401 반복 후 겨우 200
- `fetchClient`의 설계(CLAUDE.md): accessToken은 **in-memory tokenStore**로 관리

**해석:**

- 로그인 성공 시 서버가 HttpOnly 쿠키로 access_token을 발급하지만
- 클라이언트 `fetchClient`는 여전히 `Authorization: Bearer <memory>` 헤더 방식만 사용
- 따라서 페이지 새로고침 / 새 탭에서는 tokenStore가 비어있어 401 발생
- `/api/auth/refresh`도 HttpOnly 쿠키 방식으로 전환된 것을 클라이언트가 따라가지 못함

**권장:** `fetchClient.ts`에서 쿠키 기반 인증(`credentials: 'include'`)으로 통일하고 Authorization 헤더 로직 제거. 또는 서버에서 access_token은 cookie 발급을 중단하고 응답 body로만 내려보내기.

### 2. 모달/네비게이션 트리거 미연결 (Critical)

**증거:**

- 기업 "새 채용 공고 등록" 등 4개 CTA `onclick` 속성은 존재하나 클릭 시 URL 변화 없음
- 이력서 "저장하기"는 POST는 하지만 응답 처리 없음
- 지원하기/북마크는 API 호출조차 없이 리다이렉트만

**해석:**

- 라우터 push / 모달 open 로직이 연결되지 않은 "dead button" 상태
- 이벤트 핸들러가 등록되긴 했으나 실제 액션 분기(mutation + redirect)가 실행되지 않음

**권장:** `CompanyDashboard`, `JobDetailApplyPanel`, `ResumeEditor`에서 이벤트 핸들러 전수 점검 필요.

### 3. 서버 스키마 강제성 vs 클라이언트 기본값 불일치 (High)

**증거:**

- 이력서 POST 시 클라이언트가 `language_skills: [{language_type: "", level: ""}]` 같은 빈 객체 배열을 기본 전송
- 서버는 `""` 값에 대해 422 반환
- 최소 페이로드 `{title: "..."}`로는 200 정상

**해석:**

- react-hook-form / zod 스키마가 기본값으로 빈 객체 array를 채워 넣고, 사용자가 "추가" 버튼을 누르지 않아도 배열이 비어있지 않음
- 서버의 Pydantic validation은 string min_length=1을 강제

**권장:** 클라이언트 submit 전에 배열에서 모든 값이 빈 문자열인 항목을 필터링하거나, 서버 스키마를 Optional로 완화.

### 4. Hydration 지연 (백그라운드 탭) (Medium)

**증거:**

- `/user/profile`, `/diagnosis` 페이지: `visibilityState: "hidden"` 상태에서 skeleton 100+개가 영구 표시
- 사용자가 탭을 활성화하면 정상 렌더링

**해석:** Next.js 16 App Router + React 19 hydration이 탭 visibility 에 영향을 받음 (requestIdleCallback 또는 visibility-aware lazy hydration 설정)

**권장:** 주요 페이지는 eager hydration 처리 또는 visibilitychange 이벤트 핸들러 추가.

---

## 🎬 런치 차단 Top 10 (우선순위)

1. **[CRITICAL]** 기업 공고 등록 CTA 무반응 4개 — 기업의 유일한 진입점
2. **[CRITICAL]** 개인 이력서 저장 422 + 에러 피드백 0
3. **[CRITICAL]** 지원하기 버튼 무반응 + `/api/applications` 미구현
4. **[CRITICAL]** `/jobs` SSR Render error
5. **[CRITICAL]** 이력서 편집 폼 데이터 미로드
6. **[CRITICAL]** `/user/profile` 영구 스켈레톤
7. **[CRITICAL]** `/api/me` → refresh 20+회 401 루프
8. **[HIGH]** 기업명 "기업 #1" 하드코딩 + `"string"` 플레이스홀더 저장
9. **[HIGH]** 공고 `start_date == end_date` 전원 마감 표시
10. **[HIGH]** 북마크 기능 전체 미작동 (API 호출도 안 함)

---

## 📁 서버 상태 요약

| 영역                         | 서버                            | 클라이언트                    |
| ---------------------------- | ------------------------------- | ----------------------------- |
| /api/me                      | ✅ 200 (데이터 정확)            | ❌ 401 루프 후 결국 200       |
| /api/posts/company (POST)    | ✅ 200 (#37 생성)               | ❌ UI 버튼 무반응             |
| /api/posts/company/list      | ✅ 200                          | ⚠️ limit 무시                 |
| /api/posts/resume (POST)     | ✅ 200 (minimal) / 422 (빈배열) | ❌ 에러 피드백 0              |
| /api/posts/resume/{id} (GET) | ✅ 200 (데이터 존재)            | ❌ 편집 페이지 prefill 안 함  |
| /api/company-profile         | ✅ 200                          | ✅ /profile/edit prefill 정상 |
| /api/diagnosis/answer        | ✅ 200                          | ✅ 플로우 작동                |
| /api/applications/me         | ❌ 404 (미구현)                 | -                             |
| /api/bookmarks               | ❌ 미확인 (UI 호출 안 함)       | ❌ 버튼 무반응                |
| /api/auth/refresh            | ⚠️ 초기 401 반복 후 200         | ❌ 루프 재시도 무제한         |

---

## 🔗 관련 문서

- [[이슈 목록 2026-04-21]] — 29개 이슈 GitHub 등록용 상세
- [[WorkInKorea MOC]] — 전체 테스트 히스토리 허브
- [[재테스트 리포트 2026-04-20]] — 하루 전 테스트 결과

## 🧭 다음 단계

1. 프론트엔드 팀: 이벤트 핸들러 연결 + tokenStore/쿠키 인증 통일 (Critical 8개)
2. 백엔드 팀: `/api/applications`, `/api/bookmarks` 구현 (High)
3. 디자인 QA: 기업 대시보드에 `"기업 #1"`, `"string"` 등 플레이스홀더 감추는 UI fallback (High)
4. QA: Critical 해결 후 비회원→개인→기업 end-to-end 재검증 (`/apply → 지원 완료 → 기업이 지원자 확인`)
