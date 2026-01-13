import { fetchClient } from "@/shared/api/fetchClient";
import { CompanyProfileResponse, CompanyProfileRequest } from "@/shared/types/api";

export const profileApi = {
  /**
   * 현재 기업의 프로필 정보를 조회합니다.
   * @returns 기업 프로필 정보
   */
  async getProfileCompany(): Promise<CompanyProfileResponse> {
    return fetchClient.get<CompanyProfileResponse>('/api/company-profile');
  },

  /**
   * 새로운 기업 프로필을 생성합니다.
   * @param data - 생성할 기업 프로필 정보
   * @returns 생성된 기업 프로필 정보
   */
  async createProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return fetchClient.post<CompanyProfileResponse>('/api/company-profile', data);
  },

  /**
   * 기업 프로필 정보를 업데이트합니다.
   * @param data - 업데이트할 기업 프로필 정보
   * @returns 업데이트된 기업 프로필 정보
   */
  async updateProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return fetchClient.put<CompanyProfileResponse>('/api/company-profile', data);
  },
};
