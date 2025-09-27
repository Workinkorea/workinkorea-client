'use client';

import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색:', searchQuery);
  };

  return (
    <section className="relative min-h-[600px] bg-gradient-to-r from-blue-50 to-indigo-100 overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"%3E%3Cdefs%3E%3ClinearGradient id=\"bg\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%23f3f4f6\"%3E%3C/stop%3E%3Cstop offset=\"100%25\" style=\"stop-color:%23e5e7eb\"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"1200\" height=\"800\" fill=\"url(%23bg)\"%3E%3C/rect%3E%3C/svg%3E')"
        }}
      />

      <div className="relative flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* 메인 헤드라인 */}
          <h1 className="text-display-1 font-bold text-gray-900 mb-6">
            한국 취업의{' '}
            <span className="text-green-600">새로운 시작</span>
          </h1>

          {/* 서브 헤드라인 */}
          <p className="text-title-3 text-gray-600 mb-12">
            당신의 꿈을 현실로 만들어주는 전문적 취업을 장기적으로 지원합니다
          </p>

          {/* 검색 바 */}
          <div className="w-full sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mx-auto mb-8">
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg p-2 flex items-center">
              <div className="flex-1 px-4">
                <input
                  type="text"
                  placeholder="직무, 회사명, 키워드를 입력하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 text-body-1 border-none outline-none placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 flex items-center gap-2 transition-colors text-body-1 font-medium"
              >
                <Search className="w-5 h-5" />
                검색
              </button>
            </form>
          </div>

          {/* Talk with Liv 버튼 */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <span className="hidden sm:block font-medium text-body-3">Talk with Liv</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}