import { apiClient } from "../client";
import { CompanyProfileResponse } from "../types";

export const profileApi = {
  async getProfileCompany(): Promise<CompanyProfileResponse> {
    return apiClient.get<CompanyProfileResponse>('/api/profile');
  },
};