'use client';

import Link from 'next/link';
import { User, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/utils';

const SIGNUP_OPTIONS = [
  {
    href: '/signup',
    icon: User,
    title: '개인회원',
    description: '구직자 및 일반 회원',
    features: ['채용 공고 지원', '이력서 작성 및 관리', '취업 비자 정보 확인'],
  },
  {
    href: '/company-signup/step1',
    icon: Building2,
    title: '기업회원',
    description: '채용 담당자 및 기업 회원',
    features: ['채용 공고 등록 및 관리', '인재 검색 및 스카우트', '지원자 관리'],
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function SignupSelectContent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
      <div className="flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
        <motion.div
          className="w-full max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Badge */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 rounded-full mb-6">
              <span className="text-caption-2 font-bold text-blue-600 uppercase tracking-wide">회원 유형 선택</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div className="text-center mb-10 sm:mb-12" variants={itemVariants}>
            <h1 className="text-title-2 sm:text-title-1 lg:text-title-1 font-extrabold text-slate-900 mb-2">
              <span className="font-black">개인</span> 또는 <span className="font-black">기업</span>
              <br className="hidden sm:inline" /> 회원가입
            </h1>
            <p className="text-caption-1 sm:text-sm text-slate-600 mt-3">
              당신의 신분에 맞게 회원가입을 진행해주세요
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
            {SIGNUP_OPTIONS.map(({ href, icon: Icon, title, description, features }) => (
              <motion.div key={href} variants={itemVariants}>
                <Link href={href} className="block h-full">
                  <motion.div
                    className={cn(
                      'bg-white rounded-2xl border-t-4 border-t-blue-600 border border-slate-200',
                      'p-5 sm:p-6 lg:p-7 min-h-[340px] sm:min-h-[360px] flex flex-col cursor-pointer',
                      'hover:border-blue-200 hover:shadow-lg transition-all duration-200'
                    )}
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    whileHover={{
                      rotateX: -2,
                      rotateY: 3,
                      scale: 1.02,
                      transition: { type: 'spring', stiffness: 300, damping: 25 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center flex-1 space-y-4">
                      {/* Icon */}
                      <motion.div
                        className="w-16 sm:w-18 h-16 sm:h-18 bg-blue-50 rounded-full flex items-center justify-center"
                        whileHover={{ backgroundColor: '#DBEAFE', scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-8 sm:w-9 h-8 sm:h-9 text-blue-600" />
                      </motion.div>

                      {/* Title & Description */}
                      <div>
                        <h2 className="text-title-4 sm:text-title-3 font-extrabold text-slate-900 mb-1">
                          {title}
                        </h2>
                        <p className="text-caption-1 text-slate-600">{description}</p>
                      </div>

                      {/* Features List */}
                      <ul className="text-left text-caption-1 text-slate-600 space-y-2.5 w-full">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <motion.button
                        className={cn(
                          'w-full mt-auto pt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl',
                          'text-sm font-semibold hover:bg-blue-700 transition-colors duration-150',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        회원가입하기
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Login Link */}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-caption-1 sm:text-sm text-slate-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login-select" className="text-blue-600 hover:text-blue-700 font-semibold">
                로그인하기
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
