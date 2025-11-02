'use client';

import React from 'react';
import ResumeEditor from '@/components/resume/ResumeEditor';
import { Resume } from '@/types/user';

// TODO: 실제 API 호출로 대체
const mockResumeData: Resume = {
  id: 'resume-1',
  title: '프론트엔드 개발자 이력서',
  description: 'React 및 TypeScript 전문 프론트엔드 개발자로서의 경력을 정리한 이력서입니다.',
  templateType: 'modern',
  status: 'draft',
  isPublic: false,
  userId: 'me',
  content: {
    personalInfo: {
      name: '이지은',
      email: 'jieun.lee@example.com',
      phone: '010-1234-5678',
      address: '서울시 강남구'
    },
    objective: '사용자 경험을 중시하는 프론트엔드 개발자로 성장하고 싶습니다.',
    workExperience: [],
    education: [],
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    projects: [],
    certifications: ['Adobe Certified Expert', 'Google UX Design'],
    languages: [
      { name: '한국어', proficiency: 'native' },
      { name: '영어', proficiency: 'intermediate' }
    ]
  },
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
};

const EditResumePage: React.FC = () => {
  // TODO: 실제 API 호출에서 params.id를 사용하여 이력서 데이터를 가져올 예정

  return (
    <div>
      <ResumeEditor
        templateType={mockResumeData.templateType}
        initialData={mockResumeData}
        isEditMode={true}
      />
    </div>
  );
};

export default EditResumePage;