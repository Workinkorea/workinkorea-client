import { FetchError } from '@/shared/api/fetchClient';

/**
 * FastAPI 422 validation detail 항목.
 * `loc` 의 마지막 원소를 필드명으로 사용한다.
 */
interface ValidationDetail {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

/**
 * FetchError 를 폼 친화적인 필드별 에러 맵 + 범용 메시지로 변환한다.
 *
 * @example
 * ```ts
 * try {
 *   await submitFn(data);
 * } catch (err) {
 *   const { fieldErrors, formMessage } = normalizeFetchError(err);
 *   Object.entries(fieldErrors).forEach(([name, msg]) =>
 *     setError(name, { message: msg }),
 *   );
 *   if (formMessage) toast.error(formMessage);
 * }
 * ```
 */
export function normalizeFetchError(error: unknown): {
  fieldErrors: Record<string, string>;
  formMessage: string;
} {
  const fieldErrors: Record<string, string> = {};

  // FetchError 가 아니면 일반 메시지 반환
  if (!(error instanceof FetchError)) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return { fieldErrors, formMessage: message };
  }

  const { status, data } = error;

  // 422: FastAPI Pydantic validation — detail 배열
  if (status === 422 && data && typeof data === 'object') {
    const detail = (data as { detail?: unknown }).detail;

    if (Array.isArray(detail)) {
      for (const item of detail as ValidationDetail[]) {
        const loc = item.loc;
        const msg = item.msg ?? '';
        // loc 에서 'body' 를 제외한 마지막 원소를 필드명으로 사용
        const fieldName = loc
          ? String(
              loc.filter((segment) => segment !== 'body').pop() ?? '',
            )
          : '';
        if (fieldName) {
          fieldErrors[fieldName] = msg;
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors, formMessage: '' };
      }

      // detail 배열이지만 loc 파싱 실패 → 메시지 합산
      const messages = (detail as ValidationDetail[])
        .map((d) => d.msg)
        .filter(Boolean)
        .slice(0, 3);
      return {
        fieldErrors,
        formMessage: messages.join(', ') || '입력값을 확인해주세요.',
      };
    }

    // detail 이 문자열인 경우
    if (typeof detail === 'string') {
      return { fieldErrors, formMessage: detail };
    }
  }

  // 그 외 HTTP 에러
  const fallback =
    status >= 500
      ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      : error.message || '요청 처리에 실패했습니다.';

  return { fieldErrors, formMessage: fallback };
}
