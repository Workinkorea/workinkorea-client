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
    id: 'me',
    name: profileData.name || '',
    email: '', // 이메일은 별도 API나 auth에서 가져와야 함
    profileImage: profileData.profile_image_url || undefined,
    position: '', // position은 position_id를 매핑해야 함
    location: profileData.location || '',
    introduction: profileData.introduction || '',
    experience: 0, // career 필드에서 계산 가능
    completedProjects: 0,
    certifications: [],
    job_status: (profileData.job_status as 'available' | 'busy' | 'not-looking') || 'available',
    skills: [],
    education: [],
    languages: profileData.language_skills
      ?.filter(skill => skill.language_type && skill.level)
      .map(skill => ({
        name: skill.language_type || '',
        proficiency: (skill.level as 'native' | 'advanced' | 'intermediate' | 'beginner') || 'beginner'
      })) || [],
    githubUrl: contactData?.github_url,
    linkedinUrl: contactData?.linkedin_url,
    portfolioUrl: contactData?.website_url || profileData.portfolio_url,
    preferredSalary: undefined,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.created_at || new Date().toISOString()
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

  // 빈 통계 데이터 (API가 제공될 때까지)
  const statistics: ProfileStatistics = {
    profileViews: 0,
    contactRequests: 0,
    skillEndorsements: 0,
    averageRating: 0
  };

  const skillStats: SkillStats = {
    totalSkills: profile.skills.length,
    aboveAverageSkills: 0,
    topSkillCategory: 'technical',
    overallScore: 0,
    industryRanking: 0
  };

  const resumeStatistics: { [resumeId: string]: ResumeStatistics } = {};

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
                {/* 성과 요약 배너 - 데이터가 있을 때만 표시 */}
                {skillStats.overallScore > 0 && (
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
                          동일 경력 대비 상위 {100 - skillStats.industryRanking}%에 위치하고 있습니다.
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-title-2 font-bold">
                          {skillStats.overallScore}점
                        </div>
                        <div className="text-caption-2 opacity-75">
                          종합 점수
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

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
                    statistics={statistics}
                    skillStats={skillStats}
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

                {profile.skills.length > 0 ? (
                  <SkillBarChart
                    skills={profile.skills}
                    title="내 스킬 분석"
                    maxItems={15}
                    showCategory={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg p-12 shadow-normal text-center">
                    <p className="text-body-3 text-label-500">
                      등록된 스킬이 없습니다. 스킬을 추가해보세요.
                    </p>
                  </div>
                )}
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
                    {profile.education.length > 0 ? (
                      profile.education.map((edu) => (
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-body-3 text-label-400">
                          등록된 교육 이력이 없습니다.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 자격증 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-body-2 font-semibold text-label-700">자격증</h4>
                      {profile.certifications.length > 0 && (
                        <button className="text-primary-500 hover:text-primary-600 text-caption-2 font-medium transition-colors cursor-pointer">
                          관리
                        </button>
                      )}
                    </div>
                    {profile.certifications.length > 0 ? (
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
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-body-3 text-label-400">
                          등록된 자격증이 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
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
                    resumeStatistics={resumeStatistics}
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