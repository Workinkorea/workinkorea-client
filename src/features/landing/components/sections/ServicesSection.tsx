import Link from 'next/link';
import { Target, FileText, MessageSquare } from 'lucide-react';

const services = [
  {
    id: 'personalized',
    title: '맞춤형 채용정보',
    description: 'AI 기반의 개인맞춤 취업정보 분석으로 최적의 기업을 추천합니다. 당신의 능력과 경험에 맞는 완벽한 기회를 찾아드립니다.',
    icon: Target,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    href: '/diagnosis',
    linkLabel: '진단 시작하기',
  },
  {
    id: 'resume',
    title: '이력서 작성 도구',
    description: '전문가가 검증한 이력서 템플릿으로 완벽한 지원서를 작성하세요. 한국 기업에 최적화된 가이드를 제공합니다.',
    icon: FileText,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    href: '/user/resume/create',
    linkLabel: '이력서 작성하기',
  },
  {
    id: 'jobs',
    title: '면접 컨설팅 가이드',
    description: '실제 현직자와의 모의면접과 개인별 피드백으로 면접 성공률을 높여보세요. 한국 문화에 맞는 면접 스킬을 습득할 수 있습니다.',
    icon: MessageSquare,
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    href: '/jobs',
    linkLabel: '공고 둘러보기',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-slate-900 mb-3 md:mb-4">
            Work In Korea{' '}
            <span className="text-blue-600">특별한 서비스</span>
          </h2>
          <p className="text-[13px] md:text-base text-slate-500">
            성공적인 한국 취업을 위한 특별한 서비스를 제공합니다
          </p>
        </div>

        {/* 서비스 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`
                  ${service.bgColor} ${service.borderColor}
                  border-2 rounded-xl p-8 text-center transition-all duration-200
                  hover:scale-105 hover:shadow-lg group
                `}
              >
                {/* 아이콘 */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconComponent
                      className={`w-8 h-8 ${service.iconColor} group-hover:scale-110 transition-transform`}
                    />
                  </div>
                </div>

                {/* 제목 */}
                <h3 className="text-[17px] font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>

                {/* 설명 */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {service.description}
                </p>

                {/* 링크 버튼 */}
                <div className="mt-6">
                  <Link
                    href={service.href}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                  >
                    {service.linkLabel} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
