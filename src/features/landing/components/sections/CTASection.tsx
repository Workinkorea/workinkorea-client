'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/shared/lib/utils/utils';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* 배경 그래디언트 */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-blue-900" />

      {/* 장식 원 1 */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/20 rounded-full -mr-36 sm:-mr-48 -mt-36 sm:-mt-48 blur-3xl" />

      {/* 장식 원 2 */}
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/20 rounded-full -ml-32 sm:-ml-40 -mb-32 sm:-mb-40 blur-3xl" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* 메인 제목 */}
        <motion.h2
          className="text-title-2 sm:text-title-1 lg:text-[44px] font-black text-white mb-4 sm:mb-5 lg:mb-6 tracking-tight leading-tight"
          variants={itemVariants}
        >
          지금 시작하세요!
        </motion.h2>

        {/* 부제 */}
        <motion.p
          className="text-body-3 sm:text-[15px] lg:text-[18px] text-blue-100 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          수많은 기업과 함께 새로운 미래를 시작하세요
        </motion.p>

        {/* CTA 버튼 그룹 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center flex-wrap"
          variants={itemVariants}
        >
          {/* Primary CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'px-5 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4',
                'bg-white text-blue-600',
                'text-caption-1 sm:text-body-3 lg:text-base font-semibold',
                'rounded-lg lg:rounded-xl',
                'hover:bg-blue-50 transition-all duration-200',
                'shadow-lg hover:shadow-xl',
                'cursor-pointer'
              )}
            >
              <span>무료 회원가입</span>
              <ArrowRight size={16} className="hidden sm:inline" />
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/jobs"
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'px-5 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4',
                'bg-transparent text-white',
                'text-caption-1 sm:text-body-3 lg:text-base font-semibold',
                'rounded-lg lg:rounded-xl',
                'border-2 border-white/50 hover:border-white',
                'hover:bg-white/10 transition-all duration-200',
                'backdrop-blur-sm',
                'cursor-pointer'
              )}
            >
              <span>공고 둘러보기</span>
              <ArrowRight size={16} className="hidden sm:inline" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 보충 텍스트 */}
        <motion.p
          className="mt-6 sm:mt-8 lg:mt-10 text-[11px] sm:text-caption-2 text-blue-200"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          회원가입 후 맞춤형 채용정보와 이력서 피드백을 받아보세요
        </motion.p>
      </motion.div>
    </section>
  );
}
