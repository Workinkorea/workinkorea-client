'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText } from 'lucide-react';
import ResumeCard from '@/components/ui/ResumeCard';
import ResumeUpload from '@/components/ui/ResumeUpload';
import { Resume, ResumeStatistics } from '@/types/user';

interface ResumeSectionProps {
  resumes?: Resume[];
  resumeStatistics?: { [resumeId: string]: ResumeStatistics };
  onUploadResume?: (file: File) => void;
  onDeleteResume?: (resumeId: string) => void;
  onTogglePublic?: (resumeId: string) => void;
  onViewResume?: (resumeId: string) => void;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  resumes = [],
  resumeStatistics = {},
  onUploadResume,
  onDeleteResume,
  onTogglePublic,
  onViewResume
}) => {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed' | 'published'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 필터링된 이력서 목록
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || resume.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // 상태별 개수
  const statusCounts = {
    all: resumes.length,
    draft: resumes.filter(r => r.status === 'draft').length,
    completed: resumes.filter(r => r.status === 'completed').length,
    published: resumes.filter(r => r.status === 'published').length
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      await onUploadResume?.(file);
      setShowUpload(false);
    } catch (err) {
      setUploadError('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateResume = () => {
    router.push('/user/resume/create');
  };

  const handleEditResume = (resumeId: string) => {
    router.push(`/user/resume/edit/${resumeId}`);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-title-4 font-semibold text-label-900">
            이력서 관리
          </h3>
          <p className="text-body-3 text-label-600 mt-1">
            이력서를 작성하고 관리하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
          >
            파일 업로드
          </button>
          <button
            onClick={handleCreateResume}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors"
          >
            <Plus size={16} />
            새 이력서 작성
          </button>
        </div>
      </div>

      {/* 업로드/생성 영역 */}
      {showUpload && (
        <motion.div
          className="bg-white border border-line-300 rounded-lg p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-body-2 font-semibold text-label-900">
              새 이력서 추가
            </h4>
            <button
              onClick={() => setShowUpload(false)}
              className="text-label-400 hover:text-label-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <ResumeUpload
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            error={uploadError || undefined}
          />
        </motion.div>
      )}

      {/* 검색 및 필터 */}

      {/* 이력서 목록 */}
      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ResumeCard
                resume={resume}
                statistics={resumeStatistics[resume.id]}
                onEdit={() => handleEditResume(resume.id)}
                onDelete={() => onDeleteResume?.(resume.id)}
                onTogglePublic={() => onTogglePublic?.(resume.id)}
                onView={() => onViewResume?.(resume.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-component-alternative border border-line-300 rounded-lg p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {resumes.length === 0 ? (
            // 이력서가 없는 경우
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <FileText size={24} className="text-primary-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-body-2 font-semibold text-label-900">
                  아직 작성한 이력서가 없습니다
                </h4>
                <p className="text-body-3 text-label-600">
                  새 이력서를 작성하거나 기존 파일을 업로드해보세요
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
                >
                  파일 업로드
                </button>
                <button
                  onClick={handleCreateResume}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors"
                >
                  첫 이력서 작성하기
                </button>
              </div>
            </div>
          ) : (
            // 필터링 결과가 없는 경우
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-line-200 rounded-full flex items-center justify-center">
                <Search size={24} className="text-label-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-body-2 font-semibold text-label-900">
                  검색 결과가 없습니다
                </h4>
                <p className="text-body-3 text-label-600">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 통계 요약 */}
      {resumes.length > 0 && (
        <div className="bg-white border border-line-300 rounded-lg p-6">
          <h4 className="text-body-2 font-semibold text-label-900 mb-4">
            이력서 요약
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-title-4 font-bold text-primary-600">
                {statusCounts.all}
              </div>
              <div className="text-caption-2 text-label-600">총 이력서</div>
            </div>
            <div className="text-center">
              <div className="text-title-4 font-bold text-amber-600">
                {statusCounts.draft}
              </div>
              <div className="text-caption-2 text-label-600">작성중</div>
            </div>
            <div className="text-center">
              <div className="text-title-4 font-bold text-green-600">
                {statusCounts.completed}
              </div>
              <div className="text-caption-2 text-label-600">완료</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;