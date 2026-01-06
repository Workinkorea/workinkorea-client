import HeroSearchClient from './HeroSearchClient';

export default function HeroSection() {
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

          {/* 검색 및 버튼 (클라이언트 컴포넌트) */}
          <HeroSearchClient />
        </div>
      </div>
    </section>
  );
}