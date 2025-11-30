'use client';

import { useEffect, useState } from 'react';
import { adminApi, AdminUser } from '@/lib/api/admin';
import { toast } from 'sonner';

interface UserFormData {
  email: string;
  name: string;
  birth_date: string;
  country_code: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    birth_date: '',
    country_code: 'KR',
  });

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await adminApi.getUsers(page, limit);
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다.');
      // Mock data for development
      setUsers([
        {
          id: 1,
          email: 'user1@example.com',
          name: '홍길동',
          birth_date: '1990-01-01',
          country_code: 'KR',
          created_at: '2024-01-01',
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: '김영희',
          birth_date: '1995-05-15',
          country_code: 'KR',
          created_at: '2024-01-15',
        },
      ]);
      setTotal(2);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      birth_date: '',
      country_code: 'KR',
    });
    setShowModal(true);
  }

  function openEditModal(user: AdminUser) {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      birth_date: user.birth_date,
      country_code: user.country_code,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser.id, {
          name: formData.name,
          birth_date: formData.birth_date,
          country_code: formData.country_code,
        });
        toast.success('사용자가 수정되었습니다.');
      } else {
        await adminApi.createUser(formData);
        toast.success('사용자가 추가되었습니다.');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('사용자 저장에 실패했습니다.');
    }
  }

  async function handleDelete(userId: number) {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      toast.success('사용자가 삭제되었습니다.');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('사용자 삭제에 실패했습니다.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">일반 회원 관리</h2>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          회원 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                생년월일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                국가
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.birth_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.country_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          전체 {total}명 중 {(page - 1) * limit + 1}-
          {Math.min(page * limit, total)}명 표시
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? '회원 수정' : '회원 추가'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingUser}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    생년월일
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    국가 코드
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country_code}
                    onChange={(e) =>
                      setFormData({ ...formData, country_code: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  {editingUser ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
