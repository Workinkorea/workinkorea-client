'use client';

import Link from 'next/link';
import { MapPin, Clock, Building2, Bookmark } from 'lucide-react';
import type { CompanyPost } from '@/shared/types/api';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';

interface JobCardProps {
  post: CompanyPost;
}

function getDaysLeft(endDate: string): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function JobCard({ post }: JobCardProps) {
  const { toggle, isBookmarked } = useBookmarks();
  const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const daysLeft = getDaysLeft(post.end_date);
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const language = post.language ? post.language.split(',').map(l => l.trim()) : [];

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      {/* 북마크 버튼 */}
      <button
        onClick={() => toggle(post.id)}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none"
        aria-label={isBookmarked(post.id) ? '북마크 해제' : '북마크 추가'}
      >
        <Bookmark
          size={18}
          className={isBookmarked(post.id) ? 'fill-blue-600 text-blue-600' : ''}
        />
      </button>

      <Link href={`/jobs/${post.id}`} className="block">
        {/* 회사 정보 */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-slate-700 group-hover:text-blue-600 transition-colors">
              기업 채용공고
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {isRecent && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <Clock className="w-3 h-3" />
                  신규
                </span>
              )}
              {isUrgent && (
                <span className="inline-flex items-center text-xs text-red-500 font-semibold">
                  마감 D-{daysLeft}
                </span>
              )}
              {isExpired && (
                <span className="text-xs text-slate-400 font-medium">마감</span>
              )}
            </div>
          </div>
        </div>

        {/* 포지션 */}
        <h4 className="text-[17px] font-medium text-slate-900 mb-3 line-clamp-2">
          {post.title}
        </h4>

        {/* 위치와 급여 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{post.work_location}</span>
            <span className="text-sm">• {post.employment_type}</span>
          </div>
          <p className="text-blue-600 font-semibold text-[15px]">
            {post.salary ? `${post.salary.toLocaleString()}원` : '연봉 협의'}
          </p>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          {language.slice(0, 3).map((lang, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
            >
              {lang}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
