## 1. 스타일링 & UI 패턴 (Tailwind 4)

- **`cn()` 유틸리티 필수**: `cn(baseStyles, conditionalStyles)` 형태로 작성하여 스타일 충돌 방지 (`twMerge` + `clsx`).
- **인터랙션**: 클릭 가능한 요소(`button`, `a`, `Link`)는 반드시 `cursor-pointer` 포함.
- **아이콘 버튼**: `focus:outline-none`만 적용, `focus:ring` 사용 금지.
- **버튼 변형**: `variant` (primary, secondary, outline, ghost), `size` (sm, md, lg) 패턴화.

## 2. 인증 (Auth) 패턴

- **JWT 관리**: `access_token`은 메모리(`tokenStore.ts`), `refresh_token`은 `HttpOnly` 쿠키 보관.
- **로그아웃/수정**: 로그아웃은 `DELETE /api/auth/logout`, 프로필 수정은 `PUT /api/me` 사용.
- **라우트 보호**: Middleware에서 인증 여부에 따라 `/login?redirect={url}` 로 자동 리다이렉트.

## 3. 폼 (Form) 패턴

- 복잡한 폼은 `react-hook-form` + `zod` 결합 사용 권장.
- 파일 업로드는 백엔드 프록시를 거치지 않고 Client -> MinIO 직접 업로드 패턴(`uploadToMinio`) 활용.

## 4. 서버 컴포넌트 (RSC) 패턴

- `layout.tsx`, `page.tsx`는 기본적으로 Server Component로 유지.
- 상호작용이 필요한 하위 UI만 Client Component(`*Client.tsx`)로 분리하여 트리 말단에 배치.
