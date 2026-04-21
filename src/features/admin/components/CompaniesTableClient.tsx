'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';
import type { AdminCompany } from '@/shared/types/api';

interface CompaniesTableClientProps {
  initialCompanies: AdminCompany[];
}

export default function CompaniesTableClient({ initialCompanies }: CompaniesTableClientProps) {
  const [companies, setCompanies] = useState<AdminCompany[]>(initialCompanies);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AdminCompany | null>(null);
  const [companyName, setCompanyName] = useState('');
  const limit = 10;

  const fetchCompanies = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const data = await adminApi.getCompanies(skip, limit);
      setCompanies(data);
    } catch (error) {
      toast.error('기업 목록을 불러오는데 실패했습니다.');
    }
  }, [page, limit]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { company_name: string } }) =>
      adminApi.updateCompany(id, data),
    onSuccess: () => {
      toast.success('기업이 수정되었습니다.');
      setShowModal(false);
      fetchCompanies();
    },
    onError: () => {
      toast.error('기업 저장에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (companyId: number) => adminApi.deleteCompany(companyId),
    onSuccess: () => {
      toast.success('기업이 삭제되었습니다.');
      fetchCompanies();
    },
    onError: () => {
      toast.error('기업 삭제에 실패했습니다.');
    },
  });

  function openEditModal(company: AdminCompany) {
    setEditingCompany(company);
    setCompanyName(company.company_name);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCompany) return;

    updateMutation.mutate({
      id: editingCompany.id,
      data: { company_name: companyName },
    });
  }

  async function handleDelete(companyId: number) {
    if (!confirm('정말로 이 기업을 삭제하시겠습니까?')) {
      return;
    }
    deleteMutation.mutate(companyId);
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-body-1 font-medium text-slate-700 mb-1">등록된 기업이 없습니다</p>
        <p className="text-caption-1 text-slate-500">아직 가입한 기업이 없거나 조건에 맞는 기업이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                사업자번호
              </th>
              <th className="px-6 py-3 text-left text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                회사명
              </th>
              <th className="px-6 py-3 text-right text-caption-2 font-medium text-slate-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-body-3 text-slate-900">
                  {company.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-body-3 text-slate-900">
                  {company.company_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-body-3 text-slate-900 font-medium">
                  {company.company_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-body-3 font-medium">
                  <button
                    onClick={() => openEditModal(company)}
                    className="text-blue-600 hover:text-blue-700 mr-4 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
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
          페이지 {page} (현재 {companies.length}개 표시)
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
            disabled={companies.length < limit}
            className="rounded-md bg-white px-4 py-2 text-body-3 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-title-5 font-medium text-slate-900 mb-4">기업 수정</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-body-3 font-medium text-slate-700 mb-1">
                    사업자번호
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingCompany.company_number}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-body-3 bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-body-3 font-medium text-slate-700 mb-1">
                    회사명
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-body-3"
                  />
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
                  style={{ color: '#ffffff' }}
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
