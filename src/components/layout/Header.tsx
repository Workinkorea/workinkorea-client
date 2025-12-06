import React from 'react';
import Link from 'next/link';
import { SearchIcon } from '@/components/ui/AccessibleIcon';

interface HeaderProps {
  type: 'homepage' | 'business';
  isAuthenticated?: boolean;
  isLoading?: boolean;
  onLogout?: () => void;
}

const Header = ({ type, isAuthenticated, onLogout }: HeaderProps) => {
  const getNavigationItems = () => {
    if (type === 'homepage') {
      return [
        { name: '공고', href: '/jobs' },
      ];
    } else {
      return [
        { name: '인재채용', href: '/company/recruitment' },
        { name: '채용공고 관리', href: '/company/jobs' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="w-full bg-color-background-default border-b border-line-200 shadow-normal">
      <div className="px-4 sm:px-6 lg:px-8">

        <div className="w-full flex items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-title-3 font-bold text-primary-500">
                WorkInKorea
              </span>
              <span className="hidden sm:block ml-2 text-caption-2 text-label-500 bg-component-alternative px-2 py-1 rounded">
                {type === 'homepage' ? '개인' : '기업'}
              </span>
            </Link>
          </div>

          <nav className="hidden sm:block">
            <div className="ml-10 flex gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-label-900 hover:text-primary-500 font-medium text-body-3 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="w-full flex justify-end items-center space-x-3">
            <button
              className="hidden sm:block p-2 text-label-500 hover:text-label-700 transition-colors"
              aria-label="검색"
            >
              <SearchIcon />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href={type === 'homepage' ? '/user/profile' : '/company'}
                  className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                >
                  MY홈
                </Link>
                <div className="h-4 w-px bg-line-400"></div>
                <button
                  onClick={onLogout}
                  className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login-select"
                  className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                >
                  로그인
                </Link>
                <div className="h-4 w-px bg-line-400"></div>
                <Link
                  href="/signup-select"
                  className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <div className="flex flex-col gap-1 pl-5 pt-1 pb-1 bg-gray-50">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-label-900 hover:text-primary-500 py-0.5 text-caption-1 font-medium transition-colors border-b border-label-100 last:border-b-0"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;