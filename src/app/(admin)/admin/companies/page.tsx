import { createServerAdminApi } from '@/lib/api/server';
import CompaniesTableClient from '@/components/admin/CompaniesTableClient';

async function getCompanies() {
  try {
    const adminApi = await createServerAdminApi();
    return await adminApi.getCompanies(0, 10);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return [];
  }
}

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">기업 회원 관리</h2>
      </div>
      <CompaniesTableClient initialCompanies={companies} />
    </div>
  );
}
