/**
 * Custom Hook for Company Profile Management
 *
 * Provides unified state management for company profile data fetching and updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profileCompany';
import { CompanyProfileRequest, CompanyProfileResponse } from '@/shared/types/api';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';

export interface UseCompanyProfileOptions {
  /** 프로필 조회 실패 시 편집 페이지로 리다이렉트 여부 */
  redirectOnError?: boolean;
  /** 성공 후 리다이렉트 경로 */
  successRedirectPath?: string;
  /** 프로필 조회 재시도 여부 */
  retry?: boolean;
}

/**
 * Company Profile Query Hook
 *
 * @param options - Hook configuration options
 * @returns Query result and mutation functions
 */
export function useCompanyProfile(options: UseCompanyProfileOptions = {}) {
  const {
    redirectOnError = false,
    successRedirectPath = '/company',
    retry = false,
  } = options;

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch company profile
  const profileQuery = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => profileApi.getProfileCompany(),
    retry,
  });

  // Create company profile
  const createMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => profileApi.createProfileCompany(data),
    onSuccess: (data: CompanyProfileResponse) => {
      queryClient.setQueryData(['companyProfile'], data);
      toast.success('프로필이 성공적으로 생성되었습니다.');

      if (successRedirectPath) {
        setTimeout(() => {
          router.push(successRedirectPath);
        }, 1000);
      }
    },
    onError: (error: unknown) => {
      logError(error, 'useCompanyProfile.create');
      const errorMessage = extractErrorMessage(error, '프로필 생성에 실패했습니다. 다시 시도해주세요.');
      toast.error(errorMessage);
    },
  });

  // Update company profile
  const updateMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => profileApi.updateProfileCompany(data),
    onSuccess: (data: CompanyProfileResponse) => {
      queryClient.setQueryData(['companyProfile'], data);
      toast.success('프로필이 성공적으로 수정되었습니다.');

      if (successRedirectPath) {
        setTimeout(() => {
          router.push(successRedirectPath);
        }, 1000);
      }
    },
    onError: (error: unknown) => {
      logError(error, 'useCompanyProfile.update');
      const errorMessage = extractErrorMessage(error, '프로필 수정에 실패했습니다. 다시 시도해주세요.');
      toast.error(errorMessage);
    },
  });

  // Save (create or update) company profile
  const saveMutation = useMutation({
    mutationFn: (data: CompanyProfileRequest) => {
      if (profileQuery.data) {
        return profileApi.updateProfileCompany(data);
      } else {
        return profileApi.createProfileCompany(data);
      }
    },
    onSuccess: (data: CompanyProfileResponse) => {
      queryClient.setQueryData(['companyProfile'], data);
      const message = profileQuery.data
        ? '프로필이 성공적으로 수정되었습니다.'
        : '프로필이 성공적으로 생성되었습니다.';
      toast.success(message);

      if (successRedirectPath) {
        setTimeout(() => {
          router.push(successRedirectPath);
        }, 1000);
      }
    },
    onError: (error: unknown) => {
      logError(error, 'useCompanyProfile.save');
      const errorMessage = extractErrorMessage(
        error,
        '프로필 저장에 실패했습니다. 다시 시도해주세요.'
      );
      toast.error(errorMessage);
    },
  });

  return {
    // Query state
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // Mutations
    create: createMutation.mutate,
    update: updateMutation.mutate,
    save: saveMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSaving: saveMutation.isPending,

    // Refetch
    refetch: profileQuery.refetch,
  };
}
