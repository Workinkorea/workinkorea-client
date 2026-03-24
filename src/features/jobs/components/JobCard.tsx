'use client';

import Link from 'next/link';
import { MapPin, Briefcase, Building2, Bookmark } from 'lucide-react';
import type { CompanyPost } from '@/shared/types/api';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/shared/lib/utils/utils';
import { useTranslations } from 'next-intl';

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
  const tCard = useTranslations('jobs.card');
  const tCommon = useTranslations('common');

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
      transition: { duration: 0.45, ease: 'easeInOut' as const },
    });
    bookmarkControls.set({ rotate: 0 });
  };

  return (
    <motion.div
      className={cn(
        'bg-white border border-slate-200 rounded-xl overflow-hidden',
        'hover:border-blue-300 hover:shadow-md transition-all duration-200 group',
        isExpired && 'opacity-60'
      )}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 25 }}
    >
      <Link href={`/jobs/${post.id}`} className="block h-full">
        <div className="p-4 sm:p-6 flex flex-col h-full">
          {/* Top Section: Icon + Type + Badges + Bookmark */}
          <div className="flex items-start gap-3 mb-4">
            {/* Company Icon */}
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>

            {/* Type Label + Badges */}
            <div className="flex-1 min-w-0">
              <p className="text-caption-2 font-semibold text-slate-400 mb-1">{tCard('companyPost')}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isRecent && !isExpired && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-blue-600 text-white text-caption-3 font-bold rounded-md tracking-wide">
                    NEW
                  </span>
                )}
                {isUrgent && (
                  <motion.span
                    className="inline-flex items-center px-2 py-0.5 bg-red-500 text-white text-caption-3 font-bold rounded-md"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    D-{daysLeft}
                  </motion.span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-slate-200 text-slate-500 text-caption-3 font-bold rounded-md">
                    {tCommon('status.expired')}
                  </span>
                )}
              </div>
            </div>

            {/* Bookmark Button */}
            <motion.button
              onClick={handleBookmark}
              className="shrink-0 p-1.5 rounded-lg cursor-pointer focus:outline-none hover:bg-blue-50 transition-colors"
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label={bookmarked ? tCard('bookmarkRemove') : tCard('bookmarkAdd')}
            >
              <motion.div animate={bookmarkControls}>
                <Bookmark
                  size={18}
                  className={cn(
                    'transition-colors duration-200',
                    bookmarked ? 'fill-blue-600 text-blue-600' : 'text-slate-300 group-hover:text-slate-400'
                  )}
                />
              </motion.div>
            </motion.button>
          </div>

          {/* Job Title */}
          <h3 className="text-body-1 sm:text-title-5 font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors mb-3 leading-snug">
            {post.title}
          </h3>

          {/* Location & Employment Type */}
          <div className="flex items-center gap-1.5 text-caption-2 sm:text-caption-1 text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{post.work_location || tCommon('label.location')}</span>
            {post.employment_type && (
              <>
                <span className="text-slate-300">•</span>
                <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{post.employment_type}</span>
              </>
            )}
          </div>

          {/* Salary */}
          <p className="text-body-2 sm:text-body-1 font-extrabold text-blue-600 mb-4">
            {post.salary ? `${post.salary.toLocaleString()}원` : tCommon('label.negotiable')}
          </p>

          {/* Bottom: Language Tags */}
          <div className="border-t border-slate-100 pt-4 mt-auto">
            {language.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {language.slice(0, 3).map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors"
                  >
                    {lang}
                  </span>
                ))}
                {language.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold text-slate-400">
                    +{language.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-caption-2 text-slate-400">{tCommon('label.noData')}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
