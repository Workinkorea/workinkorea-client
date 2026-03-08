import { fetchClient } from '@/shared/api/fetchClient';
import type {
  ProfileResponse,
  ProfileUpdateRequest,
  ContactResponse,
  ContactUpdateRequest,
  AccountConfigResponse,
  AccountConfigUpdateRequest
} from '../types/profile.types';

export const profileApi = {
  /**
   * 현재 사용자의 프로필 정보를 조회합니다.
   * @returns 사용자 프로필 정보
   */
  async getProfile(): Promise<ProfileResponse> {
    return fetchClient.get<ProfileResponse>('/api/me');
  },

  /**
   * 현재 사용자의 프로필 정보를 업데이트합니다.
   * @param data - 업데이트할 프로필 정보
   * @returns 업데이트된 프로필 정보
   */
  async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
    return fetchClient.put<ProfileResponse>('/api/me', data);
  },

  /**
   * 현재 사용자의 연락처 정보를 조회합니다.
   * @returns 연락처 정보
   */
  async getContact(): Promise<ContactResponse> {
    return fetchClient.get<ContactResponse>('/api/contact');
  },

  /**
   * 현재 사용자의 연락처 정보를 업데이트합니다.
   * @param data - 업데이트할 연락처 정보
   * @returns 업데이트된 연락처 정보
   */
  async updateContact(data: ContactUpdateRequest): Promise<ContactResponse> {
    return fetchClient.put<ContactResponse>('/api/contact', data);
  },

  /**
   * 현재 사용자의 계정 설정을 조회합니다.
   * @returns 계정 설정 정보
   */
  async getAccountConfig(): Promise<AccountConfigResponse> {
    return fetchClient.get<AccountConfigResponse>('/api/account-config');
  },

  /**
   * 현재 사용자의 계정 설정을 업데이트합니다.
   * @param data - 업데이트할 계정 설정 정보
   * @returns 업데이트된 계정 설정 정보
   */
  async updateAccountConfig(data: AccountConfigUpdateRequest): Promise<AccountConfigResponse> {
    return fetchClient.put<AccountConfigResponse>('/api/account-config', data);
  },
};
