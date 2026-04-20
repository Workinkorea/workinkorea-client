'use client';

import Link from 'next/link';
import { Monitor, Megaphone, Palette, TrendingUp, Building, GraduationCap, ChefHat, Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function JobCategoriesSection() {
  const t = useTranslations('landing.categories');

  const jobCategories = [
    { id: 'it',        title: t('it'),        icon: Monitor,       bgColor: 'bg-blue-50',   iconColor: 'text-blue-600' },
    { id: 'marketing', title: t('marketing'), icon: Megaphone,     bgColor: 'bg-blue-50',   iconColor: 'text-blue-600' },
    { id: 'design',    title: t('design'),    icon: Palette,       bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 'sales',     title: t('sales'),     icon: TrendingUp,    bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { id: 'finance',   title: t('finance'),   icon: Building,      bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { id: 'education', title: t('education'), icon: GraduationCap, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { id: 'food',      title: t('food'),      icon: ChefHat,       bgColor: 'bg-red-500-bg',    iconColor: 'text-red-500' },
    { id: 'startup',   title: t('startup'),   icon: Rocket,        bgColor: 'bg-teal-50',   iconColor: 'text-teal-600' },
  ];

  return (
    <section id="job-categories" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100">
      <div className="page-container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-caption-2 font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {t('overline')}
          </span>
          <h2 className="text-title-3 sm:text-title-1 font-extrabold text-slate-900 mb-3">
            {t('title')}
          </h2>
          <p className="text-caption-1 sm:text-body-2 text-slate-500">
            {t('subtitle')}
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
                <span className="text-caption-2 sm:text-caption-1 font-semibold text-slate-700 group-hover:text-blue-700 transition-colors text-center">
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
