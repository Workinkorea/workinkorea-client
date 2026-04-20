'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HeroSearchClient from './HeroSearchClient';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="bg-white min-h-[calc(100vh-65px)] sm:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

      {/* 검색바 */}
      <motion.div
        className="w-full max-w-2xl mb-12 sm:mb-16"
        variants={item}
        initial="hidden"
        animate="visible"
      >
        <HeroSearchClient />
      </motion.div>

      {/* 텍스트 + 버튼 */}
      <motion.div
        className="text-center flex flex-col items-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* 브랜드 타이틀 */}
        <motion.h1
          variants={item}
          className="font-['Plus_Jakarta_Sans'] text-display-2 sm:text-display-1 font-extrabold text-blue-600 tracking-tight mb-3"
        >
          Work In Korea
        </motion.h1>

        {/* 서브타이틀 */}
        <motion.p
          variants={item}
          className="text-title-4 sm:text-title-3 font-bold text-slate-900 mb-3"
        >
          {t('tagline')}
        </motion.p>

        {/* 설명 */}
        <motion.p
          variants={item}
          className="text-caption-1 sm:text-body-3 text-slate-500 mb-8"
        >
          {t('loginPrompt')}
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div variants={item} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/login-select"
            className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3.5 rounded-lg font-semibold text-body-2 transition-all shadow-md hover:shadow-lg"
          >
            {t('getStarted')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
