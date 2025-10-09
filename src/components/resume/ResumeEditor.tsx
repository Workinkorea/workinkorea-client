'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Resume, ResumeTemplate } from '@/types/user';

interface ResumeEditorProps {
  templateType: ResumeTemplate;
  initialData?: Resume;
  isEditMode?: boolean;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  templateType,
  initialData,
  isEditMode = false
}) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [resumeData, setResumeData] = useState<Partial<Resume>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    templateType,
    status: initialData?.status || 'draft',
    isPublic: initialData?.isPublic || false,
    content: {
      personalInfo: {
        name: initialData?.content?.personalInfo?.name || '',
        email: initialData?.content?.personalInfo?.email || '',
        phone: initialData?.content?.personalInfo?.phone || '',
        address: initialData?.content?.personalInfo?.address || '',
        profileImage: initialData?.content?.personalInfo?.profileImage
      },
      objective: initialData?.content?.objective || '',
      workExperience: initialData?.content?.workExperience || [],
      education: initialData?.content?.education || [],
      skills: initialData?.content?.skills || [],
      projects: initialData?.content?.projects || [],
      certifications: initialData?.content?.certifications || [],
      languages: initialData?.content?.languages || []
    }
  });

  const handleSave = async (status: 'draft' | 'completed' | 'published' = 'draft') => {
    setIsSaving(true);

    try {
      const dataToSave = {
        ...resumeData,
        status,
        updatedAt: new Date().toISOString()
      };

      console.log('이력서 저장:', dataToSave);
      // TODO: 실제 API 호출 구현

      // 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (status === 'completed' || status === 'published') {
        // 완료 또는 게시 시 프로필 페이지로 이동
        router.push('/user/profile?tab=resume');
      }
    } catch (error) {
      console.error('이력서 저장 실패:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handlePreview = () => {
    console.log('이력서 미리보기');
    // TODO: 미리보기 모달 또는 페이지 구현
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-label-600 hover:text-label-900 hover:bg-component-alternative rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-title-2 font-bold text-label-900">
              {isEditMode ? '이력서 편집' : '새 이력서 작성'}
            </h1>
            <p className="text-body-3 text-label-600">
              {templateType} 템플릿으로 이력서를 작성하고 있습니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors cursor-pointer"
          >
            <Eye size={16} />
            미리보기
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-line-300 text-label-700 rounded-lg text-body-3 font-medium hover:bg-line-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {isSaving ? '저장중...' : '임시저장'}
          </button>
          <button
            onClick={() => handleSave('completed')}
            disabled={isSaving || !resumeData.title}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            완료
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols gap-8">
        {/* 편집 영역 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-body-2 font-semibold text-label-900 mb-4">
              기본 정보
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  이력서 제목 *
                </label>
                <input
                  type="text"
                  value={resumeData.title || ''}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  placeholder="예: 프론트엔드 개발자 이력서"
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  간단한 설명
                </label>
                <textarea
                  value={resumeData.description || ''}
                  onChange={(e) => setResumeData({ ...resumeData, description: e.target.value })}
                  placeholder="이력서에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* 개인 정보 */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-body-2 font-semibold text-label-900 mb-4">
              개인 정보
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={resumeData.content?.personalInfo?.name || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    content: {
                      ...resumeData.content!,
                      personalInfo: {
                        ...resumeData.content!.personalInfo!,
                        name: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  value={resumeData.content?.personalInfo?.email || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    content: {
                      ...resumeData.content!,
                      personalInfo: {
                        ...resumeData.content!.personalInfo!,
                        email: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={resumeData.content?.personalInfo?.phone || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    content: {
                      ...resumeData.content!,
                      personalInfo: {
                        ...resumeData.content!.personalInfo!,
                        phone: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-body-3 font-medium text-label-700 mb-2">
                  주소
                </label>
                <input
                  type="text"
                  value={resumeData.content?.personalInfo?.address || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    content: {
                      ...resumeData.content!,
                      personalInfo: {
                        ...resumeData.content!.personalInfo!,
                        address: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-body-3 font-medium text-label-700 mb-2">
                자기소개 / 목표
              </label>
              <textarea
                value={resumeData.content?.objective || ''}
                onChange={(e) => setResumeData({
                  ...resumeData,
                  content: {
                    ...resumeData.content!,
                    objective: e.target.value
                  }
                })}
                placeholder="자신을 소개하고 목표를 간단히 작성해주세요"
                rows={4}
                className="w-full px-3 py-2 border border-line-300 rounded-lg text-body-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </motion.div>

          {/* TODO(human) */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-body-3 font-semibold text-amber-800 mb-2">
              추가 섹션 구현 필요
            </h4>
            <p className="text-caption-1 text-amber-700">
              경력사항, 학력, 스킬, 프로젝트, 자격증 등의 섹션을 추가로 구현해야 합니다.
              각 섹션은 동적으로 항목을 추가/삭제할 수 있는 형태로 만들어야 합니다.
            </p>
          </div>
        </div>

        {/* 미리보기 영역 */}
        {/* <div className="lg:sticky lg:top-8">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-normal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-body-2 font-semibold text-label-900 mb-4">
              실시간 미리보기
            </h3>

            <div className="border border-line-200 rounded-lg p-4 bg-gray-50 min-h-[600px]">
              <div className="text-center text-label-500">
                <div className="w-16 h-16 mx-auto bg-line-200 rounded-lg flex items-center justify-center mb-4">
                  <Edit3 size={24} />
                </div>
                <h4 className="text-body-3 font-medium mb-2">이력서 미리보기</h4>
                <p className="text-caption-2">
                  작성하신 내용이 실시간으로 여기에 표시됩니다
                </p>

                {resumeData.title && (
                  <div className="mt-6 text-left">
                    <h5 className="text-body-2 font-semibold text-label-900 mb-2">
                      {resumeData.title}
                    </h5>
                    {resumeData.content?.personalInfo?.name && (
                      <p className="text-body-3 text-label-700">
                        {resumeData.content.personalInfo.name}
                      </p>
                    )}
                    {resumeData.content?.personalInfo?.email && (
                      <p className="text-caption-1 text-label-600">
                        {resumeData.content.personalInfo.email}
                      </p>
                    )}
                    {resumeData.content?.objective && (
                      <div className="mt-4">
                        <h6 className="text-caption-1 font-semibold text-label-700 mb-1">
                          자기소개
                        </h6>
                        <p className="text-caption-2 text-label-600">
                          {resumeData.content.objective}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div> */}
      </div>
    </div>
  );
};

export default ResumeEditor;