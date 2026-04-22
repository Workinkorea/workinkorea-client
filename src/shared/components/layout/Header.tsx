'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchIcon } from '@/shared/ui/AccessibleIcon';
import { MobileNav } from './MobileNav';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { UserTypeToggle } from '@/shared/components/UserTypeToggle';
import type { ViewType } from '@/shared/components/UserTypeToggle';

interface HeaderProps {
  type: 'homepage' | 'business';
  viewType?: ViewType;
  onViewTypeChange?: (v: ViewType) => void;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  onLogout?: () => void;
}

export function Header({ type, viewType, onViewTypeChange, isAuthenticated, onLogout }: HeaderProps) {
  const t = useTranslations('common.nav');

  const navigationItems =
    type === 'homepage'
      ? [{ name: t('jobs'), href: '/jobs' }]
      : [
          { name: t('postJob'), href: '/company/posts/create' },
          { name: t('manageJobs'), href: '/company/jobs' },
        ];

  const myHomeHref = isAuthenticated
    ? type === 'homepage' ? '/user/profile' : '/company'
    : '/login-select';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center h-16 gap-4">

          {/* 로고: 모바일 = W 아이콘(app_logo), 데스크톱 = W + 텍스트(logo) */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/workinkorea_app_logo.png"
              alt="WorkInKorea"
              width={32}
              height={32}
              className="block lg:hidden"
              priority
            />
            <Image
              src="/images/workinkorea_logo.png"
              alt="WorkInKorea"
              width={160}
              height={32}
              className="hidden lg:block"
              priority
            />
          </Link>

          {/* 개인/기업 토글 — sm 이상에서만 표시 */}
          {viewType && onViewTypeChange && (
            <UserTypeToggle
              value={viewType}
              onChange={onViewTypeChange}
              className="ml-2 hidden sm:flex"
            />
          )}

          {/* 우측 공간 채우기 */}
          <div className="flex-1" />

          {/* 우측 아이콘 영역 */}
          <div className="flex items-center gap-1">
            {/* 언어 전환 — sm 이상에서만 표시 */}
            <LanguageToggle className="hidden sm:flex" />

            {/* 검색 아이콘 */}
            <button
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none rounded-lg cursor-pointer"
              aria-label={t('jobs')}
            >
              <SearchIcon />
            </button>

            {/* 사람 아이콘 — 비인증: 로그인, 인증: MY홈 */}
            <Link
              href={myHomeHref}
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
              viewType={viewType}
              onViewTypeChange={onViewTypeChange}
            />
          </div>

        </div>
      </div>
    </header>
  );
}
