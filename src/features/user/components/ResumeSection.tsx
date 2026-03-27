'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ResumeCard } from '@/shared/ui/ResumeCard';
import ResumeUpload from '@/shared/ui/ResumeUpload';
import { Resume, ResumeStatistics } from '@/features/user/types/user';

interface ResumeSectionProps {
  resumes?: Resume[];
  resumeStatistics?: { [resumeId: string]: ResumeStatistics };
  onUploadResume?: (file: File) => void;
  onDeleteResume?: (resumeId: string) => void;
  onTogglePublic?: (resumeId: string) => void;
  onViewResume?: (resumeId: string) => void;
}

export function ResumeSection({
  resumes = [],
  resumeStatistics = {},
  onUploadResume,
  onDeleteResume,
  onTogglePublic,
  onViewResume
}: ResumeSectionProps) {
  const t = useTranslations('user.profile.resumeSection');
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
      setUploadError(t('uploadError'));
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
          <h3 className="text-title-5 font-semibold text-label-900">
            {t('manageTitle')}
          </h3>
          <p className="text-body-3 text-label-600 mt-1">
            {t('manageSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2 border border-line-400 rounded-lg text-caption-1 font-medium text-label-700 hover:bg-label-100 transition-colors cursor-pointer"
          >
            {t('fileUpload')}
          </button>
          <button
            onClick={handleCreateResume}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-caption-1 font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            {t('createNew')}
          </button>
        </div>
      </div>

      {/* 업로드/생성 영역 */}
      {showUpload && (
        <motion.div
          className="bg-white border border-line-400 rounded-lg p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-caption-1 font-semibold text-label-900">
              {t('addTitle')}
            </h4>
            <button
              onClick={() => setShowUpload(false)}
              className="text-label-400 hover:text-label-600 transition-colors cursor-pointer"
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
          className="bg-label-100 border border-line-400 rounded-lg p-12 text-center"
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
                <h4 className="text-caption-1 font-semibold text-label-900">
                  {t('noResumes')}
                </h4>
                <p className="text-body-3 text-label-600">
                  {t('noResumesHint')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-label-100 transition-colors cursor-pointer"
                >
                  {t('fileUpload')}
                </button>
                <button
                  onClick={handleCreateResume}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  {t('createFirst')}
                </button>
              </div>
            </div>
          ) : (
            // 필터링 결과가 없는 경우
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-label-100 rounded-full flex items-center justify-center">
                <Search size={24} className="text-label-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-caption-1 font-semibold text-label-900">
                  {t('noResults')}
                </h4>
                <p className="text-body-3 text-label-600">
                  {t('noResultsHint')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-label-100 transition-colors cursor-pointer"
                >
                  {t('resetFilter')}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 통계 요약 */}
      {resumes.length > 0 && (
        <div className="bg-white border border-line-400 rounded-lg p-6">
          <h4 className="text-body-3 font-semibold text-label-900 mb-4">
            {t('summaryTitle')}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-title-5 font-bold text-primary-600">
                {statusCounts.all}
              </div>
              <div className="text-caption-3 text-label-600">{t('totalResumes')}</div>
            </div>
            <div className="text-center">
              <div className="text-title-5 font-bold text-status-caution">
                {statusCounts.draft}
              </div>
              <div className="text-caption-3 text-label-600">{t('draft')}</div>
            </div>
            <div className="text-center">
              <div className="text-title-5 font-bold text-status-correct">
                {statusCounts.completed}
              </div>
              <div className="text-caption-3 text-label-600">{t('completed')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}