import { apiClient } from './client';
import {
  DiagnosisAnswerRequest,
  DiagnosisAnswerResponse,
} from './types';

export const diagnosisApi = {
  async submitAnswer(
    data: DiagnosisAnswerRequest
  ): Promise<DiagnosisAnswerResponse> {
    return apiClient.post<DiagnosisAnswerResponse>(
      '/diagnosis/answer',
      data
    );
  },

  async getDiagnosisAnswer(id: number): Promise<DiagnosisAnswerResponse> {
    return apiClient.get<DiagnosisAnswerResponse>(`/diagnosis/answer/${id}`);
  },
};
