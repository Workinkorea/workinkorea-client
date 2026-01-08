import { apiClient } from '@/shared/api/client';
import {
  DiagnosisAnswerRequest,
  DiagnosisAnswerResponse,
} from '@/shared/types/api';

export const diagnosisApi = {
  async submitAnswer(
    data: DiagnosisAnswerRequest
  ): Promise<DiagnosisAnswerResponse> {
    return apiClient.post<DiagnosisAnswerResponse>(
      '/api/diagnosis/answer',
      data
    );
  },

  async getDiagnosisAnswer(id: number): Promise<DiagnosisAnswerResponse> {
    return apiClient.get<DiagnosisAnswerResponse>(`/api/diagnosis/answer/${id}`);
  },
};
