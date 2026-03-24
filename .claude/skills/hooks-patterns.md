## 1. 상태 관리 분리 원칙

- **Zustand (`@/shared/stores/*`)**: 인증 상태(`isAuthenticated`, `userType`) 등 전역 **클라이언트** 상태 전용. 서버 데이터 캐싱 금지.
- **React Query (`@/features/*/hooks/*`)**: 서버 상태, API 데이터 페칭 및 동기화 전용.

## 2. API 통신 훅 (`fetchClient`)

- **Client Component**: `fetchClient.get/post/put/delete` 객체 사용 (자동 토큰 갱신 포함).
- **Server Component**: `fetchAPI<T>(url, options)` 함수 사용 (ISR 캐싱, `next: { revalidate }` 활용).
- 절대경로 사용 필수 (`/api/...`), `fetch()` 직접 호출 금지.

## 3. 주요 Shared Hooks (`@/shared/hooks/`)

- `useDebounce`: 검색어 등 연속된 입력 지연 처리
- `useFileUpload`: MinIO 연동 파일 업로드 처리
- `useFormPersist`: 폼 데이터 로컬 스토리지 임시 저장
- `useMediaQuery`: 반응형 분기 처리
- `useModal` / `useMutationWithToast`: UI 상태 제어 및 API 결과 알림

## 4. 훅 작성 규칙

- 클라이언트 로직(`useState`, `useEffect`)이 포함된 컴포넌트는 반드시 최상단에 `'use client'` 명시 및 파일명에 `*Client.tsx` 접미사 추가.
