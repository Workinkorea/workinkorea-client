'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import UserProfileHeader from '@/components/user/UserProfileHeader';
import ProfileStats from '@/components/user/ProfileStats';
import SkillBarChart from '@/components/user/SkillBarChart';
import RadarChart from '@/components/ui/RadarChart';
import { UserProfile, ProfileStatistics, SkillStats, RadarChartData, UserSkill } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { resumeApi } from '@/lib/api/resume';
import { profileApi } from '@/lib/api/profile';
import type { CareerHistory } from '@/lib/api/types';

// TODO: 실제 API 호출로 대체
const mockUserProfile: UserProfile = {
  id: '1',
  name: '김민수',
  email: 'minsu.kim@example.com',
  profileImage: undefined,
  title: '프론트엔드 개발자',
  location: '서울, 한국',
  bio: '5년차 프론트엔드 개발자로 React, TypeScript, Next.js에 전문성을 가지고 있습니다. 사용자 경험을 최우선으로 하는 웹 애플리케이션 개발에 열정을 가지고 있습니다.',
  experience: 5,
  completedProjects: 12,
  certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
  availability: 'available',
  skills: [
    { id: '1', name: 'React', level: 85, average: 70, category: 'technical', description: 'React 생태계 전반에 걸친 깊은 이해' },
    { id: '2', name: 'TypeScript', level: 80, average: 65, category: 'technical' },
    { id: '3', name: 'Next.js', level: 90, average: 75, category: 'technical' },
    { id: '4', name: 'Node.js', level: 70, average: 68, category: 'technical' },
    { id: '5', name: '팀 리더십', level: 75, average: 60, category: 'soft' },
    { id: '6', name: '프로젝트 관리', level: 70, average: 65, category: 'soft' },
    { id: '7', name: '영어', level: 80, average: 55, category: 'language' },
    { id: '8', name: '일본어', level: 60, average: 40, category: 'language' }
  ],
  education: [
    {
      id: '1',
      institution: '서울대학교',
      degree: '학사',
      field: '컴퓨터공학',
      startDate: '2015-03',
      endDate: '2019-02'
    }
  ],
  languages: [
    { name: '한국어', proficiency: 'native' },
    { name: '영어', proficiency: 'advanced' },
    { name: '일본어', proficiency: 'intermediate' }
  ],
  githubUrl: 'https://github.com/kimminsu',
  linkedinUrl: 'https://linkedin.com/in/kimminsu',
  portfolioUrl: 'https://kimminsu.dev',
  preferredSalary: {
    min: 6000,
    max: 8000,
    currency: '만원'
  },
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
};

const mockStatistics: ProfileStatistics = {
  profileViews: 1234,
  contactRequests: 23,
  skillEndorsements: 45,
  averageRating: 4.7
};

const mockSkillStats: SkillStats = {
  totalSkills: 8,
  aboveAverageSkills: 6,
  topSkillCategory: 'technical',
  overallScore: 76,
  industryRanking: 85
};

