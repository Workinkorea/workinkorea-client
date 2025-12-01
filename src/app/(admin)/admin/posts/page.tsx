'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin';
import { CompanyPost } from '@/lib/api/types';
import { toast } from 'sonner';

interface PostFormData {
  title: string;
  content: string;
  work_experience: string;
  position_id: number;
  education: string;
  language: string;
  employment_type: string;
  work_location: string;
  working_hours: number;
  salary: number;
  start_date: string;
  end_date: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<CompanyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<CompanyPost | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    work_experience: '',
    position_id: 1,
    education: '',
    language: '',
    employment_type: '',
    work_location: '',
    working_hours: 40,
    salary: 0,
    start_date: '',
    end_date: '',
  });

  const limit = 10;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPosts(page, limit);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('공고 목록을 불러오는데 실패했습니다.');
      // Mock data for development
      setPosts([
        {
          id: 1,
          company_id: 1,
          title: '프론트엔드 개발자 모집',
          content: 'React, TypeScript 경력자 우대',
          work_experience: '3년 이상',
          position_id: 1,
          education: '대졸 이상',
          language: '한국어, 영어',
          employment_type: '정규직',
          work_location: '서울 강남구',
          working_hours: 40,
          salary: 50000000,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
        {
          id: 2,
          company_id: 2,
          title: '백엔드 개발자 채용',
          content: 'Node.js, Python 경력자 모집',
          work_experience: '2년 이상',
          position_id: 2,
          education: '대졸 이상',
          language: '한국어',
          employment_type: '정규직',
          work_location: '서울 판교',
          working_hours: 40,
          salary: 45000000,
          start_date: '2024-02-01',
          end_date: '2024-12-31',
        },
      ]);
      setTotal(2);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  function openEditModal(post: CompanyPost) {
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
      start_date: post.start_date,
      end_date: post.end_date,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingPost) return;

    try {
      await adminApi.updatePost(editingPost.id, formData);
      toast.success('공고가 수정되었습니다.');
      setShowModal(false);
      fetchPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('공고 수정에 실패했습니다.');
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm('정말로 이 공고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await adminApi.deletePost(postId);
      toast.success('공고가 삭제되었습니다.');
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('공고 삭제에 실패했습니다.');
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
        <h2 className="text-2xl font-bold text-gray-900">공고 관리</h2>
        <div className="text-sm text-gray-500">
          공고는 기업 회원이 생성합니다. 관리자는 조회, 수정, 삭제만 가능합니다.
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                근무지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고용형태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                급여
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기간
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.company_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.work_location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.employment_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.salary.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.start_date} ~ {post.end_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-purple-600 hover:text-purple-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
      {showModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              공고 수정
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      경력
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.work_experience}
                      onChange={(e) =>
                        setFormData({ ...formData, work_experience: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, education: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      고용형태
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employment_type}
                      onChange={(e) =>
                        setFormData({ ...formData, employment_type: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
                      onChange={(e) =>
                        setFormData({ ...formData, work_location: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주당 근무시간
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.working_hours}
                      onChange={(e) =>
                        setFormData({ ...formData, working_hours: parseInt(e.target.value) })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      연봉 (원)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: parseInt(e.target.value) })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    언어
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
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
                  className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                >
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
