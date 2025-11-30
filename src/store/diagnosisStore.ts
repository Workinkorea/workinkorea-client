import { create } from 'zustand';

export interface DiagnosisData {
  // Session 1: 기본 정보
  currentLocation: string;
  otherCountry?: string;
  koreanLevel: string;
  visaStatus: string;

  // Session 2: 경력 및 스킬
  workExperience: string;
  jobField: string;
  education: string;
  languages: Array<{
    language: string;
    level: string;
  }>;

  // Session 3: 취업 선호도
  desiredSalary: string;
  employmentType: string;
  companySize: string;
  startDate: string;

  // Session 4: 매칭 및 전환
  challenges: string[];
  email?: string;
  receiveInfo: boolean;
}

interface DiagnosisStore {
  currentStep: number;
  diagnosisData: Partial<DiagnosisData>;
  setStep: (step: number) => void;
  updateData: (data: Partial<DiagnosisData>) => void;
  reset: () => void;
}

const initialData: Partial<DiagnosisData> = {
  languages: [],
  challenges: [],
  receiveInfo: false,
};

export const useDiagnosisStore = create<DiagnosisStore>()((set) => ({
  currentStep: 1,
  diagnosisData: initialData,
  setStep: (step) => set({ currentStep: step }),
  updateData: (data) =>
    set((state) => ({
      diagnosisData: { ...state.diagnosisData, ...data },
    })),
  reset: () => set({ currentStep: 1, diagnosisData: initialData }),
}));
