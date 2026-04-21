import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/features/jobs/api/postsApi';
import type { ApplyToJobRequest } from '@/shared/types/api';
import { FetchError } from '@/shared/api/fetchClient';
import { toast } from 'sonner';

/**
 * Hook: useJobApplication
 *
 * Purpose: 채용 공고에 지원하기 (POST /api/applications)
 *
 * Features:
 * - Loading state 관리
 * - Success/Error toast 자동 표시
 * - Error handling
 *
 * Usage Example:
 * ```tsx
 * const { mutate: applyToJob, isPending } = useJobApplication();
 *
 * const handleApply = () => {
 *   applyToJob(
 *     { company_post_id: 123, resume_id: 456, cover_letter: "..." },
 *     {
 *       onSuccess: () => {
 *         // Custom success handling
 *         router.push('/applications');
 *       }
 *     }
 *   );
 * };
 * ```
 */
export function useJobApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyToJobRequest) => postsApi.applyToJob(data),
    onSuccess: () => {
      toast.success('지원이 완료되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['applications', 'me'] });
    },
    onError: (error: Error) => {
      // 409 = 이미 지원한 공고
      if (error instanceof FetchError && error.status === 409) {
        toast.info('이미 지원한 공고입니다.');
        queryClient.invalidateQueries({ queryKey: ['applications', 'me'] });
        return;
      }
      toast.error(error.message || '지원 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });
}
