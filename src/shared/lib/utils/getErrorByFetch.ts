/**
 * Fetch API Error Handler (HttpOnly Cookie 환경용)
 *
 * fetchClient에서 발생하는 FetchError를 처리하여
 * 사용자 친화적인 에러 메시지를 반환합니다.
 */

import { ERROR_CODE } from '@/shared/constants/errorCode';
import { FetchError } from '@/shared/api/fetchClient';

interface ErrorResponse {
  status?: number;
  name?: string;
  message?: string | string[];
}

/**
 * FetchError를 분석하여 적절한 에러 메시지를 반환합니다.
 *
 * @param error - FetchError 또는 일반 Error
 * @returns ERROR_CODE에 정의된 에러 객체
 *
 * @example
 * ```typescript
 * try {
 *   await fetchClient.get('/api/users')
 * } catch (error) {
 *   const errorInfo = getErrorByFetch(error)
 *   toast.error(errorInfo.description)
 * }
 * ```
 */
export const getErrorByFetch = (error: unknown) => {
  // FetchError인 경우
  if (error instanceof FetchError) {
    const serverErrorData = error.data as ErrorResponse | undefined;
    const httpStatusCode = error.status;

    // 서버가 반환한 에러 코드 우선 처리
    if (serverErrorData?.status && serverErrorData.status in ERROR_CODE) {
      const message = serverErrorData.message;
      const isEnglishMessage =
        typeof message === 'string' && /^[A-Za-z\s]+$/.test(message);

      // 영어 메시지면 ERROR_CODE 사용, 한글이면 서버 메시지 사용
      return isEnglishMessage
        ? ERROR_CODE[serverErrorData.status]
        : {
            ...ERROR_CODE[serverErrorData.status],
            description: Array.isArray(message) ? message[0] : message,
          };
    }

    // HTTP 상태 코드 기반 에러 처리
    if (httpStatusCode && httpStatusCode in ERROR_CODE) {
      return ERROR_CODE[httpStatusCode];
    }
  }

  // 일반 Error인 경우
  if (error instanceof Error) {
    // Network errors, timeouts, etc.
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return ERROR_CODE['ECONNABORTED'] || ERROR_CODE.default;
    }
    if (error.message.includes('Network')) {
      return ERROR_CODE['ERR_NETWORK'] || ERROR_CODE.default;
    }
  }

  // 기본 에러
  return ERROR_CODE.default;
};

/**
 * 에러 객체에서 표시할 메시지를 추출합니다.
 *
 * @param error - 에러 객체
 * @returns 사용자에게 표시할 에러 메시지
 */
export const getErrorMessage = (error: unknown): string => {
  const errorInfo = getErrorByFetch(error);
  return errorInfo.description || errorInfo.title || '알 수 없는 오류가 발생했습니다.';
};
