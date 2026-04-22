'use client';

import { useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeFetchError } from './normalizeFetchError';

/**
 * useFormSubmit 옵션.
 *
 * @template TFormValues  react-hook-form 의 폼 데이터 타입
 * @template TResponse    서버 응답 타입
 */
export interface UseFormSubmitOptions<TFormValues, TResponse> {
  /** 실제 서버 호출 함수 */
  submitFn: (values: TFormValues) => Promise<TResponse>;
  /** 성공 시 콜백 (리다이렉트, 캐시 무효화 등) */
  onSuccess?: (res: TResponse) => void | Promise<void>;
  /** 성공 토스트 메시지 */
  successMessage?: string;
  /** 422 필드 에러를 react-hook-form setError 로 전달할 콜백 */
  onFieldError?: (fieldErrors: Record<string, string>) => void;
  /** 범용 에러 토스트 메시지 (fallback) */
  genericErrorMessage?: string;
}

/**
 * useFormSubmit 반환 타입.
 */
export interface UseFormSubmitReturn<TFormValues> {
  /** `handleSubmit(onSubmit)` 에 전달할 함수 */
  onSubmit: (values: TFormValues) => Promise<void>;
  /** 제출 진행 중 여부 (버튼 disabled, 스피너 등) */
  isSubmitting: boolean;
}

/**
 * 폼 제출을 표준화하는 훅.
 *
 * - `useMutation` 기반, 중복 클릭 자동 방지 (mutation 진행 중 재호출 무시).
 * - 성공 시 토스트 + `onSuccess` 콜백.
 * - 422 에러: 필드별 에러를 `onFieldError` 로 전달, 그 외 toast.error.
 * - 네트워크/5xx: 범용 에러 메시지.
 *
 * @example
 * ```tsx
 * const { onSubmit, isSubmitting } = useFormSubmit({
 *   submitFn: (data) => profileApi.updateProfile(data),
 *   onSuccess: () => router.push('/user/profile'),
 *   successMessage: '프로필이 수정되었습니다.',
 *   onFieldError: (errs) =>
 *     Object.entries(errs).forEach(([k, v]) => setError(k, { message: v })),
 *   genericErrorMessage: '프로필 수정에 실패했습니다.',
 * });
 *
 * <form onSubmit={handleSubmit(onSubmit, focusFirstError)}>
 *   <Button disabled={isSubmitting} isLoading={isSubmitting}>저장</Button>
 * </form>
 * ```
 */
export function useFormSubmit<TFormValues, TResponse = unknown>(
  options: UseFormSubmitOptions<TFormValues, TResponse>,
): UseFormSubmitReturn<TFormValues> {
  const {
    submitFn,
    onSuccess,
    successMessage,
    onFieldError,
    genericErrorMessage = '요청 처리에 실패했습니다.',
  } = options;

  // 중복 클릭 방지용 lock
  const lockRef = useRef(false);

  const mutation = useMutation<TResponse, unknown, TFormValues>({
    mutationFn: submitFn,
    onSuccess: async (res) => {
      if (successMessage) toast.success(successMessage);
      await onSuccess?.(res);
    },
    onError: (error) => {
      const { fieldErrors, formMessage } = normalizeFetchError(error);

      if (Object.keys(fieldErrors).length > 0 && onFieldError) {
        onFieldError(fieldErrors);
        return;
      }

      toast.error(formMessage || genericErrorMessage);
    },
    onSettled: () => {
      lockRef.current = false;
    },
  });

  const onSubmit = useCallback(
    async (values: TFormValues) => {
      if (lockRef.current || mutation.isPending) return;
      lockRef.current = true;
      await mutation.mutateAsync(values).catch(() => {
        // 에러는 onError 에서 처리됨, mutateAsync reject 무시
      });
    },
    [mutation],
  );

  return {
    onSubmit,
    isSubmitting: mutation.isPending,
  };
}
