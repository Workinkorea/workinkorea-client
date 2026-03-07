'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, GraduationCap, Languages, Calendar, Building2, FileText, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Layout from '@/shared/components/layout/Layout';
import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import { Modal } from '@/shared/ui/Modal';
import JobDetailActions from './JobDetailActions';
import { useJobApplication } from '@/features/jobs/hooks/useJobApplication';
import { useBookmarks } from '@/features/jobs/hooks/useBookmarks';
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

  const handleApply = () => {
    setSelectedResumeId(null);
    setShowApplyModal(true);
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
      toast.success('링크가 복사되었습니다');
    } catch {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  return (
    <Layout>
      <HeaderClient type="homepage" />

      {/* 이력서 선택 모달 */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="이력서 선택" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">지원할 이력서를 선택해주세요.</p>

          {isLoadingResumes ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-14 skeleton-shimmer rounded-lg" />)}
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
                  <div className={`p-2 rounded-lg ${selectedResumeId === resume.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <FileText size={18} className={selectedResumeId === resume.id ? 'text-blue-600' : 'text-slate-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{resume.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(resume.updated_at).toLocaleDateString('ko-KR')} 수정
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-700 mb-1">등록된 이력서가 없습니다</p>
              <p className="text-xs text-slate-400 mb-4">이력서를 먼저 작성해주세요</p>
              <Link
                href="/user/resume/create"
                onClick={() => setShowApplyModal(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                이력서 작성하기
              </Link>
            </div>
          )}

          {resumes.length > 0 && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={isPending || selectedResumeId === null}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isPending ? '지원 중...' : '지원하기'}
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* 모바일 플로팅 지원 버튼 */}
      {!isExpired && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:hidden">
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-base shadow-lg transition-colors cursor-pointer"
          >
            지원하기
          </button>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 py-8 pb-28 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobDetailActions />

          {/* 공고 헤더 */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-[20px] md:text-[28px] font-extrabold text-slate-900 mb-1">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] md:text-[15px] text-slate-600">기업 채용공고</p>
                      {isUrgent && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-200">
                          마감 D-{daysLeft}
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-full">
                          마감됨
                        </span>
                      )}
                    </div>
                  </div>
                  {/* 북마크 & 공유 버튼 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggle(job.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none"
                      aria-label={isBookmarked(job.id) ? '북마크 해제' : '북마크'}
                    >
                      <Bookmark size={20} className={isBookmarked(job.id) ? 'fill-blue-600 text-blue-600' : ''} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none"
                      aria-label="링크 공유"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <MapPin className="text-blue-600 shrink-0" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">근무지</p>
                  <p className="text-sm font-medium text-slate-900">{job.work_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <DollarSign className="text-blue-600 shrink-0" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">연봉</p>
                  <p className="text-sm font-medium text-slate-900">
                    {job.salary ? `${job.salary.toLocaleString()}원` : '협의'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <Briefcase className="text-blue-600 shrink-0" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">고용 형태</p>
                  <p className="text-sm font-medium text-slate-900">{job.employment_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <Clock className="text-blue-600 shrink-0" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">근무 시간</p>
                  <p className="text-sm font-medium text-slate-900">{job.working_hours}시간/일</p>
                </div>
              </div>
            </div>

            {/* 모집 기간 */}
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="text-blue-600 shrink-0" size={20} />
              <p className="text-sm text-slate-900">
                <span className="font-medium">모집 기간:</span> {job.start_date} ~ {job.end_date}
              </p>
            </div>
          </div>

          {/* 공고 상세 내용 */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] md:text-[24px] font-extrabold text-slate-900 mb-6">공고 상세</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3">직무 내용</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.content}</p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase size={18} /> 경력
                </h3>
                <p className="text-sm text-slate-700">{job.work_experience}</p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} /> 학력
                </h3>
                <p className="text-sm text-slate-700">{job.education}</p>
              </div>
              {language.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Languages size={18} /> 필요 언어
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {language.map((lang, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 데스크탑 지원하기 버튼 */}
          <div className="hidden md:block bg-white rounded-xl p-6 shadow-sm">
            {isExpired ? (
              <div className="w-full py-4 bg-slate-100 text-slate-400 text-center rounded-lg font-semibold text-base">
                마감된 공고입니다
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-base transition-colors cursor-pointer"
              >
                지원하기
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
