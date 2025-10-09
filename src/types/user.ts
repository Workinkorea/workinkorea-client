// 사용자 프로필 관련 타입 정의

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export interface UserSkill {
  id: string;
  name: string;
  level: number; // 1-100 사용자의 실제 레벨
  average: number; // 업계 평균 점수 (1-100)
  category: 'technical' | 'soft' | 'language';
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  title?: string; // 직책/포지션
  location?: string;
  bio?: string;
  skills: UserSkill[];
  experience: number; // 경력 년차
  completedProjects: number;
  certifications: string[];
  education: Education[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  availability: 'available' | 'busy' | 'not-looking';
  preferredSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  languages: {
    name: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  createdAt: string;
  updatedAt: string;
}

// 레이더 차트를 위한 스킬 카테고리별 점수
export interface RadarChartData {
  technical: number; // 기술 역량 평균
  communication: number; // 소통 능력
  problemSolving: number; // 문제 해결 능력
  teamwork: number; // 팀워크
  leadership: number; // 리더십
}

// 스킬 통계 정보
export interface SkillStats {
  totalSkills: number;
  aboveAverageSkills: number;
  topSkillCategory: 'technical' | 'soft' | 'language';
  overallScore: number; // 전체 평균 점수
  industryRanking: number; // 업계 내 순위 (백분율)
}

// 프로필 통계 데이터
export interface ProfileStatistics {
  profileViews: number;
  contactRequests: number;
  skillEndorsements: number;
  averageRating: number;
}

// 이력서 관련 타입
export interface Resume {
  id: string;
  title: string;
  description?: string;
  templateType: ResumeTemplate;
  status: ResumeStatus;
  isPublic: boolean;
  userId: string;
  content: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
      profileImage?: string;
    };
    objective?: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string[];
    projects: Project[];
    certifications: string[];
    awards?: Award[];
    languages: {
      name: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }[];
  };
  createdAt: string;
  updatedAt: string;
  lastViewedAt?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  url?: string;
  repository?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}

export type ResumeTemplate =
  | 'modern'
  | 'classic'
  | 'creative'
  | 'minimal'
  | 'professional';

export type ResumeStatus =
  | 'draft'
  | 'completed'
  | 'published';

// 이력서 통계
export interface ResumeStatistics {
  totalViews: number;
  weeklyViews: number;
  downloadCount: number;
  lastViewedAt?: string;
}