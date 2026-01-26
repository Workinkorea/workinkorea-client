import { fetchClient } from './fetchClient';

export interface MinioUploadResponse {
    url: string;
    fields: Record<string, string>;
    key: string;
    expires: string;
    content_type: string;
    form_data: Record<string, string>;
}

export interface UploadFileParams {
  file: File;
  file_type: string;
  endpoint: string;
}


export const uploadFileToMinio = async (
  params: UploadFileParams
): Promise<string | undefined> => {
  const { file, file_type, endpoint } = params;

  try {
    // 1. Presigned URL 정보 받기
    const uploadResponse = await fetchClient.post<MinioUploadResponse>(
      endpoint,
      {
        file_type: file_type,
        file_name: file.name,
        content_type: file.type,
        max_size: file.size,
      }
    );

    // 2. FormData 생성 및 필드 추가
    const uploadFormData = new FormData();

    uploadFormData.append('key', uploadResponse.key);
    uploadFormData.append('Content-Type', uploadResponse.content_type);
    uploadFormData.append(
      'x-amz-algorithm',
      uploadResponse.form_data['x-amz-algorithm']
    );
    uploadFormData.append(
      'x-amz-credential',
      uploadResponse.form_data['x-amz-credential']
    );
    uploadFormData.append('x-amz-date', uploadResponse.form_data['x-amz-date']);
    uploadFormData.append('policy', uploadResponse.form_data['policy']);
    uploadFormData.append(
      'x-amz-signature',
      uploadResponse.form_data['x-amz-signature']
    );
    uploadFormData.append('success_action_status', '201');
    uploadFormData.append('file', file);

    // 3. MinIO로 업로드
    const response = await fetch(uploadResponse.url, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!(response.ok || response.status === 201)) {
      throw new Error(`이미지 업로드 실패: ${response.statusText}`);
    }

    // 4. 업로드된 이미지 URL 반환
    const imageUrl = response.headers.get('Location') ?? undefined;
    return imageUrl;
  } catch (error) {
    console.error('MinIO 업로드 실패:', error);
    throw error;
  }
};