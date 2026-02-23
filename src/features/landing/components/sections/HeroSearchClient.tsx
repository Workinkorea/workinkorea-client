'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

export default function HeroSearchClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full border-2 border-slate-200 rounded-full bg-white shadow-sm hover:shadow-md focus-within:border-blue-400 focus-within:shadow-md transition-all overflow-hidden"
    >
      {/* 직무 검색 */}
      <div className="flex items-center flex-1 px-4 md:px-5 py-3 gap-2.5 min-w-0">
        <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="직무, 키워드 및 회사"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-sm md:text-base border-none outline-none placeholder:text-slate-400 text-slate-800 bg-transparent min-w-0"
        />
      </div>

      {/* 구분선 */}
      <div className="w-px h-7 bg-slate-200 shrink-0 hidden sm:block" />

      {/* 지역 (고정) */}
      <div className="hidden sm:flex items-center px-4 md:px-5 py-3 gap-2 shrink-0">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-sm text-slate-500 whitespace-nowrap">대한민국</span>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-full px-5 md:px-7 py-3 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        검색
      </button>
    </form>
  );
}
