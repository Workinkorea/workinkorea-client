'use client';

import { MapPin, Clock, DollarSign, Briefcase, GraduationCap, Languages, Calendar } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import JobDetailActions from './JobDetailActions';
import { useJobApplication } from '@/features/jobs/hooks/useJobApplication';
import type { CompanyPostDetailResponse } from '@/shared/types/api';

interface JobDetailViewProps {
  job: CompanyPostDetailResponse;
}

export default function JobDetailView({ job }: JobDetailViewProps) {
  const { mutate: applyToJob, isPending } = useJobApplication();

  const handleApply = () => {
    applyToJob(
      {
        company_post_id: job.id,
        // resume_id는 사용자가 선택하도록 모달 등으로 구현 가능
        // cover_letter도 선택적으로 입력받을 수 있음
      },
      {
        onSuccess: () => {
          // 지원 완료 후 처리 (예: 마이페이지로 이동)
          console.log('Application submitted successfully');
        },
      }
    );
  };
  const language = job.language ? job.language.split(',').map(l => l.trim()) : [];

  return (
    <Layout>
      <HeaderClient type="homepage" />
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobDetailActions />

          {/* 공고 헤더 */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {job.company_id}
              </div>
              <div className="flex-1">
                <h1 className="text-[20px] md:text-[28px] font-extrabold text-slate-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-[13px] md:text-[15px] text-slate-600">
                  회사 #{job.company_id}
                </p>
              </div>
            </div>

            {/* 주요 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">근무지</p>
                  <p className="text-sm font-medium text-slate-900">{job.work_location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">연봉</p>
                  <p className="text-sm font-medium text-slate-900">
                    {job.salary ? `${job.salary.toLocaleString()}원` : '협의'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <Briefcase className="text-blue-600" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">고용 형태</p>
                  <p className="text-sm font-medium text-slate-900">{job.employment_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <p className="text-[11px] text-slate-500">근무 시간</p>
                  <p className="text-sm font-medium text-slate-900">{job.working_hours}시간/일</p>
                </div>
              </div>
            </div>

            {/* 모집 기간 */}
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">모집 기간:</span> {job.start_date} ~ {job.end_date}
                </p>
              </div>
            </div>
          </div>

          {/* 공고 상세 내용 */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="text-[18px] md:text-[24px] font-extrabold text-slate-900 mb-6">공고 상세</h2>

            <div className="space-y-6">
              {/* 직무 내용 */}
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3">직무 내용</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.content}</p>
              </div>

              {/* 경력 요구사항 */}
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase size={18} />
                  경력
                </h3>
                <p className="text-sm text-slate-700">{job.work_experience}</p>
              </div>

              {/* 학력 요구사항 */}
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} />
                  학력
                </h3>
                <p className="text-sm text-slate-700">{job.education}</p>
              </div>

              {/* 언어 요구사항 */}
              {language.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Languages size={18} />
                    필요 언어
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {language.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 지원하기 버튼 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <button
              onClick={handleApply}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-base transition-colors"
            >
              {isPending ? '지원 중...' : '지원하기'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
