'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GoogleIcon } from '@/shared/ui/AccessibleIcon';
import { API_BASE_URL } from '@/shared/api/fetchClient';
import { saveCallbackUrl } from '@/shared/lib/callbackUrl';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const features = [
  '맞춤형 채용공고 추천',
  '이력서 관리 및 자동 저장',
  '자가진단 및 커리어 상담',
];

interface LoginContentProps {
  callbackUrl?: string;
}

export default function LoginContent({ callbackUrl }: LoginContentProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    // OAuth 외부 도메인 이동 전에 callbackUrl을 sessionStorage에 보존
    if (callbackUrl) {
      saveCallbackUrl(callbackUrl);
    }
    setIsGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/api/auth/login/google`;
  };

  const companyLoginHref = callbackUrl
    ? `/company-login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/company-login';

  const signupHref = callbackUrl
    ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/signup';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1">
      {/* 좌측 패널 - 데스크탑만 표시 */}
      <motion.div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-400 to-blue-600 flex-col justify-center items-center relative px-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 장식 원 */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md text-center">
          {/* 배지 */}
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/[0.12] backdrop-blur-[10px] border border-white/[0.15]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-[13px] font-semibold text-blue-200">개인 구직 파트너</span>
          </motion.div>

          {/* 타이틀 */}
          <motion.h2
            className="text-[36px] font-black text-white leading-tight mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            한국 취업,
            <br />
            지금 바로 시작하세요
          </motion.h2>

          {/* 기능 리스트 */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-blue-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-[14px] font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>

      {/* 우측 폼 */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 sm:py-0">
        <motion.div
          className="max-w-sm w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 모바일 로고 */}
          <motion.div variants={itemVariants} className="mb-8 lg:hidden">
            <p className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-blue-600">
              Work In Korea
            </p>
          </motion.div>

          {/* 타이틀 */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-black text-slate-900 mb-2 tracking-tight">
              개인 로그인
            </h1>
            <p className="text-[14px] text-slate-500">
              Google 계정으로 간편하게 시작하세요
            </p>
          </motion.div>

          {/* Google 버튼 */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-5 border-2 border-slate-200 rounded-xl font-semibold text-base text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ borderColor: '#93C5FD', backgroundColor: '#F0F9FF', scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Google 계정으로 로그인"
            >
              <GoogleIcon label="Google 로고" size="md" />
              <span>{isGoogleLoading ? '로그인 중...' : 'Google로 시작하기'}</span>
            </motion.button>

            {/* 구분선 */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-[13px] text-slate-500 font-medium">또는</span>
              </div>
            </div>

            {/* 기업 로그인 */}
            <motion.a
              href={companyLoginHref}
              className="block w-full py-3.5 px-5 text-center border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-base hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              기업 로그인
            </motion.a>
          </motion.div>

          {/* 회원가입 */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-[14px] text-slate-600">
              아직 회원이 아니신가요?{' '}
              <Link href={signupHref} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-1">
                회원가입
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </motion.div>

          {/* 하단 텍스트 */}
          <motion.p
            variants={itemVariants}
            className="text-center text-[12px] text-slate-400 mt-6"
          >
            로그인함으로써 이용약관 및 개인정보처리방침에 동의합니다.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
