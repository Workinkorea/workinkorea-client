import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-center">
        {/* 메인 제목 */}
        <h2 className="text-display-2 font-bold text-white mb-6">
          지금 시작하세요!
        </h2>

        {/* 설명 */}
        <p className="text-title-2 text-green-100 mb-12">
          수많은 기업과 함께 새로운 미래를 시작하세요
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-body-1 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            무료 회원가입
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white text-body-1 font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-colors"
          >
            공고 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}