import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDiagnosisStore } from '../diagnosisStore';

describe('diagnosisStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useDiagnosisStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useDiagnosisStore());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.diagnosisData).toEqual({
      languages: [],
      challenges: [],
      receiveInfo: false,
    });
    expect(result.current.diagnosisId).toBe(null);
  });

  describe('setStep', () => {
    it('should update current step', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.setStep(2);
      });

      expect(result.current.currentStep).toBe(2);

      act(() => {
        result.current.setStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });
  });

  describe('updateData', () => {
    it('should update diagnosis data', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          currentLocation: '한국',
          koreanLevel: '초급',
        });
      });

      expect(result.current.diagnosisData).toMatchObject({
        currentLocation: '한국',
        koreanLevel: '초급',
        languages: [],
        challenges: [],
        receiveInfo: false,
      });
    });

    it('should merge with existing data', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          currentLocation: '한국',
          koreanLevel: '초급',
        });
      });

      act(() => {
        result.current.updateData({
          visaStatus: 'E-9',
          workExperience: '3년',
        });
      });

      expect(result.current.diagnosisData).toMatchObject({
        currentLocation: '한국',
        koreanLevel: '초급',
        visaStatus: 'E-9',
        workExperience: '3년',
        languages: [],
        challenges: [],
        receiveInfo: false,
      });
    });

    it('should update arrays correctly', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          languages: [
            { language: 'English', level: 'Advanced' },
            { language: 'Korean', level: 'Beginner' },
          ],
        });
      });

      expect(result.current.diagnosisData.languages).toHaveLength(2);
      expect(result.current.diagnosisData.languages![0]).toEqual({
        language: 'English',
        level: 'Advanced',
      });
    });

    it('should update challenges array', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          challenges: ['언어 장벽', '비자 문제'],
        });
      });

      expect(result.current.diagnosisData.challenges).toEqual(['언어 장벽', '비자 문제']);
    });

    it('should update boolean fields', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          receiveInfo: true,
        });
      });

      expect(result.current.diagnosisData.receiveInfo).toBe(true);
    });
  });

  describe('setDiagnosisId', () => {
    it('should set diagnosis ID', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.setDiagnosisId(123);
      });

      expect(result.current.diagnosisId).toBe(123);
    });

    it('should update diagnosis ID', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.setDiagnosisId(123);
      });

      expect(result.current.diagnosisId).toBe(123);

      act(() => {
        result.current.setDiagnosisId(456);
      });

      expect(result.current.diagnosisId).toBe(456);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      // Update all fields
      act(() => {
        result.current.setStep(3);
        result.current.updateData({
          currentLocation: '한국',
          koreanLevel: '중급',
          languages: [{ language: 'English', level: 'Advanced' }],
          challenges: ['언어 장벽'],
          receiveInfo: true,
        });
        result.current.setDiagnosisId(123);
      });

      // Verify data was updated
      expect(result.current.currentStep).toBe(3);
      expect(result.current.diagnosisId).toBe(123);
      expect(result.current.diagnosisData.currentLocation).toBe('한국');

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify all fields are back to initial state
      expect(result.current.currentStep).toBe(1);
      expect(result.current.diagnosisId).toBe(null);
      expect(result.current.diagnosisData).toEqual({
        languages: [],
        challenges: [],
        receiveInfo: false,
      });
    });
  });

  describe('Session workflow', () => {
    it('should handle complete diagnosis workflow', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      // Session 1: Basic Info
      act(() => {
        result.current.setStep(1);
        result.current.updateData({
          currentLocation: '한국',
          koreanLevel: '초급',
          visaStatus: 'E-9',
        });
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.diagnosisData).toMatchObject({
        currentLocation: '한국',
        koreanLevel: '초급',
        visaStatus: 'E-9',
      });

      // Session 2: Career and Skills
      act(() => {
        result.current.setStep(2);
        result.current.updateData({
          workExperience: '3년',
          jobField: '제조업',
          education: '고등학교',
          languages: [
            { language: 'English', level: 'Intermediate' },
            { language: 'Korean', level: 'Beginner' },
          ],
        });
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.diagnosisData.languages).toHaveLength(2);

      // Session 3: Preferences
      act(() => {
        result.current.setStep(3);
        result.current.updateData({
          desiredSalary: '300만원',
          employmentType: '정규직',
          companySize: '중소기업',
          startDate: '즉시',
        });
      });

      expect(result.current.currentStep).toBe(3);

      // Session 4: Matching
      act(() => {
        result.current.setStep(4);
        result.current.updateData({
          challenges: ['언어 장벽', '비자 문제'],
          email: 'test@example.com',
          receiveInfo: true,
        });
        result.current.setDiagnosisId(999);
      });

      expect(result.current.currentStep).toBe(4);
      expect(result.current.diagnosisId).toBe(999);
      expect(result.current.diagnosisData.challenges).toHaveLength(2);
      expect(result.current.diagnosisData.receiveInfo).toBe(true);

      // Verify all data is preserved
      const finalData = result.current.diagnosisData;
      expect(finalData.currentLocation).toBe('한국');
      expect(finalData.workExperience).toBe('3년');
      expect(finalData.desiredSalary).toBe('300만원');
      expect(finalData.email).toBe('test@example.com');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data updates', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({});
      });

      expect(result.current.diagnosisData).toEqual({
        languages: [],
        challenges: [],
        receiveInfo: false,
      });
    });

    it('should handle updating same field multiple times', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({ currentLocation: '한국' });
      });

      expect(result.current.diagnosisData.currentLocation).toBe('한국');

      act(() => {
        result.current.updateData({ currentLocation: '일본' });
      });

      expect(result.current.diagnosisData.currentLocation).toBe('일본');

      act(() => {
        result.current.updateData({ currentLocation: '베트남' });
      });

      expect(result.current.diagnosisData.currentLocation).toBe('베트남');
    });

    it('should handle otherCountry field', () => {
      const { result } = renderHook(() => useDiagnosisStore());

      act(() => {
        result.current.updateData({
          currentLocation: '기타',
          otherCountry: '태국',
        });
      });

      expect(result.current.diagnosisData.currentLocation).toBe('기타');
      expect(result.current.diagnosisData.otherCountry).toBe('태국');
    });
  });
});
