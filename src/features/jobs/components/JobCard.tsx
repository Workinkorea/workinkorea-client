'use client';

import Link from 'next/link';
import { MapPin, Clock, Building2, Bookmark } from 'lucide-react';
import type { CompanyPost } from '@/shared/types/api';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import { motion, useAnimation } from 'framer-motion';

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
  const bookmarkControls = useAnimation();

  const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const daysLeft = getDaysLeft(post.end_date);
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const language = post.language ? post.language.split(',').map(l => l.trim()) : [];
  const bookmarked = isBookmarked(post.id);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(post.id);
    await bookmarkControls.start({
      rotate: [0, -15, 360],
      scale: [1, 1.3, 1],
      transition: { duration: 0.45, ease: 'easeInOut' },
    });
    bookmarkControls.set({ rotate: 0 });
  };

  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-xl p-6 group hover:border-blue-200 hover:shadow-lg transition-colors duration-200"
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 320, damping: 25 }}
    >
      <Link href={`/jobs/${post.id}`} className="block">
        {/* 회사 정보 + 북마크 */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] text-slate-700 group-hover:text-blue-600 transition-colors">
              기업 채용공고
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {isRecent && (
                <motion.span
                  className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium"
                  animate={{ opacity: [1, 0.45, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Clock className="w-3 h-3" />
                  신규
                </motion.span>
              )}
              {isUrgent && (
                <motion.span
                  className="inline-flex items-center text-xs text-red-500 font-semibold"
                  animate={{ x: [0, -2, 2, -2, 2, 0] }}
                  transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 2.5 }}
                >
                  마감 D-{daysLeft}
                </motion.span>
              )}
              {isExpired && (
                <span className="text-xs text-slate-400 font-medium">마감</span>
              )}
            </div>
          </div>
          {/* 북마크 버튼 */}
          <motion.button
            onClick={handleBookmark}
            className="shrink-0 p-1.5 rounded-lg cursor-pointer focus:outline-none"
            whileHover={{ backgroundColor: '#EFF6FF', scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
          >
            <motion.div animate={bookmarkControls}>
              <Bookmark
                size={18}
                className={`transition-colors duration-200 ${
                  bookmarked ? 'fill-blue-600 text-blue-600' : 'text-slate-400'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* 포지션 */}
        <h4 className="text-[17px] font-medium text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
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
    </motion.div>
  );
}
