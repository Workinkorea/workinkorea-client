import Link from 'next/link';
import { User } from 'lucide-react';
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
  const navigationItems =
    type === 'homepage'
      ? [{ name: '공고', href: '/jobs' }]
      : [
          { name: '인재채용', href: '/company/posts/create' },
          { name: '채용공고 관리', href: '/company/jobs' },
        ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="px-6 md:px-10">
        <div className="flex items-center h-16 gap-4">

          {/* 로고 */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-blue-600 tracking-tight">
              WorkInKorea
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {type === 'homepage' ? '개인' : '기업'}
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
              aria-label="검색"
            >
              <SearchIcon />
            </button>

            {/* 사람 아이콘 — 비인증: 로그인, 인증: MY홈 */}
            <Link
              href={isAuthenticated ? (type === 'homepage' ? '/user/profile' : '/company') : '/login-select'}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none rounded-lg cursor-pointer"
              aria-label={isAuthenticated ? '마이페이지' : '로그인'}
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
