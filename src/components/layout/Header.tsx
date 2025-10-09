import React from 'react';
import Link from 'next/link';
import { SearchIcon } from '@/components/ui/AccessibleIcon';

interface HeaderProps {
  type: 'homepage' | 'business';
  onToggleType?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header = ({ type, onToggleType, isAuthenticated, onLogout }: HeaderProps) => {
  const getNavigationItems = () => {
    if (type === 'homepage') {
      return [
        { name: '공고', href: '/jobs' },
        { name: '기업 정보', href: '/company-info' }, 
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
              <span className="ml-2 text-caption-2 text-label-500 bg-component-alternative px-2 py-1 rounded">
                {type === 'homepage' ? '개인' : '기업'}
              </span>
            </Link>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-label-900 hover:text-primary-500 text-body-3 font-medium transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="w-full flex justify-end items-center space-x-3">
            <button
              className="p-2 text-label-500 hover:text-label-700 transition-colors"
              aria-label="검색"
            >
              <SearchIcon />
            </button>

            <div className="relative">
              <button
                onClick={onToggleType}
                className={`
                  flex items-center gap-2 h-9 px-3 rounded-lg text-body-3 font-medium transition-all duration-200 cursor-pointer
                  ${type === 'homepage' 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100' 
                    : 'bg-secondary-50 text-secondary-700 border border-secondary-200 hover:bg-secondary-100'
                  }
                `}
              >
                <span className="whitespace-nowrap">
                  {type === 'homepage' ? '기업회원으로' : '개인회원으로'}
                </span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogout}
                  className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              type === 'homepage' ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-label-700 hover:text-primary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                  >
                    개인 로그인
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/company-login"
                    className="text-label-700 hover:text-secondary-500 h-9 flex items-center text-body-3 font-medium transition-colors"
                  >
                    기업 로그인
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1 bg-background-alternative">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-label-900 hover:text-primary-500 block mx-4 py-3 text-body-2 font-medium transition-colors border-b border-label-100 last:border-b-0"
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