'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { toast } from 'sonner';
import type { AdminPost } from '@/shared/types/api';

interface PostsTableClientProps {
  initialPosts: AdminPost[];
}

export default function PostsTableClient({ initialPosts }: PostsTableClientProps) {
  const [posts, setPosts] = useState<AdminPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    work_experience: '',
    position_id: 0,
    education: '',
    language: '',
    employment_type: '',
    work_location: '',
    working_hours: 0,
    salary: 0,
    start_date: '',
    end_date: '',
  });
  const limit = 10;

  const fetchPosts = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const data = await adminApi.getPosts(skip, limit);
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('공고 목록을 불러오는데 실패했습니다.');
    }
  }, [page, limit]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof formData }) =>
      adminApi.updatePost(id, data),
    onSuccess: () => {
      toast.success('공고가 수정되었습니다.');
      setShowModal(false);
      fetchPosts();
    },
    onError: (error) => {
      console.error('Failed to save post:', error);
      toast.error('공고 저장에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => adminApi.deletePost(postId),
    onSuccess: () => {
      toast.success('공고가 삭제되었습니다.');
      fetchPosts();
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
      toast.error('공고 삭제에 실패했습니다.');
    },
  });

  function openEditModal(post: AdminPost) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      work_experience: post.work_experience,
      position_id: post.position_id,
      education: post.education,
      language: post.language,
      employment_type: post.employment_type,
      work_location: post.work_location,
      working_hours: post.working_hours,
      salary: post.salary,
      start_date: post.start_date.split('T')[0], // Convert to YYYY-MM-DD
      end_date: post.end_date.split('T')[0], // Convert to YYYY-MM-DD
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPost) return;

    updateMutation.mutate({
      id: editingPost.id,
      data: formData,
    });
  }

  async function handleDelete(postId: number) {
    if (!confirm('정말로 이 공고를 삭제하시겠습니까?')) {
      return;
    }
    deleteMutation.mutate(postId);
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
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                근무지
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.company_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.work_location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-purple-600 hover:text-purple-900 mr-4 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
          페이지 {page} (현재 {posts.length}개 표시)
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
            disabled={posts.length < limit}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">공고 수정</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공고 제목
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공고 내용
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      경력
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.work_experience}
                      onChange={(e) => setFormData({ ...formData, work_experience: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="예: 신입, 경력 3년 이상"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      포지션 ID
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.position_id}
                      onChange={(e) => setFormData({ ...formData, position_id: parseInt(e.target.value) })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      학력
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="예: 대졸, 고졸"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      언어
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="예: 한국어, 영어"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      고용 형태
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employment_type}
                      onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="예: 정규직, 계약직"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      근무지
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.work_location}
                      onChange={(e) => setFormData({ ...formData, work_location: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="예: 서울 강남구"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      근무 시간 (시간/주)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.working_hours}
                      onChange={(e) => setFormData({ ...formData, working_hours: parseInt(e.target.value) })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      급여 (원)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      종료일
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
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
                  className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 cursor-pointer disabled:opacity-50"
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
