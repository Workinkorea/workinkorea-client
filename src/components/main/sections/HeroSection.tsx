'use client';

import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const scrollToJobCategories = () => {
    const element = document.getElementById('job-categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section>

      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 bg-primary-100">
        <div className="text-center">
          {/* 메인 헤드라인 */}
          <h1 className="text-display-2 font-bold text-gray-900 mb-6">
            한국 취업의{' '}
            <span className="text-green-600">새로운 시작</span>
          </h1>

          {/* 서브 헤드라인 */}
          <p className="text-title-5 text-gray-600 mb-12">
            당신의 꿈을 현실로 만들어주는 전문적 취업을 장기적으로 지원합니다
          </p>

          {/* 검색 바 */}
          <div className="flex flex-col gap-3 w-full sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mx-auto mb-8">
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
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 py-3 flex items-center gap-2 transition-colors text-body-1 font-medium"
              >
                <Search className="w-5 h-5" />
                검색
              </button>
            </form>

            {/* 버튼들 */}
            <div className='flex justify-center gap-4 mt-6'>
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm cursor-pointer">
                자가진단
              </button>
              <button
                onClick={scrollToJobCategories}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
              >
                직종별 정보 보러가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}