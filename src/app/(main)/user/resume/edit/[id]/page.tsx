'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import ResumeEditor from '@/features/resume/components/ResumeEditor';
import { resumeApi } from '@/features/resume/api/resumeApi';
import { profileApi } from '@/features/profile/api/profileApi';
import { mapResumeResponseToForm } from '@/features/resume/lib/mapResumeForm';
import { Button } from '@/shared/ui/Button';

function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('resume.editor');
  const resumeId = params?.id ? Number(params.id) : null;

  // 프로필 + 연락처 (이력서 프리필 보조 데이터)
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  const { data: contactData, isLoading: isContactLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => profileApi.getContact(),
  });

  // 이력서 원본 → 바로 ResumeFormData 로 변환
  const {
    data: formDefaults,
    isLoading: isResumeLoading,
    isPending: isResumePending,
    error,
  } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      if (!resumeId) throw new Error('Invalid resume ID');
      const response = await resumeApi.getResumeById(resumeId);
      return mapResumeResponseToForm(response, {
        profile: profileData,
        contact: contactData,
      });
    },
    enabled: !!resumeId && !!profileData && !!contactData,
  });

  // 모든 의존 쿼리 로딩 중이거나 resume 쿼리가 아직 시작 전(pending)인 경우
  const isLoading =
    isProfileLoading || isContactLoading || isResumeLoading || isResumePending;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-500">{t('loadingText')}</p>
        </div>
      </div>
    );
  }

  if (error || !formDefaults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h2 className="text-title-4 font-semibold text-slate-900 mb-2">
            {t('loadError')}
          </h2>
          <p className="text-body-3 text-slate-500 mb-6">
            {t('loadErrorDesc')}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/user/resume')}
          >
            <ArrowLeft size={16} className="mr-2" />
            {t('backToList')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResumeEditor
        templateType="modern"
        formDefaults={formDefaults}
        isEditMode={true}
        resumeId={resumeId}
      />
    </div>
  );
}

export default EditResumePage;
