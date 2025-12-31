import { createServerAdminApi } from '@/lib/api/server';
import UsersTableClient from '@/components/admin/UsersTableClient';

export const dynamic = 'force-dynamic';

async function getUsers() {
  try {
    const adminApi = await createServerAdminApi();
    return await adminApi.getUsers();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">일반 회원 관리</h2>
      </div>
      <UsersTableClient initialUsers={users} />
    </div>
  );
}
