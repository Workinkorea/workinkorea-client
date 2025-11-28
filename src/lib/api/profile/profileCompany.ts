import { apiClient } from "../client";
import { CompanyProfileResponse, CompanyProfileRequest } from "../types";

export const profileApi = {
  async getProfileCompany(): Promise<CompanyProfileResponse> {
    return apiClient.get<CompanyProfileResponse>('/api/company-profile', {
      tokenType: 'company',
    });
  },

  async createProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return apiClient.post<CompanyProfileResponse>('/api/company-profile', data, {
      tokenType: 'company',
    });
  },

  async updateProfileCompany(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    return apiClient.put<CompanyProfileResponse>('/api/company-profile', data, {
      tokenType: 'company',
    });
  },
};