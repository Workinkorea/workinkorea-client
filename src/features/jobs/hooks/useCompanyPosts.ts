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
  return useQuery({
    queryKey: companyPostsKeys.list(page, limit),
    queryFn: () => postsApi.getPublicCompanyPosts({ page, limit }),
    // Hydrate with SSR data on first render
    initialData,
    // Keep previous data while fetching next page (better UX)
    placeholderData: (previousData) => previousData,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Garbage collect after 10 minutes
    gcTime: 10 * 60 * 1000,
  });
}
