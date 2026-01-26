import { useMutation } from '@tanstack/react-query';
import { postsApi } from '@/features/jobs/api/postsApi';
import type { ApplyToJobRequest } from '@/shared/types/api';
import { toast } from 'react-hot-toast';

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
  return useMutation({
    mutationFn: (data: ApplyToJobRequest) => postsApi.applyToJob(data),
    onSuccess: () => {
      toast.success('지원이 완료되었습니다!', {
        duration: 3000,
        position: 'top-center',
      });
    },
    onError: (error: Error) => {
      console.error('[useJobApplication] Error:', error);
      toast.error(
        error.message || '지원 중 오류가 발생했습니다. 다시 시도해주세요.',
        {
          duration: 4000,
          position: 'top-center',
        }
      );
    },
  });
}
