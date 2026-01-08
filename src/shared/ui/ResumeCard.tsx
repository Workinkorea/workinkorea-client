'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Download,
  Edit3,
  Trash2,
  Globe,
  Lock,
  Calendar,
  Clock
} from 'lucide-react';
import { Resume, ResumeStatistics } from '@/features/user/types/user';

interface ResumeCardProps {
  resume: Resume;
  statistics?: ResumeStatistics;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublic?: () => void;
  onView?: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  statistics,
  onEdit,
  onDelete,
  onTogglePublic,
  onView
}) => {
  const getStatusColor = (status: Resume['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'published':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: Resume['status']) => {
    switch (status) {
      case 'draft':
        return '작성중';
      case 'completed':
        return '작성완료';
      case 'published':
        return '게시됨';
      default:
        return '알 수 없음';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white border border-line-300 rounded-lg p-6 hover:shadow-normal transition-all duration-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-body-2 font-semibold text-label-900 truncate">
              {resume.title}
            </h3>
            <div className={`px-2 py-1 rounded-full text-caption-2 font-medium border ${getStatusColor(resume.status)}`}>
              {getStatusText(resume.status)}
            </div>
          </div>

          {resume.description && (
            <p className="text-body-3 text-label-600 line-clamp-2 mb-2">
              {resume.description}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-caption-2 text-label-500">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>수정: {formatDate(resume.updatedAt)}</span>
            </div>
            {statistics?.lastViewedAt && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>조회: {formatDate(statistics.lastViewedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 공개/비공개 아이콘 */}
        <button
          onClick={onTogglePublic}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            resume.isPublic
              ? 'text-primary-600 hover:bg-primary-50'
              : 'text-label-400 hover:bg-component-alternative'
          }`}
          title={resume.isPublic ? '공개' : '비공개'}
        >
          {resume.isPublic ? <Globe size={16} /> : <Lock size={16} />}
        </button>
      </div>

      {/* 통계 정보 */}
      {statistics && (
        <div className="grid grid-cols-3 gap-4 py-3 mb-4 border-t border-line-200">
          <div className="text-center">
            <div className="text-body-3 font-semibold text-label-900">
              {statistics.totalViews.toLocaleString()}
            </div>
            <div className="text-caption-2 text-label-500">지원 건수</div>
          </div>
          <div className="text-center">
            <div className="text-body-3 font-semibold text-label-900">
              {statistics.downloadCount.toLocaleString()}
            </div>
            <div className="text-caption-2 text-label-500">열람 횟수</div>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-line-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-2 px-3 py-1.5 text-caption-1 font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
          >
            <Eye size={14} />
            미리보기
          </button>

          {statistics && (
            <button className="flex items-center gap-2 px-3 py-1.5 text-caption-1 font-medium text-label-600 hover:bg-component-alternative rounded-lg transition-colors cursor-pointer">
              <Download size={14} />
              다운로드
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 text-label-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
            title="편집"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-label-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeCard;