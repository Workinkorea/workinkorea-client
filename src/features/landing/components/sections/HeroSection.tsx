'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 py-12 bg-white">
      <motion.div
        className="flex flex-col items-center w-full"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* 검색바 */}
        <motion.div className="w-full max-w-2xl mb-12 md:mb-16" variants={item}>
          <HeroSearchClient />
        </motion.div>

        {/* 브랜드 로고 */}
        <motion.p
          className="font-['Plus_Jakarta_Sans'] text-[36px] md:text-[52px] font-black text-blue-600 mb-5 tracking-tight leading-none"
          variants={item}
        >
          Work In Korea
        </motion.p>

        {/* 헤드라인 */}
        <motion.h1
          className="text-[20px] md:text-[28px] font-bold text-slate-900 mb-3 text-center"
          variants={item}
        >
          한국 취업, 여기서 시작됩니다
        </motion.h1>

        {/* 서브텍스트 */}
        <motion.p
          className="text-[13px] md:text-base text-slate-500 mb-8 text-center"
          variants={item}
        >
          맞춤형 채용공고 추천을 확인하려면 로그인하세요.
        </motion.p>

        {/* 시작하기 버튼 */}
        <motion.div variants={item}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors shadow-md hover:shadow-lg"
            >
              시작하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
