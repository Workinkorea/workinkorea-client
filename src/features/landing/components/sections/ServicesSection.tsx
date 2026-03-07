'use client';

import Link from 'next/link';
import { Target, FileText, MessageSquare } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
    <section className="py-12 md:py-16 bg-slate-50" ref={ref}>
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-slate-900 mb-3 md:mb-4">
            Work In Korea{' '}
            <span className="text-blue-600">특별한 서비스</span>
          </h2>
          <p className="text-[13px] md:text-base text-slate-500">
            성공적인 한국 취업을 위한 특별한 서비스를 제공합니다
          </p>
        </motion.div>

        {/* 서비스 카드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={`${service.bgColor} ${service.borderColor} border-2 rounded-xl p-8 text-center group cursor-default`}
                whileHover={{
                  y: -6,
                  boxShadow: '0 16px 24px -4px rgba(0,0,0,0.10)',
                  transition: { type: 'spring', stiffness: 300, damping: 22 },
                }}
              >
                {/* 아이콘 */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <motion.div
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -8, 8, -4, 0],
                        transition: { duration: 0.4 },
                      }}
                    >
                      <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                    </motion.div>
                  </div>
                </div>

                {/* 제목 */}
                <h3 className="text-[17px] font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>

                {/* 설명 */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {service.description}
                </p>

                {/* 링크 버튼 */}
                <div className="mt-6">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                  >
                    {service.linkLabel}
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
