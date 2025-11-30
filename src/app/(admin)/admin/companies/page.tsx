'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi, AdminCompany } from '@/lib/api/admin';
import { toast } from 'sonner';

interface CompanyFormData {
  company_number: string;
  company_name: string;
  email: string;
  name: string;
  phone: string;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AdminCompany | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    company_number: '',
    company_name: '',
    email: '',
    name: '',
    phone: '',
  });

  const limit = 10;

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCompanies(page, limit);
      setCompanies(data.companies);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      toast.error('기업 목록을 불러오는데 실패했습니다.');
      // Mock data for development
      setCompanies([
        {
          id: 1,
          company_number: '123-45-67890',
          company_name: '테크 주식회사',
          email: 'contact@tech.com',
          name: '이대표',
          phone: '02-1234-5678',
          created_at: '2024-01-01',
        },
        {
          id: 2,
          company_number: '234-56-78901',
          company_name: '스타트업 주식회사',
          email: 'info@startup.com',
          name: '박대표',
          phone: '02-2345-6789',
          created_at: '2024-01-15',
        },
      ]);
      setTotal(2);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  function openCreateModal() {
    setEditingCompany(null);
    setFormData({
      company_number: '',
      company_name: '',
      email: '',
      name: '',
      phone: '',
    });
    setShowModal(true);
  }

  function openEditModal(company: AdminCompany) {
    setEditingCompany(company);
    setFormData({
      company_number: company.company_number,
      company_name: company.company_name,
      email: company.email,
      name: company.name,
      phone: company.phone,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingCompany) {
        await adminApi.updateCompany(editingCompany.id, {
          company_name: formData.company_name,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        });
        toast.success('기업이 수정되었습니다.');
      } else {
        await adminApi.createCompany(formData);
        toast.success('기업이 추가되었습니다.');
      }
      setShowModal(false);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to save company:', error);
      toast.error('기업 저장에 실패했습니다.');
    }
  }

  async function handleDelete(companyId: number) {
    if (!confirm('정말로 이 기업을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await adminApi.deleteCompany(companyId);
      toast.success('기업이 삭제되었습니다.');
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
      toast.error('기업 삭제에 실패했습니다.');
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
        <h2 className="text-2xl font-bold text-gray-900">기업 회원 관리</h2>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        >
          기업 추가
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
                사업자번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전화번호
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
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.company_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {company.company_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(company.created_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(company)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
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
          전체 {total}개 중 {(page - 1) * limit + 1}-
          {Math.min(page * limit, total)}개 표시
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
              {editingCompany ? '기업 수정' : '기업 추가'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업자번호
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCompany}
                    value={formData.company_number}
                    onChange={(e) =>
                      setFormData({ ...formData, company_number: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    담당자명
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
                    전화번호
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                  className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                >
                  {editingCompany ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
