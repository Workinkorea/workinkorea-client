'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Edit3, FileText, GraduationCap, Award } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import UserProfileHeader from '@/features/user/components/UserProfileHeader';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils/utils';

const SkillBarChart = dynamic(() => import('@/features/user/components/SkillBarChart'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});
const RadarChart = dynamic(() => import('@/shared/ui/RadarChart'), {
  loading: () => <Skeleton variant="circle" className="w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] mx-auto" />,
  ssr: false,
});
import { Modal } from '@/shared/ui/Modal';
import { UserProfile, RadarChartData, UserSkill } from '@/features/user/types/user';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { resumeApi } from '@/features/resume/api/resumeApi';
import { profileApi } from '@/features/profile/api/profileApi';
import type { CareerHistory, ResumeListItem } from '@/shared/types/api';

function UserProfileClient() {
  const t = useTranslations('user.profile.client');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'skills' | 'career'>('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ resumeId: number; title: string } | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
      toast.success(t('imageUploadSuccess'));
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      toast.error(t('imageUploadError'));
    },
  });

  const handleDeleteResume = (resumeId: number, resumeTitle: string) => {
    setConfirmDelete({ resumeId, title: resumeTitle });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteResumeMutation.mutateAsync(confirmDelete.resumeId);
      toast.success(t('deleteResumeSuccess'));
    } catch {
      toast.error(t('deleteResumeError'));
    } finally {
      setConfirmDelete(null);
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
      toast.error(t('noFileSelected'));
      return;
    }
    await uploadImageMutation.mutateAsync(selectedFile);
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
        <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
          <div className="page-container">
            <div className="space-y-6 sm:space-y-8">
              <div className="skeleton-shimmer rounded-xl h-48 sm:h-64" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="skeleton-shimmer rounded-xl h-80 sm:h-96" />
                <div className="skeleton-shimmer rounded-xl h-80 sm:h-96" />
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
        <div className="min-h-screen bg-white py-16 sm:py-20 lg:py-24 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
            </div>
            <h2 className="text-title-5 sm:text-title-4 font-extrabold text-label-900 mb-2">
              {t('loadingError')}
            </h2>
            <p className="text-caption-1 sm:text-body-3 text-label-500 mb-6 sm:mb-8">
              {!resumeList?.length
                ? t('noResumeHint')
                : t('retryHint')}
            </p>
            {!resumeList?.length && (
              <button
                onClick={() => router.push('/user/resume/create')}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white text-caption-1 sm:text-body-3 font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
              >
                <FileText size={16} />
                {t('writeResume')}
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
      {/* 이력서 삭제 확인 모달 */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t('deleteModalTitle')}
        size="sm"
      >
        <p className="text-body-3 text-label-700 mb-6">
          &ldquo;{confirmDelete?.title}&rdquo; {t('deleteConfirmText')}
          <br />
          <span className="text-label-500 text-caption-2 mt-1 block">{t('deleteCannotUndo')}</span>
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 border border-line-400 text-label-700 rounded-lg text-body-3 font-medium hover:bg-label-50 transition-colors cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleteResumeMutation.isPending}
            className="px-4 py-2 bg-status-error-bg0 text-white rounded-lg text-body-3 font-medium hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {deleteResumeMutation.isPending ? t('deleting') : t('delete')}
          </button>
        </div>
      </Modal>

      <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
        <div className="page-container space-y-6 sm:space-y-8">
          {/* 상단 제목 및 액션 버튼 */}
          <div className="flex items-center justify-between gap-4">
            <motion.h1
              className="text-title-4 sm:text-title-3 font-extrabold text-label-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {t('myProfile')}
            </motion.h1>
            <motion.button
              onClick={() => {
                if (resumeList && resumeList.length > 0) {
                  router.push(`/user/resume/edit/${resumeList[0].id}`);
                } else {
                  router.push('/user/resume/create');
                }
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-primary-600 text-white text-caption-2 sm:text-caption-1 font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Edit3 size={14} className="sm:size-[16px]" />
              <span className="hidden sm:inline">
                {resumeList && resumeList.length > 0 ? t('editResume') : t('createResume')}
              </span>
              <span className="sm:hidden">
                {resumeList && resumeList.length > 0 ? t('edit') : t('create')}
              </span>
            </motion.button>
          </div>

          {/* 헤더 */}
          <UserProfileHeader
            profile={resumeData}
            isOwnProfile={true}
          />

          {/* 탭 네비게이션 - 모바일 가로 스크롤, 데스크탑 고정 */}
          <motion.div
            className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex gap-1 min-w-max sm:min-w-0 bg-white rounded-xl border border-line-400 p-1.5 sm:p-2">
              {[
                { key: 'dashboard', label: t('tabDashboard'), icon: '📊' },
                { key: 'resume', label: t('tabResume'), icon: '📄' },
                { key: 'skills', label: t('tabSkills'), icon: '⭐' },
                { key: 'career', label: t('tabCareer'), icon: '🎓' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    'relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-caption-2 sm:text-body-3 font-semibold',
                    'whitespace-nowrap transition-colors duration-200 cursor-pointer',
                    activeTab === tab.key
                      ? 'text-white'
                      : 'text-label-600 hover:text-label-700 hover:bg-label-50'
                  )}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-primary-600 rounded-lg shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    />
                  )}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-body-3">{tab.icon}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 탭 컨텐츠 */}
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {activeTab === 'dashboard' && (
              <>
                {/* 프로필 완성도 */}
                {(() => {
                  const items = [
                    { label: t('checklistPhoto'), done: !!resumeData.profileImage },
                    { label: t('checklistName'), done: !!profileData?.name },
                    { label: t('checklistLocation'), done: !!profileData?.location },
                    { label: t('checklistIntro'), done: !!resumeData.introduction },
                    { label: t('checklistEducation'), done: resumeData.education.length > 0 },
                    { label: t('checklistLanguage'), done: resumeData.languages.length > 0 },
                    { label: t('checklistCert'), done: resumeData.certifications.length > 0 },
                    { label: t('checklistContact'), done: !!(contactData?.github_url || contactData?.linkedin_url || resumeData.portfolioUrl) },
                  ];
                  const done = items.filter(i => i.done).length;
                  const pct = Math.round((done / items.length) * 100);

                  return (
                    <motion.div
                      className="bg-white rounded-xl p-4 sm:p-6 lg:p-7 shadow-sm border border-line-400 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-body-3 sm:text-body-2 font-bold text-label-900">{t('profileCompletion')}</h3>
                        <span className={cn(
                          'text-title-5 sm:text-title-5 font-extrabold',
                          pct >= 80 ? 'text-primary-600' : pct >= 50 ? 'text-status-caution' : 'text-label-400'
                        )}>
                          {pct}%
                        </span>
                      </div>

                      {/* 프로그레스 바 */}
                      <div className="h-2.5 sm:h-3 bg-label-100 rounded-full overflow-hidden mb-5 sm:mb-6">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            pct >= 80 ? 'bg-primary-600' : pct >= 50 ? 'bg-status-caution-bg0' : 'bg-label-300'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        />
                      </div>

                      {/* 완성 항목 그리드 */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                        {items.map((item) => (
                          <div
                            key={item.label}
                            className={cn(
                              'flex items-center gap-1.5 sm:gap-2 text-caption-3 sm:text-caption-2 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors',
                              item.done
                                ? 'text-label-700 bg-label-50'
                                : 'text-label-400 bg-label-50/50'
                            )}
                          >
                            <span className={cn(
                              'w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center text-caption-3 font-bold shrink-0',
                              item.done
                                ? 'bg-primary-600 text-white'
                                : 'bg-label-100 text-label-400'
                            )}>
                              {item.done ? '✓' : ''}
                            </span>
                            <span className="line-clamp-1">{item.label}</span>
                          </div>
                        ))}
                      </div>

                      {pct < 100 && (
                        <motion.p
                          className="text-caption-3 sm:text-caption-2 text-label-400 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="font-semibold text-label-600">{t('completionTip')}:</span> {items.filter(i => !i.done).map(i => i.label).join(', ')}{t('completionTipSuffix')}
                        </motion.p>
                      )}
                    </motion.div>
                  );
                })()}

                <motion.div
                  className="bg-white rounded-xl p-4 sm:p-6 lg:p-7 shadow-sm border border-line-400 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-body-2 sm:text-body-1 font-bold text-label-900 mb-4 sm:mb-6 text-center">
                    {t('radarTitle')}
                  </h3>
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm flex justify-center">
                      <RadarChart
                        data={radarData}
                        averageData={averageRadarData}
                        size={280}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-5 sm:space-y-6">
                {/* 파일 업로드 섹션 */}
                <motion.div
                  className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 sm:p-6 border border-primary-200 hover:border-blue-300 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-body-3 sm:text-body-2 font-bold text-label-900">{t('imageUploadTitle')}</h4>
                      <p className="text-caption-2 sm:text-caption-1 text-label-500 mt-0.5">{t('imageUploadHint')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="flex-1 relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="px-4 py-2.5 sm:py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-primary-50/30 transition-colors">
                        <p className="text-caption-2 sm:text-caption-1 font-semibold text-label-700">
                          {selectedFile ? selectedFile.name : t('clickToSelect')}
                        </p>
                      </div>
                    </label>
                    <motion.button
                      onClick={handleUploadImage}
                      disabled={!selectedFile || uploadImageMutation.isPending}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white text-caption-2 sm:text-caption-1 font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {uploadImageMutation.isPending ? t('uploading') : t('upload')}
                    </motion.button>
                  </div>
                </motion.div>

                {/* 이력서 목록 */}
                {resumeList && resumeList.length > 0 ? (
                  <motion.div
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h4 className="text-body-3 sm:text-body-2 font-bold text-label-900 px-2 sm:px-0">{t('resumeListTitle', { count: resumeList.length })}</h4>
                    {resumeList.map((resume, idx) => (
                      <motion.div
                        key={resume.id}
                        className="flex items-center gap-4 p-4 sm:p-5 bg-white rounded-xl border border-line-400 hover:border-primary-200 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                        onClick={() => router.push(`/user/resume/edit/${resume.id}`)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-caption-1 sm:text-body-3 font-semibold text-label-900 truncate">
                            {resume.title || '이력서'}
                          </p>
                          <p className="text-caption-3 sm:text-caption-2 text-label-400 mt-1">
                            {resume.updated_at ? new Date(resume.updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : '날짜 정보 없음'}
                          </p>
                        </div>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id, resume.title || '이력서');
                          }}
                          disabled={deleteResumeMutation.isPending}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 text-caption-3 sm:text-caption-2 font-semibold text-status-error border border-status-error-bg rounded-lg hover:bg-status-error-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {deleteResumeMutation.isPending ? t('deletingInline') : t('delete')}
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-line-400">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-label-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-label-400" />
                    </div>
                    <p className="text-caption-1 sm:text-body-3 text-label-500 mb-4 sm:mb-6">{t('noResumeEmpty')}</p>
                    <button
                      onClick={() => router.push('/user/resume/create')}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white text-caption-2 sm:text-caption-1 font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
                    >
                      <FileText size={16} />
                      {t('writeResume')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <SkillBarChart
                skills={resumeData.skills}
                title={t('skillAnalysisTitle')}
                maxItems={12}
                showCategory={true}
              />
            )}

            {activeTab === 'career' && (
              <div className="space-y-5 sm:space-y-6">
                {/* 교육 이력 섹션 */}
                <motion.div
                  className="bg-white rounded-xl p-4 sm:p-6 lg:p-7 shadow-sm border border-line-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <h3 className="text-body-3 sm:text-body-2 font-bold text-label-900">{t('educationTitle')}</h3>
                  </div>

                  <div className="space-y-3">
                    {resumeData.education.length > 0 ? (
                      <>
                        {/* 타임라인 */}
                        <div className="relative pl-6 sm:pl-8">
                          {resumeData.education.map((edu, idx) => (
                            <motion.div
                              key={edu.id}
                              className="relative pb-5 sm:pb-6 last:pb-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                              {/* 타임라인 점 */}
                              <div className="absolute -left-6 sm:-left-8 top-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-primary-600 border-2 border-white shadow-sm" />

                              <div className="bg-label-50 rounded-lg p-3 sm:p-4 border border-line-200 hover:border-primary-200 hover:shadow-sm transition-all">
                                <p className="text-caption-1 sm:text-body-3 font-bold text-label-900">{edu.institution}</p>
                                <p className="text-caption-2 sm:text-caption-1 text-label-600 mt-1">
                                  {edu.degree} • {edu.field}
                                </p>
                                <p className="text-caption-3 sm:text-caption-2 text-label-400 mt-2">
                                  {edu.startDate} ~ {edu.endDate || t('present')}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-caption-2 sm:text-caption-1 text-label-400 text-center py-4">{t('noEducation')}</p>
                    )}
                  </div>
                </motion.div>

                {/* 자격증 섹션 */}
                {resumeData.certifications.length > 0 && (
                  <motion.div
                    className="bg-white rounded-xl p-4 sm:p-6 lg:p-7 shadow-sm border border-line-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-status-caution-bg flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-status-caution" />
                      </div>
                      <h3 className="text-body-3 sm:text-body-2 font-bold text-label-900">{t('certTitle')}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {resumeData.certifications.map((cert, index) => (
                        <motion.span
                          key={index}
                          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-br from-amber-50 to-yellow-50 text-amber-700 text-caption-3 sm:text-caption-2 font-semibold rounded-full border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <Award size={12} className="mr-1.5 sm:mr-2 shrink-0" />
                          {cert}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileClient;