import type { FieldErrors, FieldValues } from 'react-hook-form';

/**
 * react-hook-form FieldErrors 에서 첫 에러 필드로 포커스 + 스크롤.
 *
 * `handleSubmit(onValid, onInvalid)` 의 `onInvalid` 콜백으로 전달하면
 * 유효성 검사 실패 시 자동으로 첫 에러 필드가 보이도록 이동한다.
 *
 * @example
 * ```tsx
 * <form onSubmit={handleSubmit(onSubmit, focusFirstError)}>
 * ```
 */
export function focusFirstError<T extends FieldValues>(
  errors: FieldErrors<T>,
): void {
  const firstKey = findFirstErrorKey(errors);
  if (!firstKey) return;

  const el =
    document.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
    document.getElementById(firstKey);

  if (!el) return;

  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/**
 * 중첩/배열 에러 객체에서 첫 번째 에러 필드의 name 을 반환한다.
 * `career_history.0.company_name` 형태의 dot-path 를 생성한다.
 */
function findFirstErrorKey(
  errors: Record<string, unknown>,
  prefix = '',
): string | null {
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    if (!value || typeof value !== 'object') continue;

    const path = prefix ? `${prefix}.${key}` : key;

    // 리프 에러 노드: message 속성이 있으면 최종 필드
    if ('message' in (value as Record<string, unknown>)) {
      return path;
    }

    // 배열/중첩 → 재귀
    const nested = findFirstErrorKey(
      value as Record<string, unknown>,
      path,
    );
    if (nested) return nested;
  }
  return null;
}
