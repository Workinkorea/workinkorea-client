'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
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

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
          <Users className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-body-1 font-medium text-slate-700 mb-1">등록된 회원이 없습니다</p>
        <p className="text-caption-1 text-slate-500">아직 가입한 회원이 없거나 조건에 맞는 회원이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 목록 (lg 미만) */}
      <div className="lg:hidden divide-y divide-slate-200">
        {users.map((user) => (
          <div key={user.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-caption-2 text-slate-400">#{user.id}</p>
              <p className="text-body-3 font-medium text-slate-900 truncate">{user.email}</p>
              <span
                className={`inline-flex mt-1 px-2 py-0.5 text-caption-2 font-semibold rounded-full ${
                  user.passport_certi ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {user.passport_certi ? '인증됨' : '미인증'}
              </span>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => openEditModal(user)}
                className="text-blue-600 hover:text-blue-900 text-caption-1 font-medium cursor-pointer"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-900 text-caption-1 font-medium cursor-pointer"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크탑 테이블 (lg 이상) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                여권 인증
              </th>
              <th className="px-6 py-3 text-right text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-body-3 text-slate-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-body-3 text-slate-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-body-3">
                  <span
                    className={`inline-flex px-2 py-1 text-caption-2 font-semibold rounded-full ${
                      user.passport_certi
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.passport_certi ? '인증됨' : '미인증'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-body-3 font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-900 cursor-pointer"
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
        <div className="text-body-3 text-slate-700">
          페이지 {page} (현재 {users.length}개 표시)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md bg-white px-4 py-2 text-body-3 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            이전
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < limit}
            className="rounded-md bg-white px-4 py-2 text-body-3 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-title-5 font-medium text-slate-900 mb-4">회원 수정</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-body-3 font-medium text-slate-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    disabled
                    value={editingUser.email}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-body-3 bg-slate-100"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={passportCerti}
                      onChange={(e) => setPassportCerti(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                    />
                    <span className="text-body-3 font-medium text-slate-700">
                      여권 인증
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-md bg-white px-4 py-2 text-body-3 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-body-3 font-medium text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50"
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
