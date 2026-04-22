'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Home, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';
import { UserTypeToggle } from '@/shared/components/UserTypeToggle';
import type { ViewType } from '@/shared/components/UserTypeToggle';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { Portal } from '@/shared/ui/Portal';

interface NavItem {
  name: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  type?: 'homepage' | 'business';
  isAuthenticated?: boolean;
  onLogout?: () => void;
  viewType?: ViewType;
  onViewTypeChange?: (v: ViewType) => void;
}

const panelContentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const panelItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

export function MobileNav({ items, type = 'homepage', isAuthenticated, onLogout, viewType, onViewTypeChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common.nav');

  const HOMEPAGE_QUICK = [
    { label: t('jobs'), emoji: '💼', href: '/jobs' },
    { label: t('resume'), emoji: '📄', href: '/user/resume/create' },
    { label: t('diagnosis'), emoji: '🎯', href: '/diagnosis' },
  ];

  const BUSINESS_QUICK = [
    { label: t('postJobMenu'), emoji: '✍️', href: '/company/posts/create' },
    { label: t('candidateManage'), emoji: '👥', href: '/company/jobs' },
    { label: t('companyProfileMenu'), emoji: '🏢', href: '/company/profile/edit' },
  ];

  const HOMEPAGE_SECTIONS = [
    {
      title: t('jobs'),
      items: [
        { icon: '📍', label: t('jobsByRegion'), href: '/jobs' },
        { icon: '💼', label: t('jobsByPosition'), href: '/jobs' },
        { icon: '🌏', label: t('foreignerJobs'), href: '/jobs' },
        { icon: '⭐', label: t('recommendedJobs'), href: '/jobs' },
      ],
    },
    {
      title: t('my'),
      items: [
        { icon: '👤', label: t('myProfile'), href: '/user/profile' },
        { icon: '📋', label: t('resumeManage'), href: '/user/resume/create' },
        { icon: '🔍', label: t('diagnosis'), href: '/diagnosis' },
      ],
    },
  ];

  const BUSINESS_SECTIONS = [
    {
      title: t('recruitManage'),
      items: [
        { icon: '✍️', label: t('postJobMenu'), href: '/company/posts/create' },
        { icon: '📋', label: t('manageJobsMenu'), href: '/company/jobs' },
        { icon: '👥', label: t('candidateManage'), href: '/company/jobs' },
        { icon: '🏢', label: t('companyProfileMenu'), href: '/company/profile/edit' },
      ],
    },
  ];

  const quickLinks = type === 'business' ? BUSINESS_QUICK : HOMEPAGE_QUICK;
  const sections = type === 'business' ? BUSINESS_SECTIONS : HOMEPAGE_SECTIONS;

  const close = () => setIsOpen(false);

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div>

      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
        aria-label={t('jobs')}
      >
        <Menu size={22} />
      </button>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
            {/* ① 딤 오버레이 — fixed inset-0, 클릭 시 닫기 */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={close}
              aria-hidden="true"
            />

            {/* ② 슬라이드 패널 — fixed, 전체 높이·너비, 우측에서 진입 */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 w-full sm:max-w-sm h-full bg-white z-[110] flex flex-col shadow-xl"
              role="dialog"
              aria-modal="true"
            >

              {/* 패널 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                <Link
                  href="/"
                  onClick={close}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Home size={20} />
                </Link>
                {/* 모바일 전용: 개인/기업 토글 + 언어 전환 */}
                <div className="flex items-center gap-2 sm:hidden">
                  {viewType && onViewTypeChange && (
                    <UserTypeToggle
                      value={viewType}
                      onChange={(v) => { onViewTypeChange(v); close(); }}
                    />
                  )}
                  <LanguageToggle />
                </div>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {/* 스크롤 가능한 본문 */}
              <motion.div
                className="flex-1 overflow-y-auto"
                variants={panelContentVariants}
                initial="hidden"
                animate="visible"
              >

                {/* 자주 찾는 메뉴 */}
                <motion.div className="px-5 pt-6 pb-5" variants={panelItemVariants}>
                  <p className="text-caption-1 font-bold text-slate-900 mb-3">
                    {t('quickLinksTitle')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickLinks.map(link => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        onClick={close}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-full text-caption-1 font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span>{link.emoji}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="h-px bg-slate-100 mx-5" variants={panelItemVariants} />

                {/* 섹션별 2열 메뉴 */}
                {sections.map((section, si) => (
                  <motion.div key={section.title} variants={panelItemVariants}>
                    {si > 0 && <div className="h-px bg-slate-100 mx-5" />}
                    <div className="px-5 pt-5 pb-3">
                      <p className="text-caption-1 font-bold text-slate-900 mb-3">
                        {section.title}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {section.items.map(item => (
                          <Link
                            key={item.href + item.label}
                            href={item.href}
                            onClick={close}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <span className="text-title-5 leading-none">{item.icon}</span>
                            <span className="text-caption-1 font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div className="h-px bg-slate-100 mx-5" variants={panelItemVariants} />

                {/* 인증 링크 */}
                <motion.div className="px-5 py-3" variants={panelItemVariants}>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={type === 'homepage' ? '/user/profile' : '/company'}
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-caption-1 font-medium text-slate-700 group-hover:text-blue-600">{t('myHome')}</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                      <button
                        onClick={() => { onLogout?.(); close(); }}
                        className="w-full flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-red-50 transition-colors group text-left cursor-pointer"
                      >
                        <span className="text-caption-1 font-medium text-red-500 group-hover:text-red-600">{t('logout')}</span>
                        <ChevronRight size={15} className="text-red-100 group-hover:text-red-400" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login-select"
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-caption-1 font-medium text-slate-700 group-hover:text-blue-600">{t('login')}</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                      <Link
                        href="/signup-select"
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-caption-1 font-medium text-slate-700 group-hover:text-blue-600">{t('signup')}</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                    </>
                  )}
                </motion.div>

              </motion.div>

              {/* 하단 브랜드 */}
              <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
                <Image
                  src="/images/workinkorea_logo.png"
                  alt="WorkInKorea"
                  width={120}
                  height={24}
                  className="opacity-30"
                />
              </div>

            </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
