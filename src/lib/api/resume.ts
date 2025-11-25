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
  UploadResumeImageResponse,
  UploadUserImageResponse,
  PresignedPostResponse,
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
    const token = tokenManager.getToken('user');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 1단계: 백엔드에서 presigned POST URL 받기
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include',
    });

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Presigned URL 생성 실패: ${presignedResponse.status}`);
    }

    const presignedData: PresignedPostResponse = await presignedResponse.json();

    // 2단계: MinIO에 직접 파일 업로드
    const formData = new FormData();

    // presigned POST의 fields를 먼저 추가
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 파일을 마지막에 추가
    formData.append('file', file);

    const uploadResponse = await fetch(presignedData.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`파일 업로드 실패: ${uploadResponse.status}`);
    }

    // 업로드 성공 응답 생성
    return {
      resume_id: 0, // 필요시 백엔드에서 받아오도록 수정
      file_url: `${presignedData.url}/${presignedData.object_name}`,
      message: '파일 업로드 성공',
    };
  },

  async uploadResumeImage(file: File): Promise<UploadResumeImageResponse> {
    const token = tokenManager.getToken('user');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 1단계: 백엔드에서 presigned POST URL 받기
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include',
    });

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Presigned URL 생성 실패: ${presignedResponse.status}`);
    }

    const presignedData: PresignedPostResponse = await presignedResponse.json();

    // 2단계: MinIO에 직접 파일 업로드
    const formData = new FormData();

    // presigned POST의 fields를 먼저 추가
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 파일을 마지막에 추가
    formData.append('file', file);

    const uploadResponse = await fetch(presignedData.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`이미지 업로드 실패: ${uploadResponse.status}`);
    }

    // 업로드 성공 응답 생성
    return {
      file_name: presignedData.object_name,
    };
  },

  async uploadUserImage(file: File): Promise<UploadUserImageResponse> {
    const token = tokenManager.getToken('user');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 1단계: 백엔드에서 presigned POST URL 받기
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include',
    });

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Presigned URL 생성 실패: ${presignedResponse.status}`);
    }

    const presignedData: PresignedPostResponse = await presignedResponse.json();

    // 2단계: MinIO에 직접 파일 업로드
    const formData = new FormData();

    // presigned POST의 fields를 먼저 추가
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 파일을 마지막에 추가
    formData.append('file', file);

    const uploadResponse = await fetch(presignedData.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`사용자 이미지 업로드 실패: ${uploadResponse.status}`);
    }

    // 업로드 성공 응답 생성
    return {
      success: true,
      message: '이미지 업로드 성공',
      image_url: `${presignedData.url}/${presignedData.object_name}`,
    };
  },
};
