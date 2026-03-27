'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Building2,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// ── 서비스 카드 데이터 ──────────────────────────────────────────────────────
const services = [
  {
    key: 'post',
    bg: 'bg-primary-50',
    border: 'border-blue-100',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-500',
    icon: <FileText size={28} />,
    title: '직접 공고 등록',
    desc: (
      <>
        우리 회사 공고를 <span className="text-primary-600 font-semibold">직접 등록</span>할 수 있어요.{' '}
        간단한 정보를 입력하고 채용을 시작하세요.
      </>
    ),
    href: '/company-login',
  },
  {
    key: 'manager',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-500',
    icon: <Users size={28} />,
    title: '채용 전담 매니저',
    desc: (
      <>
        공고 등록부터 FIT한 합격자까지!{' '}
        <span className="text-teal-600 font-semibold">전담 매니저의 밀착 케어</span>를 받아보세요.
      </>
    ),
    href: '/company-login',
  },
  {
    key: 'search',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-500',
    icon: <Search size={28} />,
    title: '인재 검색',
    desc: (
      <>
        기다리지 말고 <span className="text-violet-600 font-semibold">인재를 직접 검색</span>해보세요.{' '}
        조건에 맞는 추천 인재도 확인할 수 있어요!
      </>
    ),
    href: '/company-login',
  },
];

// ── 플랫폼 통계 ──────────────────────────────────────────────────────────────
const stats = [
  { value: '12,000+', label: '등록 기업' },
  { value: '580,000+', label: '외국인 구직자' },
  { value: '48,000+', label: '채용 공고' },
  { value: '4.8★', label: '평균 만족도' },
];

// ── 채용 단계 ────────────────────────────────────────────────────────────────
const steps = [
  { num: '01', title: '기업 회원가입', desc: '간단한 정보 입력으로 30초 만에 가입 완료' },
  { num: '02', title: '채용 공고 작성', desc: '직무·급여·복지 정보를 상세하게 등록하세요' },
  { num: '03', title: '지원자 관리', desc: '지원서를 검토하고 단계별로 관리하세요' },
  { num: '04', title: '채용 완료', desc: '최적의 인재와 함께 성장하세요' },
];

