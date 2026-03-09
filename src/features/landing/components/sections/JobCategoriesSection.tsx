import Link from 'next/link';
import { Monitor, Megaphone, Palette, TrendingUp, Building, GraduationCap, ChefHat, Rocket } from 'lucide-react';

const jobCategories = [
  { id: 'it',        title: 'IT',      icon: Monitor,       bgColor: 'bg-blue-50',   iconColor: 'text-blue-600' },
  { id: 'marketing', title: '마케팅',   icon: Megaphone,     bgColor: 'bg-blue-50',   iconColor: 'text-blue-600' },
  { id: 'design',    title: '디자인',   icon: Palette,       bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'sales',     title: '영업/사업', icon: TrendingUp,    bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  { id: 'finance',   title: '금융',     icon: Building,      bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  { id: 'education', title: '교육',     icon: GraduationCap, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { id: 'food',      title: '요리',     icon: ChefHat,       bgColor: 'bg-red-50',    iconColor: 'text-red-600' },
  { id: 'startup',   title: '스타트업', icon: Rocket,        bgColor: 'bg-teal-50',   iconColor: 'text-teal-600' },
];

export default function JobCategoriesSection() {
  return (
    <section id="job-categories" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            직종 카테고리
          </span>
          <h2 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 mb-3">
            직종별 채용정보
          </h2>
          <p className="text-[13px] sm:text-[15px] text-slate-500">
            원하는 분야의 채용공고를 바로 찾아보세요
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/jobs?q=${encodeURIComponent(category.title)}`}
                className="flex flex-col items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-4 sm:py-5 hover:border-blue-200 hover:shadow-md cursor-pointer group transition-all duration-200"
              >
                <div className={`${category.bgColor} rounded-xl p-3 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${category.iconColor}`} />
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-700 group-hover:text-blue-700 transition-colors text-center">
                  {category.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
