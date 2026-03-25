'use client';

import { MapPin, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function PopularJobsSection() {
  const t = useTranslations('landing.popularJobs');
  const tCommon = useTranslations('common');
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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-white" ref={ref}>
      <div className="page-container">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-title-3 md:text-title-2 font-extrabold text-slate-900 mb-3 md:mb-4">
            {t('title')}
          </h2>
          <p className="text-caption-1 md:text-body-1 text-slate-500">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 공고 그리드 */}
        {isLoading ? (
          /* Skeleton shimmer */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg skeleton-shimmer shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded skeleton-shimmer w-3/4" />
                    <div className="h-3 rounded skeleton-shimmer w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 rounded skeleton-shimmer w-full" />
                  <div className="h-4 rounded skeleton-shimmer w-4/5" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 rounded skeleton-shimmer w-2/3" />
                  <div className="h-4 rounded skeleton-shimmer w-1/3" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-5 w-16 rounded skeleton-shimmer" />
                  <div className="h-5 w-16 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {postsData && postsData.length > 0 ? (
              postsData.map((post) => {
                const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const language = post.language ? post.language.split(',').map(l => l.trim()) : [];

                return (
                  <motion.div key={post.id} variants={cardVariants}>
                    <Link
                      href={`/jobs/${post.id}`}
                      className="block bg-white border border-slate-200 rounded-xl p-4 md:p-6 transition-all duration-200 cursor-pointer group hover:border-blue-200 hover:shadow-md"
                    >
                      {/* 회사명과 시간 */}
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
                            {post.company_id}
                          </div>
                          <div>
                            <h3 className="font-semibold text-body-3 md:text-title-5 text-slate-900 group-hover:text-blue-600 transition-colors">
                              회사 #{post.company_id}
                            </h3>
                            {isRecent && (
                              <span className="inline-flex items-center gap-1 text-caption-2 md:text-body-3 text-blue-600">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                {tCommon('status.new')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 포지션 */}
                      <h4 className="text-body-3 md:text-title-5 font-medium text-slate-900 mb-2 md:mb-3 line-clamp-2">
                        {post.title}
                      </h4>

                      {/* 위치와 급여 */}
                      <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                        <div className="flex items-center gap-1.5 md:gap-2 text-slate-500">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="text-caption-2 md:text-body-3">{post.work_location}</span>
                          <span className="text-caption-2 md:text-body-3">• {post.employment_type}</span>
                        </div>
                        <p className="text-blue-600 font-semibold text-caption-1 md:text-body-2">
                          {post.salary ? `${post.salary.toLocaleString()}원` : tCommon('label.negotiable')}
                        </p>
                      </div>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {language.slice(0, 3).map((lang, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-caption-3 rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-body-3">{tCommon('label.noData')}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 더 보기 버튼 */}
        <motion.div
          className="text-center"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2.5 rounded-lg font-semibold transition-colors text-body-3 md:text-body-1 cursor-pointer"
            >
              {t('viewMore')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
