'use client';

import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { CompanyPost } from '@/lib/api/types';

interface JobsListClientProps {
  initialPosts: CompanyPost[];
}

export default function JobsListClient({ initialPosts }: JobsListClientProps) {
  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-title-1 font-bold text-label-900 mb-2">
              채용 공고
            </h1>
            <p className="text-body-2 text-label-600">
              한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요
            </p>
          </div>

          {/* 공고 목록 */}
          {initialPosts && initialPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialPosts.map((post) => {
                const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const language = post.language ? post.language.split(',').map(l => l.trim()) : [];

                return (
                  <Link
                    key={post.id}
                    href={`/jobs/${post.id}`}
                    className="bg-white border border-line-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    {/* 회사명과 시간 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {post.company_id}
                        </div>
                        <div>
                          <h3 className="font-semibold text-title-4 text-gray-900 group-hover:text-primary-500 transition-colors">
                            회사 #{post.company_id}
                          </h3>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 text-body-3 text-primary-500">
                              <Clock className="w-4 h-4" />
                              신규
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 포지션 */}
                    <h4 className="text-title-4 font-medium text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h4>

                    {/* 위치와 급여 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-body-3">{post.work_location}</span>
                        <span className="text-body-3">• {post.employment_type}</span>
                      </div>
                      <p className="text-primary-500 font-semibold text-body-2">
                        {post.salary ? `${post.salary.toLocaleString()}원` : '연봉 협의'}
                      </p>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2">
                      {language.slice(0, 3).map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-caption-1 rounded-md"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-label-500 text-body-2">등록된 공고가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
