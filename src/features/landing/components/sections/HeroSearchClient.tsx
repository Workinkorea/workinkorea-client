'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';

/** 각 phrase 표시 유지 시간 (ms) */
const PHRASE_DURATION = 3000;

export default function HeroSearchClient() {
  const t = useTranslations('landing.hero');
  const phrases = t.raw('searchPhrases') as string[];

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const router = useRouter();

  /* 일정 간격으로 phrase 인덱스를 순환 — 항상 전체 단어 단위로 전환 */
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, PHRASE_DURATION);
    return () => clearInterval(interval);
  }, [phrases.length]);

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

        {/* 롤링 애니메이션 placeholder — 전체 단어 단위 전환 */}
        {showAnimated && (
          <span
            className="absolute left-[calc(1rem+1.5rem)] md:left-[calc(1.25rem+1.75rem)] pointer-events-none select-none whitespace-nowrap"
            aria-hidden="true"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                className="inline-block text-body-2 md:text-body-1 text-slate-400"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              >
                {phrases[phraseIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="inline-block w-[2px] h-[1em] ml-[1px] bg-slate-400 align-middle animate-[blink_0.8s_step-end_infinite]" />
          </span>
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-body-2 md:text-body-1 border-none outline-none text-slate-800 bg-transparent min-w-0"
          aria-label={t('searchAriaLabel')}
        />
      </div>

      {/* 구분선 */}
      <div className="w-px h-7 bg-slate-100 shrink-0 hidden sm:block" />

      {/* 지역 (고정) */}
      <div className="hidden sm:flex items-center px-4 md:px-5 py-3 gap-2 shrink-0">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-body-2 text-slate-500 whitespace-nowrap">{t('searchLocation')}</span>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-full px-5 md:px-7 py-3 font-semibold text-label-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        style={{ color: '#ffffff' }}
      >
        {t('searchButton')}
      </button>
    </form>
  );
}
