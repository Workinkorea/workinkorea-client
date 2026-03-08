'use client';

import Link from 'next/link';
import { User, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { motion } from 'framer-motion';

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
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        type="homepage"
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={async () => { await logout(); }}
      />

      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-4xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-[32px] text-slate-900 mb-4">회원가입</h1>
            <p className="text-sm text-slate-600">회원 유형을 선택해주세요</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {SIGNUP_OPTIONS.map(({ href, icon: Icon, title, description, features }) => (
              <motion.div key={href} variants={itemVariants}>
                <Link href={href}>
                  <motion.div
                    className="bg-white rounded-2xl p-8 border-2 border-slate-200 cursor-pointer h-full"
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    whileHover={{
                      rotateX: -3,
                      rotateY: 4,
                      scale: 1.02,
                      borderColor: '#93C5FD',
                      boxShadow: '0 16px 24px -4px rgba(0,0,0,0.10)',
                      transition: { type: 'spring', stiffness: 300, damping: 22 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <motion.div
                        className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center"
                        whileHover={{ backgroundColor: '#DBEAFE', scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-10 h-10 text-blue-600" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl text-slate-900 mb-2">{title}</h2>
                        <p className="text-sm text-slate-600">{description}</p>
                      </div>
                      <ul className="text-left text-xs text-slate-600 space-y-2">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 flex items-center text-blue-600 font-medium">
                        <span className="text-sm">회원가입하기</span>
                        <motion.span
                          className="inline-block ml-1"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-8" variants={itemVariants}>
            <p className="text-sm text-slate-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login-select" className="text-blue-600 hover:text-blue-700 font-medium">
                로그인
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
