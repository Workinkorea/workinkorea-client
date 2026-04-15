'use client';

import Link from 'next/link';
import { Target, FileText, MessageSquare } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

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
  const t = useTranslations('landing.services');

  const services = [
    {
      id: 'personalized',
      title: t('service1Title'),
      description: t('service1Desc'),
      icon: Target,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      borderColor: 'border-primary-200',
      href: '/diagnosis',
      linkLabel: t('service1Link'),
    },
    {
      id: 'resume',
      title: t('service2Title'),
      description: t('service2Desc'),
      icon: FileText,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      borderColor: 'border-primary-200',
      href: '/user/resume/create',
      linkLabel: t('service2Link'),
    },
    {
      id: 'jobs',
      title: t('service3Title'),
      description: t('service3Desc'),
      icon: MessageSquare,
      bgColor: 'bg-label-50',
      iconColor: 'text-label-600',
      borderColor: 'border-line-400',
      href: '/jobs',
      linkLabel: t('service3Link'),
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 relative overflow-hidden" ref={ref}>
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -mr-48 -mt-48 opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-50 rounded-full -ml-32 -mb-32 opacity-30" />

      <div className="relative z-10 page-container">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* 오버라인 배지 */}
          <motion.div
            className="inline-flex items-center px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-3 sm:mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-caption-3 sm:text-caption-2 font-bold text-primary-600 uppercase tracking-wider">
              {t('overline')}
            </span>
          </motion.div>

          {/* 타이틀 */}
          <h2 className="text-title-3 sm:text-title-2 lg:text-display-2 font-extrabold text-label-900 mb-3 sm:mb-4 leading-tight">
            {t('title')}{' '}
            <span className="text-primary-600">{t('titleHighlight')}</span>
          </h2>

          {/* 부제 */}
          <p className="text-caption-1 sm:text-body-3 lg:text-body-1 text-label-500 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 서비스 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className={cn(
                  'group rounded-xl border-2 p-6 lg:p-8',
                  'bg-white transition-all duration-300 cursor-pointer relative overflow-hidden',
                  service.id === 'jobs'
                    ? 'border-line-400 hover:border-line-400 hover:shadow-lg'
                    : 'border-primary-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100'
                )}
                whileHover={{
                  y: -8,
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
              >
                {/* 배경 Gradient Overlay */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  service.id === 'jobs'
                    ? 'bg-linear-to-br from-label-50 to-label-100/50'
                    : 'bg-linear-to-br from-primary-50/50 to-primary-100/30'
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
                        ? 'bg-label-100 group-hover:bg-label-100'
                        : 'bg-primary-100 group-hover:bg-primary-200'
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
                    'text-body-1 sm:text-title-5 font-bold mb-3 sm:mb-4 transition-colors',
                    service.id === 'jobs'
                      ? 'text-label-900 group-hover:text-label-900'
                      : 'text-label-900 group-hover:text-primary-900'
                  )}>
                    {service.title}
                  </h3>

                  {/* 설명 */}
                  <p className={cn(
                    'text-caption-1 sm:text-body-3 leading-relaxed mb-5 sm:mb-6 line-clamp-3',
                    service.id === 'jobs'
                      ? 'text-label-500 group-hover:text-label-600'
                      : 'text-label-500 group-hover:text-label-600'
                  )}>
                    {service.description}
                  </p>

                  {/* 링크 */}
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-caption-1 sm:text-body-3 font-semibold transition-all duration-200 group/link"
                  >
                    <span className={cn(
                      service.id === 'jobs'
                        ? 'text-label-600 group-hover/link:text-label-700'
                        : 'text-primary-600 group-hover/link:text-primary-700'
                    )}>
                      {service.linkLabel}
                    </span>
                    <motion.span
                      className={cn(
                        'inline-block text-body-3 sm:text-body-2',
                        service.id === 'jobs'
                          ? 'text-label-600 group-hover/link:text-label-700'
                          : 'text-primary-600 group-hover/link:text-primary-700'
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
