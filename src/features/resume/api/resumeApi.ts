import { fetchClient, API_BASE_URL } from '@/shared/api/fetchClient';
import type {
  CreateResumeRequest,
  UpdateResumeRequest,
  UploadResumeFileResponse,
  UploadResumeImageResponse,
  UploadUserImageResponse,
  PresignedPostResponse,
  ResumeListResponse,
  ResumeDetail,
} from '@/shared/types/api';

export const resumeApi = {
  /**
   * 현재 사용자의 모든 이력서 목록을 조회합니다.
   * @returns 이력서 목록
   */
  async getMyResumes(): Promise<ResumeListResponse> {
    return fetchClient.get<ResumeListResponse>('/api/posts/resume/list/me');
  },

  /**
   * 특정 이력서의 상세 정보를 조회합니다.
   * @param resumeId - 조회할 이력서 ID
   * @returns 이력서 상세 정보
   */
  async getResumeById(resumeId: number): Promise<ResumeDetail> {
    return fetchClient.get<ResumeDetail>(`/api/posts/resume/${resumeId}`);
  },

  /**
   * 새로운 이력서를 생성합니다.
   * @param data - 생성할 이력서 정보
   * @returns 성공 메시지
   */
  async createResume(data: CreateResumeRequest): Promise<string> {
    return fetchClient.post<string>('/api/posts/resume', data);
  },

  /**
   * 기존 이력서를 업데이트합니다.
   * @param resumeId - 업데이트할 이력서 ID
   * @param data - 업데이트할 이력서 정보
   * @returns 성공 메시지
   */
  async updateResume(
    resumeId: number,
    data: UpdateResumeRequest
  ): Promise<string> {
    return fetchClient.put<string>(
      `/api/posts/resume/${resumeId}`,
      data
    );
  },

  /**
   * 이력서를 삭제합니다.
   * @param resumeId - 삭제할 이력서 ID
   * @returns 성공 메시지
   */
  async deleteResume(resumeId: number): Promise<string> {
    return fetchClient.delete<string>(`/api/posts/resume/${resumeId}`);
  },

  /**
   * 이력서 파일을 MinIO에 업로드합니다.
   * presigned POST URL을 사용하여 직접 파일을 업로드합니다.
   * @param file - 업로드할 파일
   * @returns 업로드된 파일 정보
   */
  async uploadResumeFile(file: File): Promise<UploadResumeFileResponse> {
    // 1단계: 백엔드에서 presigned POST URL 받기 (HttpOnly Cookie 자동 전송)
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include', // HttpOnly Cookie 자동 전송
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

  /**
   * 이력서 이미지를 MinIO에 업로드합니다.
   * presigned POST URL을 사용하여 직접 이미지를 업로드합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지 파일명
   */
  async uploadResumeImage(file: File): Promise<UploadResumeImageResponse> {
    // 1단계: 백엔드에서 presigned POST URL 받기 (HttpOnly Cookie 자동 전송)
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include', // HttpOnly Cookie 자동 전송
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

  /**
   * 사용자 프로필 이미지를 MinIO에 업로드합니다.
   * presigned POST URL을 사용하여 직접 이미지를 업로드합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업로드 결과 및 이미지 URL
   */
  async uploadUserImage(file: File): Promise<UploadUserImageResponse> {
    // 1단계: 백엔드에서 presigned POST URL 받기 (HttpOnly Cookie 자동 전송)
    const presignedResponse = await fetch(`${API_BASE_URL}/api/metest/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_name: file.name }),
      credentials: 'include', // HttpOnly Cookie 자동 전송
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
