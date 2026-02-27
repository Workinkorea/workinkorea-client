import { Monitor, Megaphone, Palette, TrendingUp, Building, GraduationCap, ChefHat, Rocket } from 'lucide-react';

const jobCategories = [
  {
    id: 'it',
    title: 'IT',
    icon: Monitor,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'marketing',
    title: '마케팅',
    icon: Megaphone,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'design',
    title: '디자인',
    icon: Palette,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'sales',
    title: '영업/사업',
    icon: TrendingUp,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'finance',
    title: '금융',
    icon: Building,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  {
    id: 'education',
    title: '교육',
    icon: GraduationCap,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'food',
    title: '요리',
    icon: ChefHat,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    id: 'startup',
    title: '스타트업',
    icon: Rocket,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

export default function JobCategoriesSection() {
  return (
    <section id="job-categories" className="py-12 md:py-16 bg-slate-50">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mx-auto mb-8 md:mb-12">
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-slate-900 mb-3 md:mb-4">
            직종별 정보
          </h2>
          <p className="text-[13px] md:text-base text-slate-500 mx-auto">
            원하는 분야의 정보를 확인하세요
          </p>
        </div>

        {/* 카테고리 그리드 — 수평 카드 레이아웃 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-3 md:px-4 md:py-3.5 hover:border-blue-200 hover:shadow-md cursor-pointer group transition-all duration-200"
              >
                {/* 아이콘 배경 박스 */}
                <div className={`${category.bgColor} rounded-lg p-2 shrink-0 flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${category.iconColor} group-hover:scale-110 transition-transform`} />
                </div>
                {/* 카테고리명 */}
                <span className="text-sm md:text-[15px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {category.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
