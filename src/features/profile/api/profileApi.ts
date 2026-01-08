import { apiClient } from '@/shared/api/client';
import type {
  ProfileResponse,
  ProfileUpdateRequest,
  ContactResponse,
  ContactUpdateRequest,
  AccountConfigResponse,
  AccountConfigUpdateRequest
} from '../types/profile.types';

export const profileApi = {
  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/me');
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>('/me', data);
  },

  async getContact(): Promise<ContactResponse> {
    return apiClient.get<ContactResponse>('/contact');
  },

  async updateContact(data: ContactUpdateRequest): Promise<ContactResponse> {
    return apiClient.put<ContactResponse>('/contact', data);
  },

  async getAccountConfig(): Promise<AccountConfigResponse> {
    return apiClient.get<AccountConfigResponse>('/account-config');
  },

  async updateAccountConfig(data: AccountConfigUpdateRequest): Promise<AccountConfigResponse> {
    return apiClient.put<AccountConfigResponse>('/account-config', data);
  },
};
