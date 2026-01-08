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
    return apiClient.get<ProfileResponse>('/api/me');
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>('/api/me', data);
  },

  async getContact(): Promise<ContactResponse> {
    return apiClient.get<ContactResponse>('/api/contact');
  },

  async updateContact(data: ContactUpdateRequest): Promise<ContactResponse> {
    return apiClient.put<ContactResponse>('/api/contact', data);
  },

  async getAccountConfig(): Promise<AccountConfigResponse> {
    return apiClient.get<AccountConfigResponse>('/api/account-config');
  },

  async updateAccountConfig(data: AccountConfigUpdateRequest): Promise<AccountConfigResponse> {
    return apiClient.put<AccountConfigResponse>('/api/account-config', data);
  },
};
