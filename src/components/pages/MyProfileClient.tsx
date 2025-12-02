'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import UserProfileHeader from '@/components/user/UserProfileHeader';
import ProfileStats from '@/components/user/ProfileStats';
import SkillBarChart from '@/components/user/SkillBarChart';
import RadarChart from '@/components/ui/RadarChart';
import ResumeSection from '@/components/user/ResumeSection';
import { UserProfile, ProfileStatistics, SkillStats, RadarChartData, Resume, ResumeStatistics } from '@/types/user';
import { profileApi } from '@/lib/api/profile';
import { resumeApi } from '@/lib/api/resume';
import { useAuth } from '@/hooks/useAuth';

// TODO: 실제 API 호출로 대체 (로그인된 사용자의 프로필)
const mockMyProfile: UserProfile = {
  id: 'me',
  name: '이지은',
  email: 'jieun.lee@example.com',
  profileImage: undefined,
  position: 'UX/UI 디자이너 & 프론트엔드 개발자',
  location: '서울, 한국',
  introduction: '사용자 경험에 중점을 둔 디자인과 개발을 동시에 하는 3년차 전문가입니다. 디자인과 코드 사이의 간극을 줄이는 것이 저의 목표입니다.',
  experience: 3,
  completedProjects: 8,
  certifications: ['Adobe Certified Expert', 'Google UX Design'],
  job_status: 'available',
  skills: [
    { id: '1', name: 'Figma', level: 95, average: 75, category: 'technical', description: 'UI/UX 디자인 툴의 고급 기능 활용' },
    { id: '2', name: 'React', level: 75, average: 70, category: 'technical' },
    { id: '3', name: 'CSS/SCSS', level: 90, average: 65, category: 'technical' },
    { id: '4', name: 'JavaScript', level: 80, average: 70, category: 'technical' },
    { id: '5', name: '사용자 연구', level: 85, average: 60, category: 'soft' },
    { id: '6', name: '프로토타이핑', level: 90, average: 55, category: 'soft' },
    { id: '7', name: '영어', level: 70, average: 55, category: 'language' },
    { id: '8', name: '중국어', level: 50, average: 30, category: 'language' }
  ],
  education: [
    {
      id: '1',
      institution: '홍익대학교',
      degree: '학사',
      field: '시각디자인학',
      startDate: '2017-03',
      endDate: '2021-02'
    }
  ],
  languages: [
    { name: '한국어', proficiency: 'native' },
    { name: '영어', proficiency: 'intermediate' },
    { name: '중국어', proficiency: 'beginner' }
  ],
  githubUrl: 'https://github.com/leejieun',
  linkedinUrl: 'https://linkedin.com/in/leejieun',
  portfolioUrl: 'https://leejieun.design',
  preferredSalary: {
    min: 4500,
    max: 6000,
    currency: '만원'
  },
  createdAt: '2023-06-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
};

const mockMyStatistics: ProfileStatistics = {
  profileViews: 856,
  contactRequests: 12,
  skillEndorsements: 28,
  averageRating: 4.5
};

const mockMySkillStats: SkillStats = {
  totalSkills: 8,
  aboveAverageSkills: 7,
  topSkillCategory: 'technical',
  overallScore: 78,
  industryRanking: 88
};

const mockResumeStatistics: { [resumeId: string]: ResumeStatistics } = {
  'resume-1': {
    totalViews: 245,
    weeklyViews: 32,
    downloadCount: 18,
    lastViewedAt: '2024-01-22T10:30:00Z'
  },
  'resume-2': {
    totalViews: 89,
    weeklyViews: 12,
    downloadCount: 5,
    lastViewedAt: '2024-01-20T14:15:00Z'
  },
  'resume-3': {
    totalViews: 0,
    weeklyViews: 0,
    downloadCount: 0
  }
};

const MyProfileClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'resume'>('overview');
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });
  const queryClient = useQueryClient();
  const router = useRouter();

  // 프로필 데이터 조회
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
    enabled: isAuthenticated,
  });

  // 연락처 데이터 조회
  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => profileApi.getContact(),
    enabled: isAuthenticated,
  });

  // 프로필과 연락처 데이터 병합
  const profile: UserProfile | undefined = profileData ? {
    ...mockMyProfile, // 기본값으로 mock 데이터 사용
    id: 'me',
    name: profileData.name,
    profileImage: profileData.profile_image_url || undefined,
    location: profileData.location,
    introduction: profileData.introduction,
    portfolioUrl: contactData?.website_url || profileData.portfolio_url,
    githubUrl: contactData?.github_url,
    linkedinUrl: contactData?.linkedin_url,
    job_status: profileData.job_status as 'available' | 'busy' | 'not-looking' || 'available',
  } : undefined;

  const isLoading = profileLoading || contactLoading;
  const error = profileError;

  // 이력서 목록 조회
  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      try {
        const response = await resumeApi.getMyResumes();

        // API 응답이 없거나 resume_list가 없으면 빈 배열 반환
        if (!response || !response.resume_list) {
          return [];
        }

        // API 응답을 Resume 타입으로 변환
        const resumes: Resume[] = response.resume_list.map(item => ({
          id: String(item.id),
          title: item.title,
          templateType: 'modern',
          status: 'completed',
          isPublic: true,
          userId: 'me',
          content: {
            personalInfo: {
              name: '',
              email: '',
              phone: '',
              address: ''
            },
            workExperience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: []
          },
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        return resumes;
      } catch (err) {
        console.error('이력서 목록 로드 실패:', err);
        // 에러 시 빈 배열 반환
        return [];
      }
    }
  });

  // 인증 체크 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleEditClick = () => {
    // 편집 페이지로 이동
    router.push('/user/profile/edit');
  };



  // 레이더 차트 데이터 생성
  const generateRadarData = (skills: UserProfile['skills']): RadarChartData => {
    const technicalSkills = skills.filter(s => s.category === 'technical');
    const softSkills = skills.filter(s => s.category === 'soft');

    return {
      technical: technicalSkills.length > 0 
        ? Math.round(technicalSkills.reduce((sum, s) => sum + s.level, 0) / technicalSkills.length)
        : 0,
      communication: 75, // 소통 능력 (별도 측정 또는 계산)
      problemSolving: 82,
      teamwork: 78,
      leadership: softSkills.length > 0 
        ? Math.round(softSkills.reduce((sum, s) => sum + s.level, 0) / softSkills.length)
        : 65
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

  if (error) {
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
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
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
          {/* 페이지 헤더 */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-title-2 font-bold text-label-900">내 프로필</h1>
              <p className="text-body-3 text-label-500 mt-1">
                프로필을 관리하고 스킬 분석을 확인하세요
              </p>
            </div>
            
            {/* <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
              >
                <Share2 size={16} />
                공유
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-label-700 text-white rounded-lg text-body-3 font-medium hover:bg-label-800 transition-colors"
              >
                <Settings size={16} />
                이력서
              </button>
            </div> */}
          </motion.div>

          {/* 프로필 헤더 */}
          <UserProfileHeader 
            profile={profile} 
            isOwnProfile={true}
            onEditClick={handleEditClick}
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
                { key: 'overview', label: '대시보드' },
                { key: 'resume', label: '이력서' },
                { key: 'skills', label: '스킬 관리' },
                { key: 'experience', label: '경력 관리' }
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
            {activeTab === 'overview' && (
              <>
                {/* 성과 요약 배너 */}
                <motion.div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-title-4 font-bold mb-2">
                        축하합니다! 🎉
                      </h3>
                      <p className="text-body-3 opacity-90">
                        동일 경력 대비 상위 {100 - mockMySkillStats.industryRanking}%에 위치하고 있습니다.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-title-2 font-bold">
                        {mockMySkillStats.overallScore}점
                      </div>
                      <div className="text-caption-2 opacity-75">
                        종합 점수
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 레이더 차트 */}
                  <motion.div 
                    className="bg-white rounded-lg p-6 shadow-normal"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-title-4 font-semibold text-label-900">
                        종합 역량 분석
                      </h3>
                      <button
                        onClick={handleEditClick}
                        className="text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
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
                    statistics={mockMyStatistics}
                    skillStats={mockMySkillStats}
                  />
                </div>
              </>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-title-4 font-semibold text-label-900">
                    스킬 관리
                  </h3>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer">
                    스킬 추가
                  </button>
                </div>
                
                <SkillBarChart 
                  skills={profile.skills}
                  title="내 스킬 분석"
                  maxItems={15}
                  showCategory={true}
                />
              </div>
            )}

            {activeTab === 'experience' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-title-4 font-semibold text-label-900">
                    경력 및 교육 관리
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors cursor-pointer">
                      교육 추가
                    </button>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer">
                      경력 추가
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-normal">
                  {/* 교육 이력 */}
                  <div className="space-y-4 mb-8">
                    <h4 className="text-body-2 font-semibold text-label-700">교육 이력</h4>
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between border-l-4 border-primary-200 pl-4 py-2">
                        <div>
                          <h5 className="text-body-3 font-semibold text-label-900">{edu.institution}</h5>
                          <p className="text-body-3 text-label-600">{edu.degree} - {edu.field}</p>
                          <p className="text-caption-2 text-label-500">
                            {edu.startDate} ~ {edu.endDate || '현재'}
                          </p>
                        </div>
                        <button className="text-label-400 hover:text-label-600 transition-colors cursor-pointer">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 자격증 */}
                  {profile.certifications.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-body-2 font-semibold text-label-700">자격증</h4>
                        <button className="text-primary-500 hover:text-primary-600 text-caption-2 font-medium transition-colors cursor-pointer">
                          관리
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.certifications.map((cert, index) => (
                          <span 
                            key={index}
                            className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-caption-2 border border-primary-200 cursor-pointer hover:bg-primary-100 transition-colors"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'resume' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {resumesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ResumeSection
                    resumes={resumesData || []}
                    resumeStatistics={mockResumeStatistics}
                    onUploadResume={async (file) => {
                      try {
                        const response = await resumeApi.uploadResumeFile(file);
                        // 쿼리 무효화하여 목록 갱신
                        queryClient.invalidateQueries({ queryKey: ['resumes'] });
                        toast.success(`이력서 파일이 업로드되었습니다. (ID: ${response.resume_id})`);
                      } catch (err) {
                        console.error('이력서 파일 업로드 실패:', err);
                        throw err; // ResumeSection에서 에러 처리
                      }
                    }}
                    onDeleteResume={async (resumeId) => {
                      const resume = (resumesData || []).find(r => r.id === resumeId);
                      const resumeTitle = resume?.title || '이력서';

                      if (!window.confirm(`"${resumeTitle}" 이력서를 삭제하시겠습니까?`)) {
                        return;
                      }

                      try {
                        await resumeApi.deleteResume(Number(resumeId));
                        // 쿼리 무효화하여 목록 갱신
                        queryClient.invalidateQueries({ queryKey: ['resumes'] });
                        toast.success('이력서가 삭제되었습니다.');
                      } catch (err) {
                        console.error('이력서 삭제 실패:', err);
                        toast.error('이력서 삭제에 실패했습니다.');
                      }
                    }}
                    onTogglePublic={() => {
                      // TODO: 공개/비공개 설정 API 호출
                    }}
                    onViewResume={(resumeId) => {
                      // 이력서 편집 페이지로 이동
                      router.push(`/user/resume/edit/${resumeId}`);
                    }}
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfileClient;