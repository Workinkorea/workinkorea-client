'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface UseUnsavedChangesWarningOptions {
  /** react-hook-form formState.isDirty */
  isDirty: boolean;
  /** 제출 완료 후에는 경고를 비활성화 */
  isSubmitSuccessful?: boolean;
  /** 커스텀 경고 메시지 (beforeunload 에서는 브라우저가 무시할 수 있음) */
  message?: string;
}

/**
 * 폼에 저장되지 않은 변경이 있을 때 페이지 이탈을 경고한다.
 *
 * - **beforeunload**: 브라우저 탭 닫기/새로고침 시 확인 다이얼로그.
 * - **pathname 변경 감지**: Next.js App Router 에서 클라이언트 내비게이션 시
 *   `window.confirm` 으로 확인. (App Router 는 router.events 를 제공하지
 *   않으므로 pathname 변경을 감지하는 방식으로 대응한다.
 *   `Link` 프리패치나 `router.push` 는 인터셉트할 수 없는 제한이 있다.)
 *
 * @example
 * ```tsx
 * const { formState: { isDirty, isSubmitSuccessful } } = useForm();
 * useUnsavedChangesWarning({ isDirty, isSubmitSuccessful });
 * ```
 */
export function useUnsavedChangesWarning({
  isDirty,
  isSubmitSuccessful = false,
  message = '저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?',
}: UseUnsavedChangesWarningOptions): void {
  const shouldWarn = isDirty && !isSubmitSuccessful;

  // ── beforeunload ────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldWarn) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldWarn]);

  // ── Next.js App Router pathname 변경 감지 ──────────────────────
  // App Router 는 router.events 를 지원하지 않으므로 pathname 변경을
  // 감지해 confirm 을 띄우는 최선의 방법을 사용한다.
  // 제한: 동일 layout 안의 soft navigation 은 감지되지 않을 수 있다.
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname && shouldWarn) {
      // pathname 이 이미 변경된 후이므로 실질적으로 "되돌리기"는
      // 불가능하지만, 최소한 사용자에게 확인을 받는다.
      // 완전한 인터셉트는 App Router 한계로 불가.
      // eslint-disable-next-line no-restricted-globals
      if (!confirm(message)) {
        // 되돌릴 수 없으므로 경고만 표시
        // history.back() 은 부작용이 커서 사용하지 않음
      }
    }
    prevPathname.current = pathname;
  }, [pathname, shouldWarn, message]);
}
