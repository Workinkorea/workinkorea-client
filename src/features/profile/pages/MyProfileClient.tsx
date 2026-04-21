'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Edit3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/shared/stores/authStore';
import Layout from '@/shared/components/layout/Layout';
import UserProfileHeader from '@/features/user/components/UserProfileHeader';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/Skeleton';

const SkillBarChart = dynamic(() => import('@/features/user/components/SkillBarChart'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});
const RadarChart = dynamic(() => import('@/shared/ui/RadarChart'), {
  loading: () => <Skeleton variant="circle" className="w-[350px] h-[350px] mx-auto" />,
  ssr: false,
});
const ResumeSection = dynamic(
  () => import('@/features/user/components/ResumeSection').then(m => ({ default: m.ResumeSection })),
  { loading: () => <Skeleton className="h-48 w-full" />, ssr: false }
);
import { UserProfile, RadarChartData, Resume } from '@/features/user/types/user';
import { profileApi } from '../api/profileApi';
import { resumeApi } from '@/features/resume/api/resumeApi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ResumeListItem } from '@/shared/types/api';
import { FetchError } from '@/shared/api/fetchClient';

/**
 * 비어있는 UserProfile 베이스.
 * API 응답에 없는 필드(스킬/경력/자격증 등)는 빈 배열/0으로 두어
 * 사용자가 하드코딩된 더미 데이터를 자신의 정보로 오인하지 않도록 한다. (ISSUE-111)
 */
const EMPTY_USER_PROFILE: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
  id: 'me',
  name: '',
  email: '',
  profileImage: undefined,
  position: undefined,
  location: undefined,
  introduction: undefined,
  experience: 0,
  completedProjects: 0,
  certifications: [],
  job_status: 'available',
  skills: [],
  education: [],
  languages: [],
  githubUrl: undefined,
  linkedinUrl: undefined,
  portfolioUrl: undefined,
  preferredSalary: undefined,
};

/**
 * 지정 시간(8s) 이후에도 loading 상태가 지속되면 onTimeout 트리거.
 * skeleton 을 그대로 두지 않고 재시도 UI 로 전환해 무한 skeleton 을 방지한다.
 */
function LoadingTimeoutTrigger({ onTimeout }: { onTimeout: () => void }) {
  useEffect(() => {
    const id = setTimeout(onTimeout, 8000);
    return () => clearTimeout(id);
  }, [onTimeout]);
  return null;
}

