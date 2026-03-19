'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchIcon } from '@/shared/ui/AccessibleIcon';
import { MobileNav } from './MobileNav';
import { LanguageToggle } from '@/shared/components/LanguageToggle';

interface HeaderProps {
  type: 'homepage' | 'business';
  isAuthenticated?: boolean;
  isLoading?: boolean;
  onLogout?: () => void;
}

export function Header({ type, isAuthenticated, onLogout }: HeaderProps) {
  const t = useTranslations('common.nav');

  const navigationItems =
    type === 'homepage'
      ? [{ name: t('jobs'), href: '/jobs' }]
      : [
          { name: t('postJob'), href: '/company/posts/create' },
          { name: t('manageJobs'), href: '/company/jobs' },
        ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center h-16 gap-4">

          {/* 로고 */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-blue-600 tracking-tight">
              WorkInKorea
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {type === 'homepage' ? t('personal') : t('company')}
            </span>
          </Link>

          {/* 우측 공간 채우기 */}
          <div className="flex-1" />

          {/* 우측 아이콘 영역 */}
          <div className="flex items-center gap-1">
            {/* 언어 전환 */}
            <LanguageToggle />

            {/* 검색 아이콘 */}
            <button
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none rounded-lg cursor-pointer"
              aria-label={t('jobs')}
            >
              <SearchIcon />
            </button>

            {/* 사람 아이콘 — 비인증: 로그인, 인증: MY홈 */}
            <Link
              href={isAuthenticated ? (type === 'homepage' ? '/user/profile' : '/company') : '/login-select'}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none rounded-lg cursor-pointer"
              aria-label={isAuthenticated ? t('myHome') : t('login')}
            >
              <User size={20} />
            </Link>

            {/* 햄버거 메뉴 — 모바일·데스크탑 공통 */}
            <MobileNav
              items={navigationItems}
              type={type}
              isAuthenticated={isAuthenticated}
              onLogout={onLogout}
            />
          </div>

        </div>
      </div>
    </header>
  );
}
