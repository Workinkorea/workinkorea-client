// 글로벌 타입 정의

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_API_URL?: string;
      GOOGLE_VERIFICATION_ID?: string;
      NAVER_VERIFICATION_ID?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
    }
  }
}

// 이미지 타입 정의
export interface ImageMeta {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'company';
  profileImage?: string;
}

// 회사 타입
export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  location?: string;
}

// 채용공고 타입
export interface JobPosting {
  id: string;
  title: string;
  company: Company;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  datePosted: string;
  validThrough?: string;
}

export {};