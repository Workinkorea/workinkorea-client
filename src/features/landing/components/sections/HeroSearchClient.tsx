'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

const PHRASES = [
  '개발자',
  '마케터',
  '비자 지원 가능',
  '디자이너',
  '서울 정규직',
  '한국어 능통자 우대',
  'IT 스타트업',
  '영어 가능',
];

const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_TYPED = 1800;
const PAUSE_DELETED = 400;

function useTypewriter(phrases: string[]) {
  const [display, setDisplay] = useState('');
  // ref로 mutable 상태 관리 → stale closure 없이 단일 루프 유지
  const state = useRef({ phraseIdx: 0, charIdx: 0, isDeleting: false });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { phraseIdx, charIdx, isDeleting } = state.current;
      const word = phrases[phraseIdx];

      if (!isDeleting) {
        const next = charIdx + 1;
        setDisplay(word.slice(0, next));
        state.current.charIdx = next;

        if (next === word.length) {
          // 완성 → PAUSE 후 삭제 시작
          state.current.isDeleting = true;
          timer = setTimeout(tick, PAUSE_TYPED);
        } else {
          timer = setTimeout(tick, TYPE_SPEED);
        }
      } else {
        const next = charIdx - 1;
        setDisplay(word.slice(0, next));
        state.current.charIdx = next;

        if (next === 0) {
          // 전부 삭제 → 다음 단어로
          state.current.isDeleting = false;
          state.current.phraseIdx = (phraseIdx + 1) % phrases.length;
          timer = setTimeout(tick, PAUSE_DELETED);
        } else {
          timer = setTimeout(tick, DELETE_SPEED);
        }
      }
    };

    timer = setTimeout(tick, TYPE_SPEED);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return display;
}

export default function HeroSearchClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const animatedText = useTypewriter(PHRASES);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  const showAnimated = !isFocused && searchQuery === '';

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full border-2 border-slate-200 rounded-full bg-white shadow-sm hover:shadow-md focus-within:border-blue-400 focus-within:shadow-md transition-all overflow-hidden"
    >
      {/* 직무 검색 */}
      <div className="relative flex items-center flex-1 px-4 md:px-5 py-3 gap-2.5 min-w-0">
        <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" />

        {/* 타이핑 애니메이션 placeholder */}
        {showAnimated && (
          <span
            className="absolute left-[calc(1rem+1.5rem)] md:left-[calc(1.25rem+1.75rem)] text-sm md:text-base text-slate-400 pointer-events-none select-none whitespace-nowrap overflow-hidden"
            aria-hidden="true"
          >
            {animatedText}
            <span className="inline-block w-[2px] h-[1em] ml-[1px] bg-slate-400 align-middle animate-[blink_0.8s_step-end_infinite]" />
          </span>
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-sm md:text-base border-none outline-none text-slate-800 bg-transparent min-w-0"
          aria-label="직무, 키워드 및 회사 검색"
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
