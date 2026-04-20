'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '대시보드', path: '/admin' },
  { name: '일반 회원 관리', path: '/admin/users' },
  { name: '기업 회원 관리', path: '/admin/companies' },
  { name: '공고 관리', path: '/admin/posts' },
  { name: '이벤트 관리', path: '/admin/events' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <p className="text-title-3 font-bold text-slate-900">관리자 페이지</p>
            <Link
              href="/"
              className="text-body-3 text-slate-600 hover:text-slate-900 transition-colors"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block rounded-lg px-4 py-2 text-body-3 font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="rounded-xl bg-white shadow-md p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
