/**
 * Error Handling Utilities
 *
 * Provides centralized error handling and message extraction for API errors
 * Supports FetchError (native fetch) and generic error objects
 */

import { FetchError } from '@/shared/api/fetchClient';

/**
 * Extract error message from various error types
 *
 * @param error - Unknown error object (typically from try-catch)
 * @param defaultMessage - Fallback message if error cannot be parsed
 * @returns User-friendly error message
 *
 * @example
 * try {
 *   await api.login();
 * } catch (error) {
 *   const message = extractErrorMessage(error, '로그인 실패');
 *   toast.error(message);
 * }
 */
export const extractErrorMessage = (error: unknown, defaultMessage: string): string => {
  // FetchError (native fetch with custom error class)
  if (error instanceof FetchError) {
    // Try to extract message from error data
    if (error.data && typeof error.data === 'object') {
      const data = error.data as Record<string, unknown>;
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
      if (data.error && typeof data.error === 'string') {
        return data.error;
      }
      if (data.detail && typeof data.detail === 'string') {
        return data.detail;
      }
    }
    return error.message || defaultMessage;
  }

  // Legacy error with response structure (for compatibility)
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { message?: string; error?: string; detail?: string } } };
    return responseError.response?.data?.message ||
           responseError.response?.data?.error ||
           responseError.response?.data?.detail ||
           defaultMessage;
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  // Unknown error type
  return defaultMessage;
};

/**
 * Extract error field from server error response
 * Useful for form validation errors
 *
 * @param error - Unknown error object
 * @param defaultField - Fallback field name
 * @returns Field name that caused the error
 *
 * @example
 * try {
 *   await api.updateProfile(data);
 * } catch (error) {
 *   const field = extractErrorField(error, 'general');
 *   setError(field, { message: extractErrorMessage(error, '오류 발생') });
 * }
 */
export const extractErrorField = (error: unknown, defaultField: string = 'general'): string => {
  // FetchError
  if (error instanceof FetchError) {
    if (error.data && typeof error.data === 'object') {
      const data = error.data as Record<string, unknown>;
      if (data.field && typeof data.field === 'string') {
        return data.field;
      }
    }
  }

  // Legacy error with response structure
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { field?: string } } };
    return responseError.response?.data?.field || defaultField;
  }

  return defaultField;
};

/**
 * Check if error is a network error (no response from server)
 *
 * @param error - Unknown error object
 * @returns True if network error
 *
 * @example
 * catch (error) {
 *   if (isNetworkError(error)) {
 *     toast.error('네트워크 연결을 확인해주세요');
 *   }
 * }
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message?: string }).message?.toLowerCase() || '';
    return errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('fetch');
  }
  return false;
};

/**
 * Check if error is an authentication error (401/403)
 *
 * @param error - Unknown error object
 * @returns True if auth error
 *
 * @example
 * catch (error) {
 *   if (isAuthError(error)) {
 *     router.push('/login');
 *   }
 * }
 */
export const isAuthError = (error: unknown): boolean => {
  // FetchError
  if (error instanceof FetchError) {
    return error.status === 401 || error.status === 403;
  }

  // Legacy error with response structure
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { status?: number } };
    const status = responseError.response?.status;
    return status === 401 || status === 403;
  }

  return false;
};

/**
 * Get HTTP status code from error
 *
 * @param error - Unknown error object
 * @returns HTTP status code or null
 *
 * @example
 * const status = getErrorStatus(error);
 * if (status === 404) {
 *   toast.error('리소스를 찾을 수 없습니다');
 * }
 */
export const getErrorStatus = (error: unknown): number | null => {
  // FetchError
  if (error instanceof FetchError) {
    return error.status;
  }

  // Legacy error with response structure
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { status?: number } };
    return responseError.response?.status || null;
  }

  return null;
};

/**
 * Format validation errors from server
 * Converts server validation errors to form-friendly format
 *
 * @param error - Unknown error object
 * @returns Record of field errors
 *
 * @example
 * catch (error) {
 *   const fieldErrors = formatValidationErrors(error);
 *   Object.entries(fieldErrors).forEach(([field, message]) => {
 *     setError(field, { message });
 *   });
 * }
 */
