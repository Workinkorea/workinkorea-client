'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

export default function SignupSelectContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        type="homepage"
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={handleLogout}
      />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-title-1 text-label-900 mb-4">
              회원가입
            </h1>
            <p className="text-body-2 text-label-600">
              회원 유형을 선택해주세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 개인 회원 카드 */}
            <Link href="/signup">
              <div className="group bg-white rounded-2xl p-8 border-2 border-line-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-title-3 text-label-900 mb-2">개인회원</h2>
                    <p className="text-body-3 text-label-600">
                      구직자 및 일반 회원
                    </p>
                  </div>
                  <ul className="text-left text-caption-1 text-label-600 space-y-2">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>채용 공고 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>이력서 작성 및 관리</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>취업 비자 정보 확인</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <div className="flex items-center text-primary-500 group-hover:text-primary-600 font-medium">
                      <span className="text-body-3">회원가입하기</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* 기업 회원 카드 */}
            <Link href="/company-signup/step1">
              <div className="group bg-white rounded-2xl p-8 border-2 border-line-200 hover:border-secondary-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center group-hover:bg-secondary-100 transition-colors">
                    <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-title-3 text-label-900 mb-2">기업회원</h2>
                    <p className="text-body-3 text-label-600">
                      채용 담당자 및 기업 회원
                    </p>
                  </div>
                  <ul className="text-left text-caption-1 text-label-600 space-y-2">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>채용 공고 등록 및 관리</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>인재 검색 및 스카우트</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>지원자 관리</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <div className="flex items-center text-secondary-500 group-hover:text-secondary-600 font-medium">
                      <span className="text-body-3">회원가입하기</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-body-3 text-label-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login-select" className="text-primary-500 hover:text-primary-600 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
