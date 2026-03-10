'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSearchClient from './HeroSearchClient';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const stats = [
  { num: '3,200+', label: '채용공고' },
  { num: '850+', label: '파트너 기업' },
  { num: '1,200+', label: '채용 성공' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-800 to-blue-950 min-h-[calc(100vh-65px)] sm:min-h-screen flex items-center">
      {/* 장식 원 1 */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

      {/* 장식 원 2 */}
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center flex flex-col items-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* 배지 */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.12] backdrop-blur-[10px] border border-white/[0.15] hover:bg-white/[0.16] transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-blue-200" />
            <span className="text-[12px] sm:text-[13px] font-semibold text-blue-200">
              현재 3,200+ 채용공고
            </span>
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            variants={item}
            className="text-[36px] sm:text-[44px] lg:text-[56px] font-black text-white leading-tight tracking-tight mb-4 sm:mb-6 max-w-2xl"
          >
            한국 취업,
            <br className="hidden sm:inline" />
            {' '}여기서 시작됩니다
          </motion.h1>

          {/* 서브타이틀 */}
          <motion.p
            variants={item}
            className="text-[15px] sm:text-[17px] text-blue-200 mb-8 sm:mb-10 max-w-xl leading-relaxed"
          >
            맞춤형 채용공고 추천, 이력서 관리, 자가진단 서비스로 한국 취업을 한 번에 준비하세요.
          </motion.p>

          {/* 검색바 */}
          <motion.div
            variants={item}
            className="w-full max-w-2xl mb-10 sm:mb-12"
          >
            <HeroSearchClient />
          </motion.div>

          {/* 버튼 2개 */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 w-full px-4 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-initial">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-blue-600 hover:bg-slate-50 px-7 sm:px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
              >
                채용공고 보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-initial">
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border-2 border-white text-white hover:bg-white/[0.08] px-7 sm:px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all"
              >
                자가진단 시작
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* 통계 */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto w-full"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-[24px] sm:text-[28px] lg:text-[36px] font-extrabold text-white tracking-tight">
                  {stat.num}
                </p>
                <p className="text-[11px] sm:text-[13px] text-blue-200 mt-1 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
