'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import UserProfileHeader from '@/components/user/UserProfileHeader';
import ProfileStats from '@/components/user/ProfileStats';
import SkillBarChart from '@/components/user/SkillBarChart';
import RadarChart from '@/components/ui/RadarChart';
import { UserProfile, ProfileStatistics, SkillStats, RadarChartData } from '@/types/user';

interface UserProfileClientProps {
  userId: string;
}

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

const UserProfileClient: React.FC<UserProfileClientProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience'>('overview');

  // TODO: 실제 API 쿼리로 대체
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      // 모킹용 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockUserProfile;
    }
  });

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

  if (isLoading) {
    return (
      <Layout>
      <Header type="homepage" />
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
      <Header type="homepage" />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-title-3 font-semibold text-label-700 mb-2">
              프로필을 불러올 수 없습니다
            </h2>
            <p className="text-body-3 text-label-500">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const radarData = generateRadarData(profile.skills);
  const averageRadarData = generateAverageRadarData();

  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 헤더 */}
          <UserProfileHeader 
            profile={profile} 
            isOwnProfile={false}
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
                { key: 'overview', label: '개요' },
                { key: 'skills', label: '스킬 분석' },
                { key: 'experience', label: '경력 & 교육' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-body-3 font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-label-600 hover:bg-component-alternative'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 탭 컨텐츠 */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
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

            {activeTab === 'skills' && (
              <SkillBarChart 
                skills={profile.skills}
                title="세부 스킬 분석"
                maxItems={12}
                showCategory={true}
              />
            )}

            {activeTab === 'experience' && (
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