'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { toast } from 'sonner';
import type { AdminUser } from '@/shared/types/api';

interface UsersTableClientProps {
  initialUsers: AdminUser[];
}

export default function UsersTableClient({ initialUsers }: UsersTableClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passportCerti, setPassportCerti] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const data = await adminApi.getUsers(skip, limit);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다.');
    }
  }, [page, limit]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { passport_certi: boolean } }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('사용자가 수정되었습니다.');
      setShowModal(false);
      fetchUsers();
    },
    onError: (error) => {
      console.error('Failed to save user:', error);
      toast.error('사용자 저장에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('사용자가 삭제되었습니다.');
      fetchUsers();
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error('사용자 삭제에 실패했습니다.');
    },
  });

  function openEditModal(user: AdminUser) {
    setEditingUser(user);
    setPassportCerti(user.passport_certi);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    updateMutation.mutate({
      id: editingUser.id,
      data: { passport_certi: passportCerti },
    });
  }

  async function handleDelete(userId: number) {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }
    deleteMutation.mutate(userId);
  }

  return (
    <>
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
                여권 인증
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.passport_certi
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.passport_certi ? '인증됨' : '미인증'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
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
          페이지 {page} (현재 {users.length}개 표시)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            이전
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < limit}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">회원 수정</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    disabled
                    value={editingUser.email}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={passportCerti}
                      onChange={(e) => setPassportCerti(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      여권 인증
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer disabled:opacity-50"
                >
                  {updateMutation.isPending ? '처리 중...' : '수정'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