export function CompanyLandingPage() {
  return (
    <div className="min-h-screen bg-label-100">
      <div className="max-w-[1100px] mx-auto px-6 py-6">

        {/* ── 상단 그리드: 메인 + 사이드바 ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">

          {/* ── 좌측 메인 ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* 프로모 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-[#1B2C4A] to-[#243658] rounded-xl p-5 flex items-center justify-between overflow-hidden relative"
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute bottom-0 right-20 w-16 h-16 rounded-full bg-primary-500/10" />
              <div className="relative">
                <p className="text-caption-3 font-semibold text-blue-300 uppercase tracking-widest mb-1">
                  WorkInKorea Hiring
                </p>
                <p className="text-body-2 font-extrabold text-white mb-0.5">
                  외국인 채용, 더 쉽게 시작하세요
                </p>
                <p className="text-caption-2 text-label-400">
                  검증된 외국인 인재와 기업을 연결하는 글로벌 채용 플랫폼
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl border border-white/20">
                <Building2 size={24} className="text-blue-300" />
              </div>
            </motion.div>

            {/* 서비스 선택 헤더 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-body-2 font-extrabold text-label-900 mb-0.5">
                우리 회사에 딱 맞는 방식으로 채용을 시작해보세요!
              </h2>
              <p className="text-caption-1 text-label-400">
                직접 등록부터 전담 매니저 케어까지, 필요한 방식을 선택하세요
              </p>
            </motion.div>

            {/* 서비스 카드 3개 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {services.map((svc, i) => (
                <motion.div
                  key={svc.key}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={svc.href}
                    className={cn(
                      'flex flex-col justify-between h-full',
                      'rounded-xl border p-5 min-h-[160px] group',
                      'hover:shadow-md transition-all duration-200 cursor-pointer',
                      svc.bg, svc.border,
                    )}
                  >
                    <div>
                      <p className="text-caption-1 font-extrabold text-label-800 mb-2">
                        {svc.title}
                      </p>
                      <p className="text-caption-2 text-label-600 leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        svc.iconBg, svc.iconColor,
                        'group-hover:scale-110 transition-transform',
                      )}>
                        {svc.icon}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 플랫폼 통계 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-line-400 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary-600" />
                <p className="text-caption-1 font-bold text-label-900">WorkInKorea 채용 현황</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-title-5 font-extrabold text-primary-600 mb-0.5">{stat.value}</p>
                    <p className="text-caption-3 text-label-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 채용 프로세스 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="bg-white border border-line-400 rounded-xl p-5"
            >
              <p className="text-caption-1 font-bold text-label-900 mb-4">
                간단한 4단계로 채용을 완료하세요
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {steps.map((step, i) => (
                  <div key={i} className="relative">
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-label-100 -translate-y-1/2 z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mb-2">
                        <span className="text-caption-3 font-black text-white">{step.num}</span>
                      </div>
                      <p className="text-caption-2 font-bold text-label-800 mb-0.5">{step.title}</p>
                      <p className="text-caption-3 text-label-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── 우측 사이드바 ──────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* 로그인/회원가입 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-line-400 rounded-xl p-5"
            >
              <p className="text-body-3 font-extrabold text-label-900 mb-0.5">환영합니다.</p>
              <p className="text-caption-2 text-white0 mb-4">로그인 후 이용하세요.</p>
              <div className="flex gap-2">
                <Link
                  href="/company-login"
                  className={cn(
                    'flex-1 py-2.5 bg-primary-600 text-white text-caption-1 font-semibold rounded-lg text-center',
                    'hover:bg-primary-700 transition-colors cursor-pointer',
                  )}
                >
                  로그인
                </Link>
                <Link
                  href="/company-signup"
                  className={cn(
                    'flex-1 py-2.5 border border-line-400 text-label-600 text-caption-1 font-semibold rounded-lg text-center',
                    'hover:bg-label-50 hover:border-line-400 transition-colors cursor-pointer',
                  )}
                >
                  회원가입
                </Link>
              </div>
            </motion.div>

            {/* 빠른 메뉴 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white border border-line-400 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-line-200">
                <p className="text-caption-1 font-bold text-label-900">채용 시작하기</p>
              </div>
              {[
                { label: '채용 공고 등록', href: '/company-login', icon: <FileText size={14} className="text-primary-500" /> },
                { label: '인재 검색하기',  href: '/company-login', icon: <Search  size={14} className="text-teal-500" /> },
                { label: '기업 회원가입',  href: '/company-signup', icon: <Star    size={14} className="text-violet-500" /> },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-label-50 transition-colors border-b border-line-200 last:border-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-caption-2 font-medium text-label-700">
                    {item.icon}
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="text-label-300 group-hover:text-primary-400 transition-colors" />
                </Link>
              ))}
            </motion.div>

            {/* 혜택 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-primary-50 border border-blue-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-primary-500" />
                <p className="text-caption-1 font-bold text-label-800">지금 가입하면</p>
              </div>
              <ul className="space-y-1.5">
                {[
                  '채용 공고 1건 무료 등록',
                  '외국인 인재 DB 무료 열람',
                  '전담 매니저 1:1 상담',
                ].map(benefit => (
                  <li key={benefit} className="flex items-center gap-2 text-caption-2 text-label-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/company-signup"
                className={cn(
                  'mt-4 flex items-center justify-center gap-1.5 w-full py-2',
                  'bg-primary-600 text-white text-caption-2 font-semibold rounded-lg',
                  'hover:bg-primary-700 transition-colors cursor-pointer',
                )}
              >
                무료로 시작하기
                <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* 고객센터 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34 }}
              className="bg-white border border-line-400 rounded-xl p-4"
            >
              <p className="text-caption-1 font-bold text-label-900 mb-3">고객센터</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-caption-2 text-label-700">
                  <Phone size={13} className="text-label-400" />
                  <span className="font-bold text-label-800">02-0000-0000</span>
                </div>
                <div className="flex items-center gap-2 text-caption-2 text-white0">
                  <Mail size={13} className="text-label-400" />
                  <span>help@workinkorea.net</span>
                </div>
                <div className="flex items-center gap-2 text-caption-3 text-label-400">
                  <Clock size={12} className="text-label-300" />
                  <span>평일 09:00 ~ 18:00</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── 하단 개인회원 유도 배너 ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-white border border-line-400 rounded-xl px-6 py-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-caption-1 font-bold text-label-900 mb-0.5">구직자이신가요?</p>
            <p className="text-caption-2 text-white0">한국 취업을 원하는 외국인 구직자라면 개인 페이지를 이용하세요</p>
          </div>
          <Link
            href="/"
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-4 py-2',
              'border border-line-400 rounded-lg text-caption-2 font-semibold text-label-600',
              'hover:bg-label-50 transition-colors cursor-pointer whitespace-nowrap',
            )}
          >
            개인 페이지 →
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
