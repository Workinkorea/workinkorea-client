import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroSearchClient from './HeroSearchClient';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 py-12 bg-white">
      {/* 검색바 */}
      <div className="w-full max-w-2xl mb-12 md:mb-16">
        <HeroSearchClient />
      </div>

      {/* 브랜드 + CTA */}
      <div className="text-center">
        {/* 로고 */}
        <p
          className="font-['Plus_Jakarta_Sans'] text-[36px] md:text-[52px] font-black text-blue-600 mb-5 tracking-tight leading-none"
        >
          Work In Korea
        </p>

        {/* 헤드라인 */}
        <h1 className="text-[20px] md:text-[28px] font-bold text-slate-900 mb-3">
          한국 취업, 여기서 시작됩니다
        </h1>

        {/* 서브 설명 */}
        <p className="text-[13px] md:text-base text-slate-500 mb-8">
          맞춤형 채용공고 추천을 확인하려면 로그인하세요.
        </p>

        {/* 시작하기 버튼 */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors shadow-md hover:shadow-lg"
        >
          시작하기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
