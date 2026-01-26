import { fetchAPI } from '@/shared/api/fetchClient';
import { AdminUser } from '@/shared/types/api';
import UsersTableClient from '@/features/admin/components/UsersTableClient';

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<AdminUser[]> {
  try {
    return await fetchAPI<AdminUser[]>('/api/admin/users/?skip=0&limit=10');
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
