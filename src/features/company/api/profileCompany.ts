import { apiClient } from "@/shared/api/client";
import { CompanyProfileResponse, CompanyProfileRequest } from "@/shared/types/api";

export const profileApi = {
  async getProfileCompany(): Promise<CompanyProfileResponse> {
    return apiClient.get<CompanyProfileResponse>('/company-profile');
  },

  async createProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return apiClient.post<CompanyProfileResponse>('/company-profile', data);
  },

  async updateProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return apiClient.put<CompanyProfileResponse>('/company-profile', data);
  },
};
