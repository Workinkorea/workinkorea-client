'use client';

import Link from 'next/link';
import { Target, FileText, MessageSquare } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/shared/lib/utils/utils';

const services = [
  {
    id: 'personalized',
    title: '맞춤형 채용정보',
    description: 'AI 기반의 개인맞춤 취업정보 분석으로 최적의 기업을 추천합니다. 당신의 능력과 경험에 맞는 완벽한 기회를 찾아드립니다.',
    icon: Target,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    href: '/diagnosis',
    linkLabel: '진단 시작하기',
  },
  {
    id: 'resume',
    title: '이력서 작성 도구',
    description: '전문가가 검증한 이력서 템플릿으로 완벽한 지원서를 작성하세요. 한국 기업에 최적화된 가이드를 제공합니다.',
    icon: FileText,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    href: '/user/resume/create',
    linkLabel: '이력서 작성하기',
  },
  {
    id: 'jobs',
    title: '면접 컨설팅 가이드',
    description: '실제 현직자와의 모의면접과 개인별 피드백으로 면접 성공률을 높여보세요. 한국 문화에 맞는 면접 스킬을 습득할 수 있습니다.',
    icon: MessageSquare,
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    href: '/jobs',
    linkLabel: '공고 둘러보기',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
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

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 relative overflow-hidden" ref={ref}>
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-12 sm:mb-14 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* 오버라인 배지 */}
          <motion.div
            className="inline-flex items-center px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-3 sm:mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-[11px] sm:text-[12px] font-bold text-blue-600 uppercase tracking-wider">
              특별 서비스
            </span>
          </motion.div>

          {/* 타이틀 */}
          <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-extrabold text-slate-900 mb-3 sm:mb-4 leading-tight">
            Work In Korea{' '}
            <span className="text-blue-600">특별한 서비스</span>
          </h2>

          {/* 부제 */}
          <p className="text-[13px] sm:text-[14px] lg:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            성공적인 한국 취업을 위한 특별한 서비스를 제공합니다
          </p>
        </motion.div>

        {/* 서비스 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={cn(
                  'group rounded-xl border-2 p-6 sm:p-7 lg:p-8',
                  'bg-white transition-all duration-300 cursor-pointer relative overflow-hidden',
                  service.id === 'jobs'
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-blue-200 hover:border-blue-300'
                )}
                whileHover={{
                  y: -8,
                  boxShadow: service.id === 'jobs'
                    ? '0 20px 25px -5px rgba(0,0,0,0.08)'
                    : '0 20px 25px -5px rgba(37,99,235,0.12)',
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
              >
                {/* 배경 Gradient Overlay */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  service.id === 'jobs'
                    ? 'bg-gradient-to-br from-slate-50 to-slate-100/50'
                    : 'bg-gradient-to-br from-blue-50/50 to-blue-100/30'
                )} />

                {/* Content */}
                <div className="relative z-10">
                  {/* 아이콘 */}
                  <motion.div
                    className="flex items-center justify-center mb-6 sm:mb-7"
                  >
                    <div className={cn(
                      'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
                      service.id === 'jobs'
                        ? 'bg-slate-100 group-hover:bg-slate-200'
                        : 'bg-blue-100 group-hover:bg-blue-200'
                    )}>
                      <motion.div
                        whileHover={{
                          scale: 1.15,
                          rotate: [0, -8, 8, -4, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <IconComponent className={cn(
                          'w-6 h-6 sm:w-7 sm:h-7 transition-colors',
                          service.iconColor
                        )} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* 타이틀 */}
                  <h3 className={cn(
                    'text-[16px] sm:text-[17px] font-bold mb-3 sm:mb-4 transition-colors',
                    service.id === 'jobs'
                      ? 'text-slate-900 group-hover:text-slate-900'
                      : 'text-slate-900 group-hover:text-blue-900'
                  )}>
                    {service.title}
                  </h3>

                  {/* 설명 */}
                  <p className={cn(
                    'text-[13px] sm:text-[14px] leading-relaxed mb-5 sm:mb-6 line-clamp-3',
                    service.id === 'jobs'
                      ? 'text-slate-500 group-hover:text-slate-600'
                      : 'text-slate-500 group-hover:text-slate-600'
                  )}>
                    {service.description}
                  </p>

                  {/* 링크 */}
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold transition-all duration-200 group/link"
                  >
                    <span className={cn(
                      service.id === 'jobs'
                        ? 'text-slate-600 group-hover/link:text-slate-700'
                        : 'text-blue-600 group-hover/link:text-blue-700'
                    )}>
                      {service.linkLabel}
                    </span>
                    <motion.span
                      className={cn(
                        'inline-block text-[14px] sm:text-[15px]',
                        service.id === 'jobs'
                          ? 'text-slate-600 group-hover/link:text-slate-700'
                          : 'text-blue-600 group-hover/link:text-blue-700'
                      )}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
