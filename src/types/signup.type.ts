export interface SignupStep1Data {
  agreements: {
    all: boolean;
    termsOfService: boolean;
    privacyPolicy: boolean;
    personalInfo: boolean;
    thirdParty: boolean;
    marketing: boolean;
  };
};

export interface SignupStep2Data {
  userInfo: {
    businessNumber: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    email: string;
    name: string;
    company: string;
    businessNumberVerifyToken: string;
  };
};

export type Step2Form = {
  businessNumber: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  email: string;
  name: string;
  company: string;
  businessNumberVerifyToken: string;
};

export interface SignupStep3Data {
  verification: {
    method: 'phone' | 'ipin' | '';
    code: string;
    isVerified: boolean;
  };
};

export interface SignupFormData {
  step1: SignupStep1Data;
  step2: SignupStep2Data;
  step3: SignupStep3Data;
};

export interface RegisterRequest {
  businessNumber: string;
  userName: string;
  password: string;
  companyName: string;
  phone: string;
  email: string;
  partnerId: string;
  birthDate: string;
  isMarketingConsent: boolean;
  businessNumberVerifyToken: string;
};