export const formatValidationErrors = (error: unknown): Record<string, string> => {
  // FetchError
  if (error instanceof FetchError) {
    if (error.data && typeof error.data === 'object') {
      const data = error.data as Record<string, unknown>;
      const errors = data.errors || data.validationErrors;

      if (!errors || typeof errors !== 'object') return {};

      const formattedErrors: Record<string, string> = {};
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          formattedErrors[field] = messages[0]; // Take first error message
        } else if (typeof messages === 'string') {
          formattedErrors[field] = messages;
        }
      });

      return formattedErrors;
    }
  }

  // Legacy error with response structure
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as {
      response?: {
        data?: {
          errors?: Record<string, string[]> | Record<string, string>;
          validationErrors?: Record<string, string[]> | Record<string, string>;
        }
      }
    };

    const errors = responseError.response?.data?.errors || responseError.response?.data?.validationErrors;

    if (!errors) return {};

    // If errors is already in Record<string, string> format
    if (typeof errors === 'object') {
      const formattedErrors: Record<string, string> = {};

      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          formattedErrors[field] = messages[0]; // Take first error message
        } else {
          formattedErrors[field] = messages;
        }
      });

      return formattedErrors;
    }
  }

  return {};
};

/**
 * Create a user-friendly error message with optional details
 *
 * @param mainMessage - Main error message
 * @param details - Additional error details
 * @returns Formatted error message
 *
 * @example
 * const message = createErrorMessage('로그인 실패', '비밀번호가 일치하지 않습니다');
 * // Returns: "로그인 실패: 비밀번호가 일치하지 않습니다"
 */
export const createErrorMessage = (mainMessage: string, details?: string): string => {
  return details ? `${mainMessage}: ${details}` : mainMessage;
};

/**
 * Log error to console in development mode
 *
 * @param error - Error object to log
 * @param context - Additional context about where the error occurred
 *
 * @example
 * catch (error) {
 *   logError(error, 'UserProfile.updateProfile');
 * }
 */
export const logError = (error: unknown, context?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    const prefix = context ? `[${context}]` : '[Error]';
    console.error(prefix, error);
  }
};

/**
 * 사용자 친화적인 인증 에러 메시지를 반환합니다
 *
 * @param error - Unknown error object
 * @returns 한글 에러 메시지
 *
 * @example
 * catch (error) {
 *   const message = getAuthErrorMessage(error);
 *   toast.error(message);
 * }
 */
export const getAuthErrorMessage = (error: unknown): string => {
  const status = getErrorStatus(error);
  const errorMessage = extractErrorMessage(error, '').toLowerCase();

  // 상태 코드 기반 메시지
  if (status === 401) {
    if (errorMessage.includes('expired') || errorMessage.includes('만료')) {
      return '세션이 만료되었습니다. 다시 로그인해주세요.';
    }
    return '인증에 실패했습니다. 다시 로그인해주세요.';
  }

  if (status === 403) {
    return '접근 권한이 없습니다.';
  }

  if (status === 404) {
    return '사용자를 찾을 수 없습니다.';
  }

  // 메시지 기반 처리
  if (errorMessage.includes('token') && errorMessage.includes('invalid')) {
    return '유효하지 않은 토큰입니다. 다시 로그인해주세요.';
  }

  if (errorMessage.includes('refresh')) {
    return '세션 갱신에 실패했습니다. 다시 로그인해주세요.';
  }

  if (isNetworkError(error)) {
    return '네트워크 연결을 확인해주세요.';
  }

  return '인증 처리 중 오류가 발생했습니다.';
};

/**
 * 토큰 유효성 검사 실패 메시지
 */
export const TOKEN_ERROR_MESSAGES = {
  INVALID_FORMAT: '올바르지 않은 토큰 형식입니다.',
  EXPIRED: '토큰이 만료되었습니다.',
  MISSING: '토큰이 없습니다.',
  REFRESH_FAILED: '토큰 갱신에 실패했습니다.',
  INVALID_TYPE: '올바르지 않은 토큰 타입입니다.',
} as const;
