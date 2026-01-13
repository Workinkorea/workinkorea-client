import { fetchAPI } from '@/shared/api/fetchClient';
import { AdminCompany } from '@/shared/types/api';
import CompaniesTableClient from '@/features/admin/components/CompaniesTableClient';

export const dynamic = 'force-dynamic';

async function getCompanies(): Promise<AdminCompany[]> {
  try {
    return await fetchAPI<AdminCompany[]>('/api/admin/companies/?skip=0&limit=10');
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
