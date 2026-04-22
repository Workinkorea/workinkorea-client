import JobsListView from '@/features/jobs/pages/JobsListView';
import { getCompanyPosts } from '@/features/jobs/api/postsApi';
import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('jobs');
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const initialData = await getCompanyPosts(currentPage);

  return (
    <JobsListView
      initialData={initialData}
      currentPage={currentPage}
      initialQ={params.q || ''}
      initialType={params.type || '전체'}
      initialSort={params.sort || 'latest'}
    />
  );
}
