'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ResumeEditor from '@/features/resume/components/ResumeEditor';
import { Resume } from '@/features/user/types/user';
import { resumeApi } from '@/features/resume/api/resumeApi';
import { profileApi } from '@/features/profile/api/profileApi';

// ISO 날짜 형식(2022-02-23T00:00:00)을 YYYY-MM-DD 형식으로 변환
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

function EditResumePage() {
  const params = useParams();
  const resumeId = params?.id ? Number(params.id) : null;

  // 프로필 정보 가져오기
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  // 연락처 정보 가져오기
  const { data: contactData, isLoading: isContactLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => profileApi.getContact(),
  });

  const { data: resumeData, isLoading, error } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      if (!resumeId) throw new Error('Invalid resume ID');
      const response = await resumeApi.getResumeById(resumeId);

      // introduction 배열에서 첫 번째 항목의 content를 objective로 사용
      const objective = response.introduction && response.introduction.length > 0
        ? response.introduction[0].content
        : '';

      // API 응답을 Resume 타입으로 변환
      const resume: Resume = {
        id: String(response.id),
        userId: String(response.user_id),
        title: response.title,
        templateType: 'modern',
        status: 'draft',
        isPublic: true,
        content: {
          personalInfo: {
            name: profileData?.name || '',
            email: '', // 프로필 API에 email이 없음
            phone: contactData?.phone_number || '',
            address: profileData?.address || '',
            profileImage: response.profile_url || profileData?.profile_image_url
          },
          objective: objective ?? undefined,
          workExperience: (response.career_history ?? []).map(career => ({
            id: `${career.company_name}-${career.start_date}`,
            company: career.company_name,
            position: career.position_title || '',
            achievements: [],
            startDate: formatDateForInput(career.start_date),
            endDate: formatDateForInput(career.end_date),
            current: career.is_working,
            description: career.main_role || ''
          })),
          education: (response.schools ?? []).map(school => ({
            id: `${school.school_name}-${school.start_date}`,
            institution: school.school_name,
            degree: school.is_graduated ? '졸업' : '재학',
            field: school.major_name,
            startDate: formatDateForInput(school.start_date),
            endDate: formatDateForInput(school.end_date)
          })),
          skills: [],
          projects: [],
          certifications: (response.licenses ?? []).map(license => license.license_name).filter((name): name is string => !!name),
          languages: (response.language_skills ?? [])
            .filter(lang => lang.language_type && lang.level)
            .map(lang => ({
              name: lang.language_type || '',
              proficiency: (lang.level as 'native' | 'advanced' | 'intermediate' | 'beginner') || 'beginner'
            }))
        },
        // 자격증 상세 정보 저장 (ResumeEditor에서 사용)
        licenses: (response.licenses ?? []).map(license => ({
          license_name: license.license_name ?? '',
          license_agency: license.license_agency ?? '',
          license_date: formatDateForInput(license.license_date)
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return resume;
    },
    enabled: !!resumeId && !!profileData && !!contactData
  });

  if (isLoading || isProfileLoading || isContactLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-label-500">이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-title-4 font-semibold text-label-900 mb-2">
            이력서를 불러올 수 없습니다
          </h2>
          <p className="text-body-3 text-label-500">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResumeEditor
        templateType={resumeData.templateType}
        initialData={resumeData}
        isEditMode={true}
        resumeId={resumeId}
      />
    </div>
  );
};

export default EditResumePage;