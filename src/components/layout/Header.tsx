import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  type: 'homepage' | 'individual';
  onToggleType: () => void;
}

const Header = ({ type, onToggleType }: HeaderProps) => {
  const getNavigationItems = () => {
    if (type === 'homepage') {
      return [
        { name: '채용·모집', href: '/jobs' },
        { name: '해외취업 상담', href: '/consulting' }, 
        { name: '해외취업 교육', href: '/education' },
        { name: '설명회·박람회', href: '/events' },
        { name: '자료실', href: '/resources' },
        { name: '공지·문의', href: '/support' }
      ];
    } else {
      return [
        { name: '인재채용', href: '/company/recruitment' },
        { name: '채용공고 관리', href: '/company/jobs' },
        { name: '지원자 관리', href: '/company/applicants' }, 
        { name: '기업정보 관리', href: '/company/profile' },
        { name: '고객지원', href: '/company/support' },
        { name: '공지사항', href: '/company/notices' }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="w-full bg-color-background-default border-b border-color-line-400 shadow-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-label-900 hover:text-primary-500 px-3 py-2 text-body-3 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-label-500 hover:text-label-700 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="relative">
              <button
                onClick={onToggleType}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-body-3 font-medium transition-all duration-200
                  ${type === 'homepage' 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100' 
                    : 'bg-secondary-50 text-secondary-700 border border-secondary-200 hover:bg-secondary-100'
                  }
                `}
              >
                <span className="mr-2 text-caption-1">
                  {type === 'homepage' ? '👤' : '🏢'}
                </span>
                {type === 'homepage' ? '기업회원으로' : '개인회원으로'}
                <svg 
                  className="ml-2 h-4 w-4 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {type === 'homepage' ? (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login"
                  className="text-label-700 hover:text-primary-500 px-3 py-2 text-body-3 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link 
                  href="/signup"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-body-3 font-medium transition-colors shadow-normal"
                >
                  회원가입
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/company/login"
                  className="text-label-700 hover:text-secondary-500 px-3 py-2 text-body-3 font-medium transition-colors"
                >
                  기업 로그인
                </Link>
                <Link 
                  href="/company/signup"
                  className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg text-body-3 font-medium transition-colors shadow-normal"
                >
                  기업 회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background-alternative">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-label-900 hover:text-primary-500 block px-3 py-2 text-body-2 font-medium transition-colors"
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