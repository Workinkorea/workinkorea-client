'use client';

import { MapPin, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PopularJobsSection() {
  // TODO: 인기 공고 API가 준비되면 교체 필요
  // Mock 데이터 사용 (임시)
  const mockPopularPosts = [
    {
      id: 1,
      company_id: 101,
      title: '프론트엔드 개발자',
      work_location: '서울 강남구',
      employment_type: '정규직',
      salary: 50000000,
      language: 'React, TypeScript, Next.js',
      start_date: new Date().toISOString(),
    },
    {
      id: 2,
      company_id: 102,
      title: '백엔드 개발자',
      work_location: '서울 판교',
      employment_type: '정규직',
      salary: 55000000,
      language: 'Java, Spring Boot, MySQL',
      start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      company_id: 103,
      title: '풀스택 개발자',
      work_location: '서울 서초구',
      employment_type: '정규직',
      salary: 60000000,
      language: 'Python, Django, React',
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      company_id: 104,
      title: 'DevOps 엔지니어',
      work_location: '서울 강남구',
      employment_type: '정규직',
      salary: 65000000,
      language: 'AWS, Docker, Kubernetes',
      start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      company_id: 105,
      title: '데이터 엔지니어',
      work_location: '서울 판교',
      employment_type: '정규직',
      salary: 58000000,
      language: 'Python, Spark, Airflow',
      start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 6,
      company_id: 106,
      title: '모바일 개발자',
      work_location: '서울 강남구',
      employment_type: '정규직',
      salary: 52000000,
      language: 'React Native, iOS, Android',
      start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const postsData = mockPopularPosts;
  const isLoading = false;
  return (
    <section className="py-16 bg-white">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-title-1 font-bold text-gray-900 mb-4">
            인기 공고
          </h2>
          <p className="text-body-1 text-gray-600">
            지금 가장 주목받는 기업들의 채용공고입니다
          </p>
        </div>

        {/* 공고 그리드 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {postsData && postsData.length > 0 ? (
              postsData.map((post) => {
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
                          <h3 className="font-semibold text-title-4 text-gray-900 group-hover:text-green-600 transition-colors">
                            회사 #{post.company_id}
                          </h3>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 text-body-3 text-green-600">
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
                      <p className="text-green-600 font-semibold text-body-2">
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
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-label-500">등록된 공고가 없습니다.</p>
              </div>
            )}
        </div>
        )}

        {/* 더 보기 버튼 */}
        <div className="text-center">
          <Link href="/jobs" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-body-1 cursor-pointer">
            더 많은 공고 보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}