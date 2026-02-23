import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-center">
        {/* 메인 제목 */}
        <h2 className="text-[24px] md:text-[40px] font-black text-white mb-3 md:mb-6 tracking-tight">
          지금 시작하세요!
        </h2>

        {/* 설명 */}
        <p className="text-[13px] md:text-lg text-blue-100 mb-8 md:mb-12">
          수많은 기업과 함께 새로운 미래를 시작하세요
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 text-sm md:text-base font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
          >
            무료 회원가입
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-transparent text-white text-sm md:text-base font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            공고 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}