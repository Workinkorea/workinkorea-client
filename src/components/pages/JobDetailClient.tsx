'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, DollarSign, Briefcase, GraduationCap, Languages, Calendar, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { CompanyPostDetailResponse } from '@/lib/api/types';

interface JobDetailClientProps {
  job: CompanyPostDetailResponse;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const router = useRouter();
  const language = job.language ? job.language.split(',').map(l => l.trim()) : [];

  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-label-600 hover:text-label-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>목록으로</span>
          </button>

          {/* 공고 헤더 */}
          <div className="bg-white rounded-xl p-8 shadow-normal mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {job.company_id}
              </div>
              <div className="flex-1">
                <h1 className="text-title-2 font-bold text-label-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-body-2 text-label-600">
                  회사 #{job.company_id}
                </p>
              </div>
            </div>

            {/* 주요 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-component-alternative rounded-lg">
                <MapPin className="text-primary-500" size={20} />
                <div>
                  <p className="text-caption-2 text-label-500">근무지</p>
                  <p className="text-body-3 font-medium text-label-900">{job.work_location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-component-alternative rounded-lg">
                <DollarSign className="text-primary-500" size={20} />
                <div>
                  <p className="text-caption-2 text-label-500">연봉</p>
                  <p className="text-body-3 font-medium text-label-900">
                    {job.salary ? `${job.salary.toLocaleString()}원` : '협의'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-component-alternative rounded-lg">
                <Briefcase className="text-primary-500" size={20} />
                <div>
                  <p className="text-caption-2 text-label-500">고용 형태</p>
                  <p className="text-body-3 font-medium text-label-900">{job.employment_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-component-alternative rounded-lg">
                <Clock className="text-primary-500" size={20} />
                <div>
                  <p className="text-caption-2 text-label-500">근무 시간</p>
                  <p className="text-body-3 font-medium text-label-900">{job.working_hours}시간/일</p>
                </div>
              </div>
            </div>

            {/* 모집 기간 */}
            <div className="flex items-center gap-2 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <Calendar className="text-primary-500" size={20} />
              <div className="flex-1">
                <p className="text-body-3 text-label-900">
                  <span className="font-medium">모집 기간:</span> {job.start_date} ~ {job.end_date}
                </p>
              </div>
            </div>
          </div>

          {/* 공고 상세 내용 */}
          <div className="bg-white rounded-xl p-8 shadow-normal mb-6">
            <h2 className="text-title-3 font-bold text-label-900 mb-6">공고 상세</h2>

            <div className="space-y-6">
              {/* 직무 내용 */}
              <div>
                <h3 className="text-body-2 font-semibold text-label-900 mb-3">직무 내용</h3>
                <p className="text-body-3 text-label-700 whitespace-pre-wrap">{job.content}</p>
              </div>

              {/* 경력 요구사항 */}
              <div>
                <h3 className="text-body-2 font-semibold text-label-900 mb-3 flex items-center gap-2">
                  <Briefcase size={18} />
                  경력
                </h3>
                <p className="text-body-3 text-label-700">{job.work_experience}</p>
              </div>

              {/* 학력 요구사항 */}
              <div>
                <h3 className="text-body-2 font-semibold text-label-900 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} />
                  학력
                </h3>
                <p className="text-body-3 text-label-700">{job.education}</p>
              </div>

              {/* 언어 요구사항 */}
              {language.length > 0 && (
                <div>
                  <h3 className="text-body-2 font-semibold text-label-900 mb-3 flex items-center gap-2">
                    <Languages size={18} />
                    필요 언어
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {language.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 text-body-3 rounded-lg border border-primary-200"
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
          <div className="bg-white rounded-xl p-6 shadow-normal">
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-semibold text-body-1 transition-colors">
              지원하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
