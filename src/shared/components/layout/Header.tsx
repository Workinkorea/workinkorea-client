import Link from 'next/link';
import { SearchIcon } from '@/shared/ui/AccessibleIcon';

interface HeaderProps {
  type: 'homepage' | 'business';
  isAuthenticated?: boolean;
  isLoading?: boolean;
  onLogout?: () => void;
}

export function Header({ type, isAuthenticated, onLogout }: HeaderProps) {
  const getNavigationItems = () => {
    if (type === 'homepage') {
      return [
        { name: '공고', href: '/jobs' },
      ];
    } else {
      return [
        { name: '인재채용', href: '/company/posts/create' },
        { name: '채용공고 관리', href: '/company/jobs' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-blue-600 tracking-tight">
                WorkInKorea
              </span>
              <span className="hidden sm:block ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
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
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex justify-end items-center space-x-3 ml-auto">
            <button
              className="hidden sm:block p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="검색"
            >
              <SearchIcon />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href={type === 'homepage' ? '/user/profile' : '/company'}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 h-9 flex items-center transition-colors"
                >
                  MY홈
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 h-9 flex items-center transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login-select"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 h-9 flex items-center transition-colors"
                >
                  로그인
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <Link
                  href="/signup-select"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 h-9 flex items-center transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <div className="flex flex-col bg-slate-50 border-t border-slate-100">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-slate-700 hover:text-blue-600 font-medium transition-colors border-b border-slate-100 last:border-b-0 px-6 py-2"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}