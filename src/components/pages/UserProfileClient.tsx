'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import UserProfileHeader from '@/components/user/UserProfileHeader';
import SkillBarChart from '@/components/user/SkillBarChart';
import RadarChart from '@/components/ui/RadarChart';
import { UserProfile, RadarChartData, UserSkill } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { resumeApi } from '@/lib/api/resume';
import { profileApi } from '@/lib/api/profile';
import type { CareerHistory, ResumeListItem, ResumeDetail } from '@/lib/api/types';

const UserProfileClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'skills' | 'career'>('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });

  const handleLogout = async () => {
    await logout();
  };

  // 이력서 삭제 mutation
  const deleteResumeMutation = useMutation({
    mutationFn: (resumeId: number) => resumeApi.deleteResume(resumeId),
    onSuccess: () => {
      // 이력서 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['resumeList'] });
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });

  // 사용자 이미지 업로드 mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => resumeApi.uploadUserImage(file),
    onSuccess: () => {
      alert('이미지가 업로드되었습니다.');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleDeleteResume = async (resumeId: number, resumeTitle: string) => {
    if (window.confirm(`"${resumeTitle}" 이력서를 삭제하시겠습니까?`)) {
      try {
        await deleteResumeMutation.mutateAsync(resumeId);
        alert('이력서가 삭제되었습니다.');
      } catch (error) {
        console.error('이력서 삭제 실패:', error);
        alert('이력서 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      await uploadImageMutation.mutateAsync(selectedFile);
    } catch (error) {
      console.error('업로드 오류:', error);
    }
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
  const { data: resumeList, isLoading: resumeListLoading } = useQuery<ResumeListItem[]>({
    queryKey: ['resumeList'],
    queryFn: async () => {
      const response = await resumeApi.getMyResumes();
      return response.resume_list || [];
    },
    enabled: isAuthenticated,
  });

  // 첫 번째 이력서 상세 정보 가져오기
  const firstResumeId = resumeList?.[0]?.id;
  const { data: resumeData, isLoading: resumeDetailLoading, error } = useQuery({
    queryKey: ['resume', firstResumeId],
    queryFn: async () => {
      if (!firstResumeId) return null;
      const responseString = await resumeApi.getResumeById(firstResumeId);
      const response: ResumeDetail = JSON.parse(responseString);

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
      const languageSkills: UserSkill[] = response.language_skills
        .filter(lang => lang.language_type && lang.level)
        .map((lang, index) => ({
          id: `lang-${index}`,
          name: lang.language_type || '',
          level: proficiencyToLevel(lang.level || ''),
          average: 50, // 언어 스킬의 업계 평균 (기본값)
          category: 'language' as const,
          description: `${lang.language_type} - ${lang.level}`
        }));

      // Resume, Profile, Contact 데이터를 UserProfile 형태로 변환
      const profile: UserProfile = {
        id: String(response.user_id),
        name: profileData?.name || '',
        email: contactData?.phone_number || '', // phone_number를 임시로 email로 사용
        profileImage: response.profile_url || profileData?.profile_image_url,
        position_id: profileData?.position_id || undefined,
        location: profileData?.location || '',
        introduction: response.introduction?.[0]?.content || profileData?.introduction || '',
        experience: calculateExperience(response.career_history),
        completedProjects: 0, // API에서 제공하지 않음
        certifications: response.licenses.map(l => l.license_name),
        job_status: 'available',
        skills: languageSkills, // language_skills를 UserSkill 형태로 변환하여 추가
        education: response.schools.map(school => ({
          id: `${school.school_name}-${school.start_date}`,
          institution: school.school_name,
          degree: school.is_graduated ? '졸업' : '재학',
          field: school.major_name,
          startDate: school.start_date,
          endDate: school.end_date
        })),
        languages: response.language_skills
          .filter(lang => lang.language_type && lang.level)
          .map(lang => ({
            name: lang.language_type || '',
            proficiency: (lang.level as 'native' | 'advanced' | 'intermediate' | 'beginner') || 'beginner'
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
      const end = career.end_date ? new Date(career.end_date) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 +
                     (end.getMonth() - start.getMonth());
      totalMonths += months;
    });

    return Math.floor(totalMonths / 12);
  }

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

  if (authLoading || resumeListLoading || resumeDetailLoading) {
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

  if (error || !resumeData) {
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
              {!resumeList?.length
                ? '먼저 이력서를 작성해주세요.'
                : '잠시 후 다시 시도해주세요.'}
            </p>
            {!resumeList?.length && (
              <button
                onClick={() => router.push('/user/resume/create')}
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer"
              >
                이력서 작성하기
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const radarData = generateRadarData(resumeData.skills);
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
          {resumeList && resumeList.length > 0 ? (
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/user/resume/edit/${resumeList[0].id}`)}
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
            profile={resumeData}
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

                {/* 이미지 업로드 섹션 */}
                <div className="mb-6 p-4 border border-line-200 rounded-lg bg-background-alternative">
                  <h4 className="text-body-2 font-semibold text-label-900 mb-3">이력서 파일 업로드</h4>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                      className="flex-1 text-body-3 text-label-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-body-3 file:font-medium file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 cursor-pointer"
                    />
                    <button
                      onClick={handleUploadImage}
                      disabled={!selectedFile || uploadImageMutation.isPending}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {uploadImageMutation.isPending ? '업로드 중...' : '업로드'}
                    </button>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-caption-2 text-label-600">
                      선택된 파일: {selectedFile.name}
                    </p>
                  )}
                </div>

                {resumeList && resumeList.length > 0 ? (
                  <div className="space-y-4">
                    {resumeList.map((resume) => (
                      <div
                        key={resume.id}
                        className="border border-line-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer flex justify-between items-center"
                        onClick={() => router.push(`/user/resume/edit/${resume.id}`)}
                      >
                        <div>
                          <h4 className="text-body-2 font-semibold text-label-900 mb-2">
                            {resume.title || '이력서'}
                          </h4>
                          <p className="text-body-3 text-label-600">
                            {resume.updated_at ? new Date(resume.updated_at).toLocaleDateString('ko-KR') : '날짜 정보 없음'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id, resume.title || '이력서');
                          }}
                          disabled={deleteResumeMutation.isPending}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-body-3 font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {deleteResumeMutation.isPending ? '삭제 중...' : '삭제'}
                        </button>
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
                skills={resumeData.skills}
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
                  {resumeData.education.map((edu) => (
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
                {resumeData.certifications.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-body-2 font-semibold text-label-700">자격증</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.certifications.map((cert, index) => (
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