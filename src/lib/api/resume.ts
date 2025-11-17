import { apiClient } from './client';
import type {
  ResumeListResponse,
  ResumeDetailResponse,
  CreateResumeRequest,
  CreateResumeResponse,
  UpdateResumeRequest,
  UpdateResumeResponse,
  DeleteResumeResponse,
} from './types';

export const resumeApi = {
  async getMyResumes(): Promise<ResumeListResponse> {
    return apiClient.get<ResumeListResponse>('/api/posts/resume/list/me');
  },

  async getResumeById(resumeId: number): Promise<ResumeDetailResponse> {
    return apiClient.get<ResumeDetailResponse>(`/api/posts/resume/${resumeId}`);
  },

  async createResume(data: CreateResumeRequest): Promise<CreateResumeResponse> {
    return apiClient.post<CreateResumeResponse>('/api/posts/resume', data);
  },

  async updateResume(
    resumeId: number,
    data: UpdateResumeRequest
  ): Promise<UpdateResumeResponse> {
    return apiClient.put<UpdateResumeResponse>(
      `/api/posts/resume/${resumeId}`,
      data
    );
  },

  async deleteResume(resumeId: number): Promise<DeleteResumeResponse> {
    return apiClient.delete<DeleteResumeResponse>(`/api/posts/resume/${resumeId}`);
  },
};
