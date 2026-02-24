'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/utils';

interface NavItem {
  name: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  type?: 'homepage' | 'business';
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const HOMEPAGE_QUICK = [
  { label: '채용공고', emoji: '💼', href: '/jobs' },
  { label: '이력서', emoji: '📄', href: '/user/resume/create' },
  { label: '자가진단', emoji: '🎯', href: '/diagnosis' },
];

const BUSINESS_QUICK = [
  { label: '공고 등록', emoji: '✍️', href: '/company/posts/create' },
  { label: '후보자 관리', emoji: '👥', href: '/company/jobs' },
  { label: '기업 프로필', emoji: '🏢', href: '/company/profile/edit' },
];

const HOMEPAGE_SECTIONS = [
  {
    title: '채용공고',
    items: [
      { icon: '📍', label: '지역별 공고', href: '/jobs' },
      { icon: '💼', label: '직무별 공고', href: '/jobs' },
      { icon: '🌏', label: '외국인 채용', href: '/jobs' },
      { icon: '⭐', label: '추천 공고', href: '/jobs' },
    ],
  },
  {
    title: 'MY',
    items: [
      { icon: '👤', label: '내 프로필', href: '/user/profile' },
      { icon: '📋', label: '이력서 관리', href: '/user/resume/create' },
      { icon: '🔍', label: '자가진단', href: '/diagnosis' },
    ],
  },
];

const BUSINESS_SECTIONS = [
  {
    title: '채용 관리',
    items: [
      { icon: '✍️', label: '인재채용', href: '/company/posts/create' },
      { icon: '📋', label: '채용공고 관리', href: '/company/jobs' },
      { icon: '👥', label: '후보자 관리', href: '/company/jobs' },
      { icon: '🏢', label: '기업 프로필', href: '/company/profile/edit' },
    ],
  },
];

export function MobileNav({ items, type = 'homepage', isAuthenticated, onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="메뉴 열기"
      >
        <Menu size={22} />
      </button>

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
              className="fixed top-0 right-0 w-full h-full bg-white z-[110] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="네비게이션 메뉴"
            >

              {/* 패널 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                <Link
                  href="/"
                  onClick={close}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  aria-label="홈으로"
                >
                  <Home size={20} />
                </Link>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                  aria-label="메뉴 닫기"
                >
                  <X size={22} />
                </button>
              </div>

              {/* 스크롤 가능한 본문 */}
              <div className="flex-1 overflow-y-auto">

                {/* 자주 찾는 메뉴 */}
                <div className="px-5 pt-6 pb-5">
                  <p className="text-[13px] font-bold text-slate-900 mb-3">
                    자주 찾는 메뉴예요
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickLinks.map(link => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={close}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-full text-[13px] font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span>{link.emoji}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 mx-5" />

                {/* 섹션별 2열 메뉴 */}
                {sections.map((section, si) => (
                  <div key={section.title}>
                    {si > 0 && <div className="h-px bg-slate-100 mx-5" />}
                    <div className="px-5 pt-5 pb-3">
                      <p className="text-[13px] font-bold text-slate-900 mb-3">
                        {section.title}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {section.items.map(item => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={close}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <span className="text-[18px] leading-none">{item.icon}</span>
                            <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="h-px bg-slate-100 mx-5" />

                {/* 인증 링크 */}
                <div className="px-5 py-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={type === 'homepage' ? '/user/profile' : '/company'}
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600">MY홈</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                      <button
                        onClick={() => { onLogout?.(); close(); }}
                        className="w-full flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group text-left"
                      >
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600">로그아웃</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login-select"
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600">로그인</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                      <Link
                        href="/signup-select"
                        onClick={close}
                        className="flex items-center justify-between px-3 py-3.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600">회원가입</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400" />
                      </Link>
                    </>
                  )}
                </div>

              </div>

              {/* 하단 브랜드 */}
              <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
                <span className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
                  WorkInKorea
                </span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
