import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const IndividualHeader = () => {

  const navigationItems = [
    { label: '채용·모집', href: '/jobs' },
    { label: '해외취업 상담', href: '/consulting' },
    { label: '해외취업 교육', href: '/education' },
    { label: '설명회·박람회', href: '/events' },
    { label: '사후지원센터', href: '/support' },
    { label: '자료실', href: '/resources' },
    { label: '공지·문의', href: '/notice' }
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="WorkInKorea"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">
              개인회원
            </button>

            <button className="bg-primary-300 text-white px-4 py-2 rounded text-sm hover:bg-primary-400">
              사업소개
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default IndividualHeader;