function MyProfileClient() {
  const t = useTranslations('user.profile');
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'resume'>('overview');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  // 모듈 로드 시점의 initialize() 가 백그라운드 탭에서 보류될 수 있어
  // mount 시점에 한번 더 킥 (idempotent — 이미 초기화된 경우 no-op)
  useEffect(() => {
    useAuthStore.getState().initialize();
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !useAuthStore.getState().isInitialized) {
        useAuthStore.getState().initialize();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    if (searchParams.get('redirected') === '1') {
      toast.error('해당 페이지에 접근 권한이 없습니다.');
      router.replace('/user/profile', { scroll: false });
    }
  }, [searchParams, router]);

  // 프로필 데이터 조회
  // refetchOnWindowFocus 를 true 로 두면 백그라운드 탭에서 초기 fetch가 포커스 전까지 보류되어
  // skeleton 이 계속 표시되는 이슈가 있어 false 로 고정. 초기 fetch 는 mount 시 항상 실행.
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => profileApi.getContact(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  // 프로필과 연락처 데이터 병합 — mock 데이터 미사용 (ISSUE-111).
  // API에 없는 필드는 EMPTY_USER_PROFILE 의 빈 값을 유지.
  const profile: UserProfile | undefined = profileData ? {
    ...EMPTY_USER_PROFILE,
    id: 'me',
    name: profileData.name || '',
    email: '', // ProfileResponse 에 email 이 없음 — 서버 측 필드 추가 필요
    profileImage: profileData.profile_image_url || undefined,
    position: undefined,
    location: profileData.location || undefined,
    introduction: profileData.introduction || undefined,
    job_status: (profileData.job_status as 'available' | 'busy' | 'not-looking') || 'available',
    languages: profileData.language_skills
      ?.filter(skill => skill.language_type && skill.level)
      .map(skill => ({
        name: skill.language_type || '',
        proficiency: (skill.level as 'native' | 'advanced' | 'intermediate' | 'beginner') || 'beginner'
      })) || [],
    githubUrl: contactData?.github_url || undefined,
    linkedinUrl: contactData?.linkedin_url || undefined,
    portfolioUrl: contactData?.website_url || profileData.portfolio_url || undefined,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.created_at || new Date().toISOString(), // 서버에 updated_at 필드 추가 필요
  } : undefined;

  const isLoading = profileLoading || contactLoading;
  const error = profileError;

  // 이력서 목록 조회
  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      try {
        const response = await resumeApi.getMyResumes();

        // API 응답이 없으면 빈 배열 반환
        if (!response || !response.resume_list || !Array.isArray(response.resume_list)) {
          return [];
        }

        // API 응답을 Resume 타입으로 변환
        const resumes: Resume[] = response.resume_list.map((item: ResumeListItem) => ({
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
        // 404 = 이력서 없음 (에러 아님)
        if (err instanceof FetchError && err.status === 404) {
          return [];
        }
        // 기타 에러는 throw
        throw err;
      }
    }
  });

  // 인증 체크 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

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
      communication: 0,
      problemSolving: 0,
      teamwork: 0,
      leadership: softSkills.length > 0
        ? Math.round(softSkills.reduce((sum, s) => sum + s.level, 0) / softSkills.length)
        : 0
    };
  };

  if (authLoading || isLoading) {
    if (loadingTimedOut) {
      return (
        <Layout>
          <div className="min-h-screen bg-white py-16 flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-slate-500" />
              </div>
              <h2 className="text-title-4 font-bold text-slate-900 mb-2">
                {t('loadingTimeout.title')}
              </h2>
              <p className="text-caption-1 text-slate-500 mb-6">
                {t('loadingTimeout.subtitle')}
              </p>
              <button
                onClick={() => {
                  setLoadingTimedOut(false);
                  queryClient.invalidateQueries({ queryKey: ['profile'] });
                  queryClient.invalidateQueries({ queryKey: ['contact'] });
                  useAuthStore.getState().initialize();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-caption-1 font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {t('loadingTimeout.retry')}
              </button>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="min-h-screen bg-slate-100 py-8">
          <div className="page-container">
            <div className="animate-pulse space-y-6">
              <div className="bg-slate-100 rounded-xl h-64"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-100 rounded-xl h-96"></div>
                <div className="bg-slate-100 rounded-xl h-96"></div>
              </div>
            </div>
            <LoadingTimeoutTrigger onTimeout={() => setLoadingTimedOut(true)} />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    // 프로필 미생성 상태 → 프로필 생성 페이지로 리다이렉트
    if (error instanceof FetchError && error.status === 404) {
      router.replace('/user/profile/setup');
      return null;
    }

    return (
      <Layout>
        <div className="min-h-screen bg-white py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-title-3 font-semibold text-slate-700 mb-2">
              {t('errorTitle')}
            </h2>
            <p className="text-body-3 text-slate-500">
              {t('errorSubtitle')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-100 py-16 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-title-4 font-bold text-slate-900 mb-2">
              {t('errorTitle')}
            </h2>
            <p className="text-caption-1 text-slate-500 mb-6">
              {t('errorSubtitle')}
            </p>
            <button
              onClick={() => router.push('/user/resume/create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-caption-1 font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-[0_4px_14px_rgba(66,90,213,0.25)]"
            >
              {t('createResume')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const radarData = generateRadarData(profile.skills);

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8">
        <div className="page-container space-y-6">
          {/* 페이지 헤더 */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-title-2 font-bold text-slate-900">{t('title')}</h1>
              <p className="text-body-3 text-slate-500 mt-1">
                {t('subtitle')}
              </p>
            </div>
            
            {/* <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-body-3 font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Share2 size={16} />
                공유
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg text-body-3 font-medium hover:bg-slate-800 transition-colors"
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
            className="bg-white rounded-lg p-2 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-2">
              {[
                { key: 'overview', label: t('tabs.overview') },
                { key: 'resume', label: t('tabs.resume') },
                { key: 'skills', label: t('tabs.skills') },
                { key: 'experience', label: t('tabs.experience') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-body-3 font-medium transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
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
                <div className="grid grid-cols-1 gap-6">
                  {/* 레이더 차트 */}
                  <motion.div 
                    className="bg-white rounded-lg p-6 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-title-5 font-semibold text-slate-900">
                        {t('overview.radarTitle')}
                      </h3>
                      <button
                        onClick={handleEditClick}
                        className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <RadarChart
                        data={radarData}
                        size={350}
                      />
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-title-5 font-semibold text-slate-900">
                    {t('skillsSection.title')}
                  </h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-3 font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                    {t('skillsSection.addButton')}
                  </button>
                </div>

                {profile.skills.length > 0 ? (
                  <SkillBarChart
                    skills={profile.skills}
                    title={t('skillsSection.chartTitle')}
                    maxItems={15}
                    showCategory={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg p-12 shadow-sm text-center">
                    <p className="text-body-3 text-slate-600 mb-1">
                      {t('skillsSection.empty')}
                    </p>
                    <p className="text-caption-3 text-slate-500">
                      {t('skillsSection.emptyHint')}
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
                  <h3 className="text-title-5 font-semibold text-slate-900">
                    {t('experienceSection.title')}
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-body-3 font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                      {t('experienceSection.addEducation')}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-3 font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                      {t('experienceSection.addExperience')}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {/* 교육 이력 */}
                  <div className="space-y-4 mb-8">
                    <h4 className="text-body-2 font-semibold text-slate-700">{t('experienceSection.educationTitle')}</h4>
                    {profile.education.length > 0 ? (
                      profile.education.map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between border-l-4 border-blue-200 pl-4 py-2">
                          <div>
                            <h5 className="text-body-3 font-semibold text-slate-900">{edu.institution}</h5>
                            <p className="text-body-3 text-slate-600">{edu.degree} - {edu.field}</p>
                            <p className="text-caption-3 text-slate-500">
                              {edu.startDate} ~ {edu.endDate || t('experienceSection.present')}
                            </p>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                            <Edit3 size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-body-3 text-slate-500">
                          {t('experienceSection.educationEmpty')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 자격증 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-body-2 font-semibold text-slate-700">{t('experienceSection.certTitle')}</h4>
                      {profile.certifications.length > 0 && (
                        <button className="text-blue-500 hover:text-blue-600 text-caption-3 font-medium transition-colors cursor-pointer">
                          {t('experienceSection.certManage')}
                        </button>
                      )}
                    </div>
                    {profile.certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-caption-3 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-body-3 text-slate-500">
                          {t('experienceSection.certEmpty')}
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
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ResumeSection
                    resumes={resumesData || []}
                    resumeStatistics={{}}
                    onUploadResume={async (file) => {
                      try {
                        const response = await resumeApi.uploadResumeFile(file);
                        // 쿼리 무효화하여 목록 갱신
                        queryClient.invalidateQueries({ queryKey: ['resumes'] });
                        toast.success(t('resumeSection.uploadSuccess', { id: response.resume_id }));
                      } catch (err) {
                        throw err; // ResumeSection에서 에러 처리
                      }
                    }}
                    onDeleteResume={async (resumeId) => {
                      const resume = (resumesData || []).find(r => r.id === resumeId);
                      const resumeTitle = resume?.title || '이력서';

                      if (!window.confirm(t('resumeSection.deleteConfirm', { title: resumeTitle }))) {
                        return;
                      }

                      try {
                        await resumeApi.deleteResume(Number(resumeId));
                        // 쿼리 무효화하여 목록 갱신
                        queryClient.invalidateQueries({ queryKey: ['resumes'] });
                        toast.success(t('resumeSection.deleteSuccess'));
                      } catch (err) {
                        toast.error(t('resumeSection.deleteError'));
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