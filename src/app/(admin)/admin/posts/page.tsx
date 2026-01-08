import { createServerAdminApi } from '@/shared/api/server';
import PostsTableClient from '@/features/admin/components/PostsTableClient';

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    const adminApi = await createServerAdminApi();
    return await adminApi.getPosts(0, 10);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">공고 관리</h2>
        <div className="text-sm text-gray-500">
          공고는 기업 회원이 생성합니다. 관리자는 조회, 수정, 삭제만 가능합니다.
        </div>
      </div>
      <PostsTableClient initialPosts={posts} />
    </div>
  );
}
