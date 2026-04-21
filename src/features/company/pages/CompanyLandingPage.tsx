'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Search,
  ChevronRight,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export function CompanyLandingPage() {
  const t = useTranslations('company.landing');

  const services = [
    {
      key: 'post',
      bg: 'bg-blue-50', border: 'border-blue-100',
      iconBg: 'bg-blue-100', iconColor: 'text-blue-500',
      icon: <FileText size={28} />,
      title: t('service1Title'),
      href: '/company-login',
    },
    {
      key: 'manager',
      bg: 'bg-teal-50', border: 'border-teal-100',
      iconBg: 'bg-teal-100', iconColor: 'text-teal-500',
      icon: <Users size={28} />,
      title: t('service2Title'),
      href: '/company-login',
    },
    {
      key: 'search',
      bg: 'bg-violet-50', border: 'border-violet-100',
      iconBg: 'bg-violet-100', iconColor: 'text-violet-500',
      icon: <Search size={28} />,
      title: t('service3Title'),
      href: '/company-login',
    },
  ];

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', title: t('step4Title'), desc: t('step4Desc') },
  ];

  const quickMenuItems = [
    { label: t('quickMenu1'), href: '/company-login', icon: <FileText size={14} className="text-blue-500" /> },
    { label: t('quickMenu2'), href: '/company-login', icon: <Search  size={14} className="text-teal-500" /> },
    { label: t('quickMenu3'), href: '/company-signup', icon: <CheckCircle2 size={14} className="text-violet-500" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">

          {/* ── 좌측 메인 ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* 프로모 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-[#1B1F4B] to-[#272D6E] rounded-xl p-5 flex items-center justify-between overflow-hidden relative"
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute bottom-0 right-20 w-16 h-16 rounded-full bg-blue-500/10" />
              <div className="relative">
                <p className="text-caption-3 font-semibold text-blue-300 uppercase tracking-widest mb-1">
                  {t('promoBadge')}
                </p>
                <p className="text-body-2 font-extrabold text-white mb-0.5">
                  {t('promoTitle')}
                </p>
                <p className="text-caption-2 text-slate-400">
                  {t('promoSubtitle')}
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl border border-white/20">
                <Building2 size={24} className="text-blue-300" />
              </div>
            </motion.div>

            {/* 서비스 선택 헤더 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-body-2 font-extrabold text-slate-900 mb-0.5">
                {t('serviceHeaderTitle')}
              </h2>
              <p className="text-caption-1 text-slate-400">
                {t('serviceHeaderSubtitle')}
              </p>
            </motion.div>

            {/* 서비스 카드 3개 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {services.map((svc, i) => (
                <motion.div key={svc.key} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <Link
                    href={svc.href}
                    className={cn(
                      'flex flex-col justify-between h-full',
                      'rounded-xl border p-5 min-h-[120px] group',
                      'hover:shadow-md transition-all duration-200 cursor-pointer',
                      svc.bg, svc.border,
                    )}
                  >
                    <p className="text-caption-1 font-extrabold text-slate-800 mb-2">
                      {svc.title}
                    </p>
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

            {/* 채용 프로세스 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <p className="text-caption-1 font-bold text-slate-900 mb-4">
                {t('stepsTitle')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {steps.map((step, i) => (
                  <div key={i} className="relative">
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                        <span className="text-caption-3 font-black text-white">{step.num}</span>
                      </div>
                      <p className="text-caption-2 font-bold text-slate-800 mb-0.5">{step.title}</p>
                      <p className="text-caption-3 text-slate-400 leading-relaxed">{step.desc}</p>
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
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <p className="text-body-3 font-extrabold text-slate-900 mb-0.5">{t('sidebarWelcome')}</p>
              <p className="text-caption-2 text-slate-400 mb-4">{t('sidebarLoginHint')}</p>
              <div className="flex gap-2">
                <Link
                  href="/company-login"
                  style={{ color: '#ffffff' }}
                  className={cn(
                    'flex-1 py-2.5 bg-blue-600 text-white text-caption-1 font-bold rounded-lg text-center',
                    'hover:bg-blue-700 transition-colors cursor-pointer',
                  )}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/company-signup"
                  className={cn(
                    'flex-1 py-2.5 border border-slate-200 text-slate-600 text-caption-1 font-semibold rounded-lg text-center',
                    'hover:bg-slate-50 transition-colors cursor-pointer',
                  )}
                >
                  {t('signup')}
                </Link>
              </div>
            </motion.div>

            {/* 빠른 메뉴 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-caption-1 font-bold text-slate-900">{t('quickMenuTitle')}</p>
              </div>
              {quickMenuItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-caption-2 font-medium text-slate-700">
                    {item.icon}
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
              ))}
            </motion.div>

            {/* 혜택 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-blue-50 border border-blue-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-blue-500" />
                <p className="text-caption-1 font-bold text-slate-800">{t('benefitTitle')}</p>
              </div>
              <ul className="space-y-1.5">
                {[t('benefit1'), t('benefit2'), t('benefit3')].map(benefit => (
                  <li key={benefit} className="flex items-center gap-2 text-caption-2 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/company-signup"
                style={{ color: '#ffffff' }}
                className={cn(
                  'mt-4 flex items-center justify-center gap-1.5 w-full py-2',
                  'bg-blue-600 text-white text-caption-2 font-bold rounded-lg',
                  'hover:bg-blue-700 transition-colors cursor-pointer',
                )}
              >
                {t('benefitCta')}
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── 하단 개인회원 유도 배너 ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-white border border-slate-200 rounded-xl px-6 py-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-caption-1 font-bold text-slate-900 mb-0.5">{t('jobSeekerBannerTitle')}</p>
            <p className="text-caption-2 text-slate-400">{t('jobSeekerBannerDesc')}</p>
          </div>
          <Link
            href="/"
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-4 py-2',
              'border border-slate-200 rounded-lg text-caption-2 font-semibold text-slate-600',
              'hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap',
            )}
          >
            {t('jobSeekerBannerCta')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