const UserProfileClient: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'skills' | 'career'>('dashboard');
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 프로필 정보 가져오기
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
    enabled: isAuthenticated,
  });

  // 연락처 정보 가져오기
  const { data: contactData } = useQuery({
    queryKey: ['contact'],
    queryFn: () => profileApi.getContact(),
    enabled: isAuthenticated,
  });

  // 이력서 목록 가져오기
  const { data: resumeList } = useQuery({
    queryKey: ['resumeList'],
    queryFn: () => resumeApi.getMyResumes(),
    enabled: isAuthenticated,
  });

  // 첫 번째 이력서 상세 정보 가져오기
  const firstResumeId = resumeList?.resume_list?.[0]?.id;
  const { data: resumeData, isLoading, error } = useQuery({
    queryKey: ['resume', firstResumeId],
    queryFn: async () => {
      if (!firstResumeId) return null;
      const response = await resumeApi.getResumeById(firstResumeId);

      // 언어 숙련도를 숫자로 변환하는 함수
      const proficiencyToLevel = (level: string): number => {
        switch (level) {
          case 'native':
            return 100;
          case 'advanced':
            return 85;
          case 'intermediate':
            return 65;
          case 'beginner':
            return 40;
          default:
            return 50;
        }
      };

      // language_skills를 UserSkill 형태로 변환
      const languageSkills: UserSkill[] = response.resume.language_skills.map((lang, index) => ({
        id: `lang-${index}`,
        name: lang.language_type,
        level: proficiencyToLevel(lang.level),
        average: 50, // 언어 스킬의 업계 평균 (기본값)
        category: 'language' as const,
        description: `${lang.language_type} - ${lang.level}`
      }));

      // Resume, Profile, Contact 데이터를 UserProfile 형태로 변환
      const profile: UserProfile = {
        id: String(response.resume.user_id),
        name: profileData?.name || '',
        email: contactData?.phone_number || '', // phone_number를 임시로 email로 사용
        profileImage: response.resume.profile_url || profileData?.profile_image_url,
        title: profileData?.introduction || '구직자',
        location: profileData?.location || '',
        bio: response.resume.introduction?.[0]?.content || profileData?.introduction || '',
        experience: calculateExperience(response.resume.career_history),
        completedProjects: 0, // API에서 제공하지 않음
        certifications: response.resume.licenses.map(l => l.license_name),
        availability: 'available',
        skills: languageSkills, // language_skills를 UserSkill 형태로 변환하여 추가
        education: response.resume.schools.map(school => ({
          id: `${school.school_name}-${school.start_date}`,
          institution: school.school_name,
          degree: school.is_graduated ? '졸업' : '재학',
          field: school.major_name,
          startDate: school.start_date,
          endDate: school.end_date
        })),
        languages: response.resume.language_skills.map(lang => ({
          name: lang.language_type,
          proficiency: lang.level as 'native' | 'advanced' | 'intermediate' | 'beginner'
        })),
        githubUrl: contactData?.github_url,
        linkedinUrl: contactData?.linkedin_url,
        portfolioUrl: contactData?.website_url || profileData?.portfolio_url,
        preferredSalary: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return profile;
    },
    enabled: !!firstResumeId && !!profileData,
  });

  // 경력 계산 함수
  function calculateExperience(careerHistory: CareerHistory[]): number {
    if (!careerHistory || careerHistory.length === 0) return 0;

    let totalMonths = 0;
    careerHistory.forEach(career => {
      const start = new Date(career.start_date);
      const end = career.is_working ? new Date() : new Date(career.end_date);
      const months = (end.getFullYear() - start.getFullYear()) * 12 +
                     (end.getMonth() - start.getMonth());
      totalMonths += months;
    });

    return Math.floor(totalMonths / 12);
  }

  const profile = resumeData || mockUserProfile;

  // 레이더 차트 데이터 생성
  const generateRadarData = (skills: UserProfile['skills']): RadarChartData => {
    const technicalSkills = skills.filter(s => s.category === 'technical');
    const softSkills = skills.filter(s => s.category === 'soft');
    // const languageSkills = skills.filter(s => s.category === 'language');

    return {
      technical: technicalSkills.length > 0 
        ? Math.round(technicalSkills.reduce((sum, s) => sum + s.level, 0) / technicalSkills.length)
        : 0,
      communication: softSkills.length > 0 
        ? Math.round(softSkills.reduce((sum, s) => sum + s.level, 0) / softSkills.length)
        : 70, // 기본값
      problemSolving: 80, // 계산된 값 또는 별도 측정값
      teamwork: 75,
      leadership: 70
    };
  };

  const generateAverageRadarData = (): RadarChartData => ({
    technical: 65,
    communication: 60,
    problemSolving: 65,
    teamwork: 70,
    leadership: 55
  });

  if (authLoading || isLoading) {
    return (
      <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
        <div className="min-h-screen bg-background-alternative py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-lg h-64"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg h-96"></div>
                <div className="bg-white rounded-lg h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-title-3 font-semibold text-label-700 mb-2">
              프로필을 불러올 수 없습니다
            </h2>
            <p className="text-body-3 text-label-500">
              {!resumeList?.resume_list?.length
                ? '먼저 이력서를 작성해주세요.'
                : '잠시 후 다시 시도해주세요.'}
            </p>
            {!resumeList?.resume_list?.length && (
              <button
                onClick={() => router.push('/user/resume/create')}
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                이력서 작성하기
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const radarData = generateRadarData(profile.skills);
  const averageRadarData = generateAverageRadarData();

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 상단 액션 버튼 */}
          {resumeList?.resume_list && resumeList.resume_list.length > 0 ? (
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/user/resume/edit/${resumeList.resume_list[0].id}`)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
              >
                이력서 수정하기
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/user/resume/create')}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
              >
                이력서 작성하기
              </button>
            </div>
          )}

          {/* 헤더 */}
          <UserProfileHeader
            profile={profile}
            isOwnProfile={true}
          />

          {/* 탭 네비게이션 */}
          <motion.div 
            className="bg-white rounded-lg p-2 shadow-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-2">
              {[
                { key: 'dashboard', label: '대시보드' },
                { key: 'resume', label: '이력서' },
                { key: 'skills', label: '스킬 관리' },
                { key: 'career', label: '경력 관리' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-body-3 font-medium transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-label-700 hover:bg-component-alternative'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 탭 컨텐츠 */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 레이더 차트 */}
                  <motion.div 
                    className="bg-white rounded-lg p-6 shadow-normal"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-title-4 font-semibold text-label-900 mb-6 text-center">
                      종합 역량 분석
                    </h3>
                    <div className="flex justify-center">
                      <RadarChart 
                        data={radarData}
                        averageData={averageRadarData}
                        size={350}
                      />
                    </div>
                  </motion.div>

                  {/* 통계 */}
                  <ProfileStats 
                    profile={profile}
                    statistics={mockStatistics}
                    skillStats={mockSkillStats}
                  />
                </div>
              </>
            )}

            {activeTab === 'resume' && (
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-normal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-title-4 font-semibold text-label-900 mb-6">
                  이력서
                </h3>
                {resumeList?.resume_list && resumeList.resume_list.length > 0 ? (
                  <div className="space-y-4">
                    {resumeList.resume_list.map((resume) => (
                      <div 
                        key={resume.id}
                        className="border border-line-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                        onClick={() => router.push(`/user/resume/edit/${resume.id}`)}
                      >
                        <h4 className="text-body-2 font-semibold text-label-900 mb-2">
                          {resume.title || '이력서'}
                        </h4>
                        <p className="text-body-3 text-label-600">
                          {resume.updated_at ? new Date(resume.updated_at).toLocaleDateString('ko-KR') : '날짜 정보 없음'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-body-3 text-label-600 mb-4">작성된 이력서가 없습니다.</p>
                    <button
                      onClick={() => router.push('/user/resume/create')}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                    >
                      이력서 작성하기
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <SkillBarChart 
                skills={profile.skills}
                title="세부 스킬 분석"
                maxItems={12}
                showCategory={true}
              />
            )}

            {activeTab === 'career' && (
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-normal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-title-4 font-semibold text-label-900 mb-6">
                  경력 및 교육
                </h3>
                
                {/* 교육 이력 */}
                <div className="space-y-4">
                  <h4 className="text-body-2 font-semibold text-label-700">교육 이력</h4>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-primary-200 pl-4 py-2">
                      <h5 className="text-body-3 font-semibold text-label-900">{edu.institution}</h5>
                      <p className="text-body-3 text-label-600">{edu.degree} - {edu.field}</p>
                      <p className="text-caption-2 text-label-500">
                        {edu.startDate} ~ {edu.endDate || '현재'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 자격증 */}
                {profile.certifications.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-body-2 font-semibold text-label-700">자격증</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert, index) => (
                        <span 
                          key={index}
                          className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-caption-2 border border-primary-200"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileClient;