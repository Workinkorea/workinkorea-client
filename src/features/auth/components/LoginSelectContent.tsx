'use client';

import Link from 'next/link';
import { User, Building2 } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

const LOGIN_OPTIONS = [
  {
    href: '/login',
    icon: User,
    title: '개인회원',
    description: '구직자 및 일반 회원',
  },
  {
    href: '/company-login',
    icon: Building2,
    title: '기업회원',
    description: '채용 담당자 및 기업 회원',
  },
] as const;

export default function LoginSelectContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        type="homepage"
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={async () => { await logout(); }}
      />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-[32px] text-slate-900 mb-4">로그인</h1>
            <p className="text-sm text-slate-600">회원 유형을 선택해주세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {LOGIN_OPTIONS.map(({ href, icon: Icon, title, description }) => (
              <Link key={href} href={href}>
                <div className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-slate-900 mb-2">{title}</h2>
                      <p className="text-sm text-slate-600">{description}</p>
                    </div>
                    <div className="pt-4 flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                      <span className="text-sm">로그인하기</span>
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-600">
              아직 회원이 아니신가요?{' '}
              <Link href="/signup-select" className="text-blue-600 hover:text-blue-700 font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
