'use client';

import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalPosts: number;
}

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const statCards = [
    {
      title: '전체 일반 회원',
      value: stats.totalUsers,
      link: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: '전체 기업 회원',
      value: stats.totalCompanies,
      link: '/admin/companies',
      color: 'bg-emerald-500',
    },
    {
      title: '전체 공고',
      value: stats.totalPosts,
      link: '/admin/posts',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {statCards.map((card) => (
        <Link
          key={card.title}
          href={card.link}
          className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow"
        >
          <div className={`${card.color} px-4 py-5 sm:px-5 sm:py-5 lg:p-6`}>
            <dt className="text-caption-1 font-medium text-white truncate">
              {card.title}
            </dt>
            <dd className="mt-1 text-title-1 font-semibold text-white">
              {card.value}
            </dd>
          </div>
        </Link>
      ))}
    </div>
  );
}
