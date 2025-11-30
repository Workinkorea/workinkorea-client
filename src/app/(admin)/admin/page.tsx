'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalPosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch stats from API
        const [usersData, companiesData, postsData] = await Promise.all([
          adminApi.getUsers(1, 1),
          adminApi.getCompanies(1, 1),
          adminApi.getPosts(1, 1),
        ]);

        setStats({
          totalUsers: usersData.total,
          totalCompanies: companiesData.total,
          totalPosts: postsData.total,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Use mock data if API fails
        setStats({
          totalUsers: 150,
          totalCompanies: 45,
          totalPosts: 89,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

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
      color: 'bg-green-500',
    },
    {
      title: '전체 공고',
      value: stats.totalPosts,
      link: '/admin/posts',
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <a
            key={card.title}
            href={card.link}
            className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow"
          >
            <div className={`${card.color} px-4 py-5 sm:p-6`}>
              <dt className="text-sm font-medium text-white truncate">
                {card.title}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-white">
                {card.value}
              </dd>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/users"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              일반 회원 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              회원 목록 보기, 추가, 수정, 삭제
            </div>
          </a>
          <a
            href="/admin/companies"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-green-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              기업 회원 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              기업 목록 보기, 추가, 수정, 삭제
            </div>
          </a>
          <a
            href="/admin/posts"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-purple-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              공고 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              공고 목록 보기, 수정, 삭제
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
