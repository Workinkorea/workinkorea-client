import { Monitor, Megaphone, Palette, TrendingUp, Building, GraduationCap, ChefHat, Rocket } from 'lucide-react';

const jobCategories = [
  {
    id: 'it',
    title: 'IT',
    icon: Monitor,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 'marketing',
    title: '마케팅',
    icon: Megaphone,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  {
    id: 'design',
    title: '디자인',
    icon: Palette,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    id: 'sales',
    title: '영업/사업',
    icon: TrendingUp,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
  },
  {
    id: 'finance',
    title: '금융',
    icon: Building,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
  },
  {
    id: 'education',
    title: '교육',
    icon: GraduationCap,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
  },
  {
    id: 'food',
    title: '요리',
    icon: ChefHat,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 'startup',
    title: '스타트업',
    icon: Rocket,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200',
  },
];

export default function JobCategoriesSection() {
  return (
    <section id="job-categories" className="py-16 bg-gray-50">
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mx-auto mb-12">
          <h2 className="text-title-1 font-bold text-gray-900 mb-4">
            직종별 정보
          </h2>
          <p className="text-body-1 text-gray-600 mx-auto">
            원하는 분야의 정보를 확인하세요
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`
                  ${category.bgColor} ${category.borderColor}
                  border-2 rounded-xl p-6 text-center transition-all duration-200
                  hover:scale-105 hover:shadow-lg cursor-pointer group
                `}
              >
                <div className="flex justify-center mb-4">
                  <IconComponent
                    className={`w-12 h-12 ${category.iconColor} group-hover:scale-110 transition-transform`}
                  />
                </div>
                <h3 className="text-title-4 font-semibold text-gray-800">
                  {category.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}