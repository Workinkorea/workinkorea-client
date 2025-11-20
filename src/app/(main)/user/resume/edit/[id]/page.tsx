'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ResumeEditor from '@/components/resume/ResumeEditor';
import { Resume } from '@/types/user';
import { resumeApi } from '@/lib/api/resume';

const EditResumePage: React.FC = () => {
  const params = useParams();
  const resumeId = params?.id ? Number(params.id) : null;

  const { data: resumeData, isLoading, error } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      if (!resumeId) throw new Error('Invalid resume ID');
      const response = await resumeApi.getResumeById(resumeId);

      // API 응답을 Resume 타입으로 변환
      const resume: Resume = {
        id: String(response.resume.id),
        userId: String(response.resume.user_id),
        title: response.resume.title,
        templateType: 'modern',
        status: 'draft',
        isPublic: true,
        content: {
          personalInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
            profileImage: response.resume.profile_url
          },
          objective: '',
          workExperience: response.resume.career_history.map(career => ({
            id: `${career.company_name}-${career.start_date}`,
            company: career.company_name,
            position: career.position_title,
            startDate: career.start_date,
            endDate: career.end_date,
            current: career.is_working,
            description: career.main_role,
            achievements: []
          })),
          education: response.resume.schools.map(school => ({
            id: `${school.school_name}-${school.start_date}`,
            institution: school.school_name,
            degree: school.is_graduated ? '졸업' : '재학',
            field: school.major_name,
            startDate: school.start_date,
            endDate: school.end_date
          })),
          skills: [],
          projects: [],
          certifications: response.resume.licenses.map(license => license.license_name),
          languages: response.resume.language_skills.map(lang => ({
            name: lang.language_type,
            proficiency: lang.level as 'native' | 'advanced' | 'intermediate' | 'beginner'
          }))
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return resume;
    },
    enabled: !!resumeId
  });

  if (isLoading) {
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
          <h2 className="text-title-3 font-semibold text-label-900 mb-2">
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