'use client';

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
import { cn } from '@/shared/lib/utils/utils';
import { Resume, ResumeStatistics } from '@/features/user/types/user';

interface ResumeCardProps {
  resume: Resume;
  statistics?: ResumeStatistics;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublic?: () => void;
  onView?: () => void;
}

export function ResumeCard({
  resume,
  statistics,
  onEdit,
  onDelete,
  onTogglePublic,
  onView
}: ResumeCardProps) {
  const getStatusColor = (status: Resume['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-500-bg text-amber-500 border-amber-500-bg';
      case 'completed':
        return 'bg-emerald-500-bg text-emerald-500 border-emerald-500-bg';
      case 'published':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-body-2 font-semibold text-slate-900 truncate">
              {resume.title}
            </h3>
            <div className={cn(`px-2 py-0.5 rounded-md text-caption-3 font-medium border`, getStatusColor(resume.status))}>
              {getStatusText(resume.status)}
            </div>
          </div>

          {resume.description && (
            <p className="text-body-3 text-slate-600 line-clamp-2 mb-2">
              {resume.description}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-caption-3 text-slate-500">
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
          className={cn(
            'p-2 rounded-lg transition-colors cursor-pointer',
            resume.isPublic
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-slate-400 hover:bg-slate-100'
          )}
          title={resume.isPublic ? '공개' : '비공개'}
        >
          {resume.isPublic ? <Globe size={16} /> : <Lock size={16} />}
        </button>
      </div>

      {/* 통계 정보 */}
      {statistics && (
        <div className="grid grid-cols-3 gap-4 py-3 mb-4 border-t border-slate-100">
          <div className="text-center">
            <div className="text-caption-1 font-semibold text-slate-900">
              {statistics.totalViews.toLocaleString()}
            </div>
            <div className="text-caption-3 text-slate-500">지원 건수</div>
          </div>
          <div className="text-center">
            <div className="text-caption-1 font-semibold text-slate-900">
              {statistics.downloadCount.toLocaleString()}
            </div>
            <div className="text-caption-3 text-slate-500">열람 횟수</div>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-2 px-3 py-1.5 text-caption-2 font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Eye size={14} />
            미리보기
          </button>

          {statistics && (
            <button className="flex items-center gap-2 px-3 py-1.5 text-caption-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              <Download size={14} />
              다운로드
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="편집"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-600-bg rounded-lg transition-colors cursor-pointer"
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}