import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/features/jobs/api/postsApi';
import type { CompanyPostsResponse } from '@/shared/types/api';

/**
 * Query Keys Factory
 * - Centralized query key management
 */
export const companyPostsKeys = {
  all: ['company-posts'] as const,
  lists: () => [...companyPostsKeys.all, 'list'] as const,
  list: (page?: number, limit?: number) =>
    [...companyPostsKeys.lists(), { page, limit }] as const,
  details: () => [...companyPostsKeys.all, 'detail'] as const,
  detail: (id: number) => [...companyPostsKeys.details(), id] as const,
};

/**
 * Hook: useCompanyPosts
 *
 * @param page - Current page number (1-based)
 * @param limit - Items per page (default: 12)
 * @param initialData - SSR prefetched data for hydration
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCompanyPosts(1, 12, serverData);
 * ```
 */
export function useCompanyPosts(
  page: number = 1,
  limit: number = 12,
  initialData?: CompanyPostsResponse
) {
  // SSR fetch가 실패해 빈 데이터를 받았으면, 클라이언트에서 강제로 다시 요청
  const isEmptyInitialData =
    !initialData?.company_posts || initialData.company_posts.length === 0;
  const effectiveInitialData = isEmptyInitialData ? undefined : initialData;

  return useQuery({
    queryKey: companyPostsKeys.list(page, limit),
    queryFn: () => postsApi.getPublicCompanyPosts({ page, limit }),
    // Hydrate with SSR data on first render (skip if empty so client refetches)
    initialData: effectiveInitialData,
    // initialDataUpdatedAt: 0 → SSR 데이터를 즉시 stale 처리하여 마운트 시 클라이언트 재시도 보장
    initialDataUpdatedAt: effectiveInitialData ? 0 : undefined,
    // Keep previous data while fetching next page (better UX)
    placeholderData: (previousData) => previousData,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Garbage collect after 10 minutes
    gcTime: 10 * 60 * 1000,
  });
}
