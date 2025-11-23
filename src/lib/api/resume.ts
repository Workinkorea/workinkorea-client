import { apiClient } from './client';
import { tokenManager } from '../utils/tokenManager';
import type {
  ResumeListResponse,
  ResumeDetailResponse,
  CreateResumeRequest,
  CreateResumeResponse,
  UpdateResumeRequest,
  UpdateResumeResponse,
  DeleteResumeResponse,
  UploadResumeFileResponse,
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

  async uploadResumeFile(file: File): Promise<UploadResumeFileResponse> {
    // 파일을 ArrayBuffer로 변환 (바이너리)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // 토큰 가져오기
    const token = tokenManager.getToken('user');

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // FastAPI 서버로 바이너리 데이터 전송
    const response = await fetch(`${API_BASE_URL}/api/posts/resume/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-File-Name': file.name,
        'X-File-Type': file.type,
        'X-File-Size': file.size.toString(),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: buffer,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `파일 업로드 실패: ${response.status}`);
    }

    return response.json();
  },
};
