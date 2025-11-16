import { apiClient } from './client';
import type { ProfileResponse, ProfileUpdateRequest } from './types';

export const profileApi = {

  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>('/api/profile', data);
  },
};
