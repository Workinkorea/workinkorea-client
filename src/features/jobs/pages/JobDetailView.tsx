'use client';

import { useState } from 'react';
import { MapPin, DollarSign, Briefcase, GraduationCap, Languages, Calendar, Building2, FileText, Bookmark, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { Modal } from '@/shared/ui/Modal';
import { useJobApplication } from '@/features/jobs/hooks/useJobApplication';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { resumeApi } from '@/features/resume/api/resumeApi';
import type { CompanyPostDetailResponse } from '@/shared/types/api';

interface JobDetailViewProps {
  job: CompanyPostDetailResponse;
}

function getDaysLeft(endDate: string): number | null {
  if (!endDate) return null;
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function JobDetailView({ job }: JobDetailViewProps) {
  const t = useTranslations('jobs.detail');
  const tCommon = useTranslations('common');
  const tCard = useTranslations('jobs.card');
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { mutate: applyToJob, isPending } = useJobApplication();
  const { toggle, isBookmarked } = useBookmarks();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const { data: resumeData, isLoading: isLoadingResumes } = useQuery({
    queryKey: ['resumes', 'me'],
    queryFn: () => resumeApi.getMyResumes(),
    enabled: showApplyModal,
    staleTime: 5 * 60 * 1000,
  });

  const resumes = resumeData?.resume_list ?? [];
  const daysLeft = getDaysLeft(job.end_date);
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const language = job.language ? job.language.split(',').map(l => l.trim()) : [];

  const redirectToLogin = () => {
    router.push(`/login-select?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const handleApply = () => {
    if (!isAuthLoading && !isAuthenticated) {
      redirectToLogin();
      return;
    }
    setSelectedResumeId(null);
    setShowApplyModal(true);
  };

  const handleBookmarkToggle = () => {
    if (!isAuthLoading && !isAuthenticated) {
      redirectToLogin();
      return;
    }
    toggle(job.id);
  };

  const handleConfirmApply = () => {
    applyToJob(
      {
        company_post_id: job.id,
        ...(selectedResumeId !== null && { resume_id: selectedResumeId }),
      },
      { onSuccess: () => setShowApplyModal(false) }
    );
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('linkCopied'));
    } catch {
      toast.error(t('linkCopyFailed'));
    }
  };

  const bookmarked = isBookmarked(job.id);

  return (
    <Layout>
      {/* Resume Selection Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={t('selectResume')} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('selectResumeDesc')}</p>

          {isLoadingResumes ? (
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="h-16 skeleton-shimmer rounded-lg" />
              ))}
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {resumes.map(resume => (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResumeId(resume.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                    selectedResumeId === resume.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${selectedResumeId === resume.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <FileText size={18} className={selectedResumeId === resume.id ? 'text-blue-600' : 'text-slate-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{resume.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('modified', { date: new Date(resume.updated_at).toLocaleDateString() })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-700 mb-1">{t('noResume')}</p>
              <p className="text-xs text-slate-400 mb-4">{t('noResumeDesc')}</p>
              <Link
                href="/user/resume/create"
                onClick={() => setShowApplyModal(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {t('createResume')}
              </Link>
            </div>
          )}

          {resumes.length > 0 && (
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {tCommon('button.cancel')}
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={isPending || selectedResumeId === null}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isPending ? t('applying') : tCommon('button.apply')}
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Mobile Floating Apply Button */}
      {!isExpired && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 lg:hidden">
          <motion.button
            onClick={handleApply}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-body-2 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-colors cursor-pointer"
          >
            {tCommon('button.apply')}
          </motion.button>
        </div>
      )}

      <div className="min-h-screen bg-white py-4 sm:py-6 pb-24 lg:pb-8">
        <div className="page-container">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-medium mb-4 sm:mb-6 cursor-pointer transition-colors"
          >
            <ChevronLeft size={18} />
            {t('backToListFull')}
          </button>

          {/* Desktop Layout: 2-Column (Main + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
            {/* Main Content Column */}
            <div className="space-y-6">
              {/* Hero Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 sm:p-7 lg:p-8 space-y-6">
                  {/* Top Row: Icon + Info + Actions */}
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Company Icon */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-caption-2 font-semibold text-slate-400 mb-2">{t('companyPost')}</p>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {isUrgent && (
                            <motion.span
                              className="inline-flex px-2.5 py-1 bg-red-500 text-white text-caption-3 font-bold rounded-md"
                              animate={{ opacity: [1, 0.6, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              D-{daysLeft}
                            </motion.span>
                          )}
                          {isExpired && (
                            <span className="inline-flex px-2.5 py-1 bg-slate-200 text-slate-500 text-caption-3 font-bold rounded-md">
                              {t('expiredBadge')}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h1 className="text-title-4 sm:text-title-3 lg:text-title-2 font-extrabold text-slate-900 leading-tight line-clamp-3">
                          {job.title}
                        </h1>
                      </div>
                    </div>

                    {/* Desktop: Action Buttons */}
                    <div className="hidden lg:flex items-center gap-2 shrink-0">
                      <motion.button
                        onClick={handleBookmarkToggle}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none"
                        whileTap={{ scale: 0.9 }}
                        aria-label={bookmarked ? tCard('bookmarkRemove') : t('bookmarkBtn')}
                      >
                        <Bookmark size={20} className={bookmarked ? 'fill-blue-600 text-blue-600' : ''} />
                      </motion.button>
                      <motion.button
                        onClick={handleShare}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none"
                        whileTap={{ scale: 0.9 }}
                        aria-label={t('shareLabel')}
                      >
                        <Share2 size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Key Info Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex flex-col">
                      <p className="text-caption-3 font-semibold text-slate-400 mb-1">{tCommon('label.salary')}</p>
                      <p className="text-body-3 font-extrabold text-blue-600">
                        {job.salary ? `${job.salary.toLocaleString()}` : tCommon('label.negotiable')}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-caption-3 font-semibold text-slate-400 mb-1">{tCommon('label.location')}</p>
                      <p className="text-body-3 font-bold text-slate-900 line-clamp-2">{job.work_location}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-caption-3 font-semibold text-slate-400 mb-1">{tCommon('label.employmentType')}</p>
                      <p className="text-body-3 font-bold text-slate-900">{job.employment_type}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-caption-3 font-semibold text-slate-400 mb-1">{tCommon('label.workingHours')}</p>
                      <p className="text-body-3 font-bold text-slate-900">{t('workingHoursUnit', { hours: job.working_hours })}</p>
                    </div>
                  </div>

                  {/* Recruitment Period */}
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <Calendar className="text-amber-600 shrink-0" size={18} />
                    <p className="text-caption-1 text-slate-900">
                      <span className="font-semibold">{t('recruitPeriod')}:</span> {job.start_date} ~ {job.end_date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 lg:p-8 space-y-6">
                <h2 className="text-[18px] sm:text-title-4 font-extrabold text-slate-900">{t('jobDetails')}</h2>

                {/* Job Content Section */}
                <div className="space-y-3">
                  <h3 className="text-body-3 font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    {t('jobContent')}
                  </h3>
                  <p className="text-caption-1 text-slate-700 leading-relaxed whitespace-pre-wrap">{job.content}</p>
                </div>

                <div className="border-t border-slate-100" />

                {/* Experience Section */}
                <div className="space-y-3">
                  <h3 className="text-body-3 font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    {t('experience')}
                  </h3>
                  <p className="text-caption-1 text-slate-700 leading-relaxed">{job.work_experience}</p>
                </div>

                <div className="border-t border-slate-100" />

                {/* Education Section */}
                <div className="space-y-3">
                  <h3 className="text-body-3 font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-600" />
                    {t('education')}
                  </h3>
                  <p className="text-caption-1 text-slate-700 leading-relaxed">{job.education}</p>
                </div>

                {/* Languages Section */}
                {language.length > 0 && (
                  <>
                    <div className="border-t border-slate-100" />

                    <div className="space-y-3">
                      <h3 className="text-body-3 font-bold text-slate-900 flex items-center gap-2">
                        <Languages size={16} className="text-blue-600" />
                        {t('requiredLanguage')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {language.map((lang, index) => (
                          <span
                            key={index}
                            className="inline-flex px-3 py-1.5 bg-blue-50 text-blue-700 text-caption-2 font-semibold rounded-lg border border-blue-200"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Sidebar: Apply Card */}
            <div className="hidden lg:block">
              <motion.div
                className="bg-white rounded-xl border border-slate-200 p-7 sticky top-[calc(65px+20px)] space-y-4"
                initial={{ y: 0 }}
                whileInView={{ y: 0 }}
              >
                {/* Salary Display */}
                <div className="space-y-1">
                  <p className="text-caption-3 font-semibold text-slate-400">{tCommon('label.salary')}</p>
                  <p className="text-title-1 font-extrabold text-blue-600 leading-tight">
                    {job.salary ? `${job.salary.toLocaleString()}` : tCommon('label.negotiable')}
                  </p>
                </div>

                {/* Apply Button */}
                {isExpired ? (
                  <button className="w-full py-4 bg-slate-100 text-slate-400 text-center rounded-lg font-bold text-body-2 cursor-not-allowed">
                    {t('expiredPostShort')}
                  </button>
                ) : (
                  <motion.button
                    onClick={handleApply}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-body-2 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-colors cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                  >
                    {tCommon('button.apply')}
                  </motion.button>
                )}

                {/* Bookmark Button */}
                <motion.button
                  onClick={handleBookmarkToggle}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 rounded-lg font-semibold text-caption-1 hover:bg-slate-50 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                >
                  <Bookmark size={16} className={bookmarked ? 'fill-blue-600 text-blue-600' : ''} />
                  {bookmarked ? t('bookmarkSaved') : t('bookmarkSave')}
                </motion.button>

                {/* Share Button */}
                <motion.button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 rounded-lg font-semibold text-caption-1 hover:bg-slate-50 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={16} />
                  {t('copyLink')}
                </motion.button>

                {/* Recruitment Info */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2 mt-6 pt-6 border-t">
                  <p className="text-caption-3 font-semibold text-slate-400">{tCommon('label.period')}</p>
                  <p className="text-caption-1 font-semibold text-slate-900">{job.start_date}</p>
                  <p className="text-caption-1 text-slate-600">~ {job.end_date}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
