/**
 * useMutationWithToast Hook
 *
 * Provides a standardized way to handle mutations with automatic toast notifications
 * and query invalidation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';

export interface MutationWithToastOptions<TData, TError, TVariables> {
  /** The mutation function to execute */
  mutationFn: (variables: TVariables) => Promise<TData>;

  /** Success message to display */
  successMessage?: string;

  /** Error message to display (fallback if API doesn't provide one) */
  errorMessage?: string;

  /** URL to redirect to on success */
  redirectUrl?: string;

  /** Query keys to invalidate on success */
  invalidateQueryKeys?: string[][];

  /** Additional success handler */
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;

  /** Additional error handler */
  onError?: (error: TError, variables: TVariables) => void | Promise<void>;

  /** Context for error logging */
  errorContext?: string;

  /** Whether to show loading toast */
  showLoadingToast?: boolean;

  /** Loading message */
  loadingMessage?: string;

  /** Delay before redirect (ms) */
  redirectDelay?: number;
}

/**
 * Custom hook for mutations with automatic toast notifications
 *
 * @template TData - The type of data returned by the mutation
 * @template TError - The type of error that can be thrown
 * @template TVariables - The type of variables passed to the mutation
 *
 * @example
 * const { mutate, isPending } = useMutationWithToast({
 *   mutationFn: (data) => api.createPost(data),
 *   successMessage: '공고가 등록되었습니다',
 *   errorMessage: '공고 등록에 실패했습니다',
 *   redirectUrl: '/company',
 *   invalidateQueryKeys: [['companyPosts']],
 * });
 */
export const useMutationWithToast = <
  TData = unknown,
  TError = unknown,
  TVariables = void
>(
  options: MutationWithToastOptions<TData, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutationFn,
    successMessage,
    errorMessage = '잠시 후 다시 시도해주세요',
    redirectUrl,
    invalidateQueryKeys,
    onSuccess: additionalOnSuccess,
    onError: additionalOnError,
    errorContext,
    showLoadingToast = false,
    loadingMessage = '처리 중',
    redirectDelay = 0,
  } = options;

  return useMutation<TData, TError, TVariables>({
    mutationFn,

    onMutate: async () => {
      if (showLoadingToast) {
        toast.loading(loadingMessage);
      }
    },

    onSuccess: async (data, variables) => {
      // Dismiss loading toast
      if (showLoadingToast) {
        toast.dismiss();
      }

      // Show success toast
      if (successMessage) {
        toast.success(successMessage);
      }

      // Invalidate queries
      if (invalidateQueryKeys && invalidateQueryKeys.length > 0) {
        invalidateQueryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call additional success handler
      if (additionalOnSuccess) {
        await additionalOnSuccess(data, variables);
      }

      // Redirect if specified
      if (redirectUrl) {
        if (redirectDelay > 0) {
          setTimeout(() => {
            router.push(redirectUrl);
          }, redirectDelay);
        } else {
          router.push(redirectUrl);
        }
      }
    },

    onError: async (error, variables) => {
      // Dismiss loading toast
      if (showLoadingToast) {
        toast.dismiss();
      }

      // Log error in development
      if (errorContext) {
        logError(error, errorContext);
      }

      // Extract and show error message
      const message = extractErrorMessage(error, errorMessage);
      toast.error(message);

      // Call additional error handler
      if (additionalOnError) {
        await additionalOnError(error, variables);
      }
    },
  });
};

/**
 * Specialized hook for create operations
 */
export const useCreateMutation = <TData = unknown, TError = unknown, TVariables = void>(
  options: Omit<MutationWithToastOptions<TData, TError, TVariables>, 'successMessage' | 'errorMessage'> & {
    resourceName: string; // e.g., '공고', '프로필'
  }
) => {
  const { resourceName, ...restOptions } = options;

  return useMutationWithToast({
    ...restOptions,
    successMessage: `${resourceName}가 등록되었습니다.`,
    errorMessage: `${resourceName}를 등록할 수 없어요. 다시 시도해주세요`,
  });
};

/**
 * Specialized hook for update operations
 */
export const useUpdateMutation = <TData = unknown, TError = unknown, TVariables = void>(
  options: Omit<MutationWithToastOptions<TData, TError, TVariables>, 'successMessage' | 'errorMessage'> & {
    resourceName: string;
  }
) => {
  const { resourceName, ...restOptions } = options;

  return useMutationWithToast({
    ...restOptions,
    successMessage: `${resourceName}가 수정되었습니다.`,
    errorMessage: `${resourceName}를 수정할 수 없어요. 다시 시도해주세요`,
  });
};

/**
 * Specialized hook for delete operations
 */
export const useDeleteMutation = <TData = unknown, TError = unknown, TVariables = void>(
  options: Omit<MutationWithToastOptions<TData, TError, TVariables>, 'successMessage' | 'errorMessage'> & {
    resourceName: string;
  }
) => {
  const { resourceName, ...restOptions } = options;

  return useMutationWithToast({
    ...restOptions,
    successMessage: `${resourceName}가 삭제되었습니다.`,
    errorMessage: `${resourceName}를 삭제할 수 없어요. 다시 시도해주세요`,
  });
};
