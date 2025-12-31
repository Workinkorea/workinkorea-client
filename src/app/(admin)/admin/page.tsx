import Link from 'next/link';
import { createServerAdminApi } from '@/lib/api/server';
import StatCards from '@/components/admin/StatCards';

async function getAdminStats() {
  try {
    const adminApi = await createServerAdminApi();
    const [usersData, companiesData, postsData] = await Promise.all([
      adminApi.getUsers(),
      adminApi.getCompanies(0, 1000),
      adminApi.getPosts(0, 1000),
    ]);

    return {
      totalUsers: usersData.length,
      totalCompanies: companiesData.length,
      totalPosts: postsData.length,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      totalUsers: 0,
      totalCompanies: 0,
      totalPosts: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h2>

      <StatCards stats={stats} />

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/users"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              일반 회원 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              회원 목록 보기, 추가, 수정, 삭제
            </div>
          </Link>
          <Link
            href="/admin/companies"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-green-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              기업 회원 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              기업 목록 보기, 추가, 수정, 삭제
            </div>
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 hover:border-purple-500 hover:shadow-md transition-all"
          >
            <div className="text-sm font-medium text-gray-900">
              공고 관리
            </div>
            <div className="mt-1 text-xs text-gray-500">
              공고 목록 보기, 수정, 삭제
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
