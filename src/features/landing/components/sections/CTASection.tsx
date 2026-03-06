'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
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
      className="py-12 md:py-16 animated-gradient"
    >
      <motion.div
        className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* 메인 제목 */}
        <motion.h2
          className="text-[24px] md:text-[40px] font-black text-white mb-3 md:mb-6 tracking-tight"
          variants={itemVariants}
        >
          지금 시작하세요!
        </motion.h2>

        {/* 설명 */}
        <motion.p
          className="text-[13px] md:text-lg text-blue-100 mb-8 md:mb-12"
          variants={itemVariants}
        >
          수많은 기업과 함께 새로운 미래를 시작하세요
        </motion.p>

        {/* 버튼들 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 text-sm md:text-base font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
            >
              무료 회원가입
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-transparent text-white text-sm md:text-base font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              공고 둘러보기
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
