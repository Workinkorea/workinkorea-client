import { fetchClient } from '@/shared/api/fetchClient';
import {
  DiagnosisAnswerRequest,
  DiagnosisAnswerResponse,
} from '@/shared/types/api';

export const diagnosisApi = {
  /**
   * 진단 설문 응답을 제출합니다.
   * @param data - 진단 응답 데이터
   * @returns 제출된 진단 응답 정보
   */
  async submitAnswer(
    data: DiagnosisAnswerRequest
  ): Promise<DiagnosisAnswerResponse> {
    return fetchClient.post<DiagnosisAnswerResponse>(
      '/api/diagnosis/answer',
      data
    );
  },

  /**
   * 특정 진단 응답을 조회합니다.
   * @param id - 조회할 진단 응답 ID
   * @returns 진단 응답 정보
   */
  async getDiagnosisAnswer(id: number): Promise<DiagnosisAnswerResponse> {
    return fetchClient.get<DiagnosisAnswerResponse>(`/api/diagnosis/answer/${id}`);
  },
};
