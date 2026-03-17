'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdateCompanyPostRequest } from '@/shared/types/api';
import { CompanyPostForm } from '@/features/jobs/components/CompanyPostForm';
import { toast } from 'sonner';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';

interface CompanyPostEditClientProps {
  postId: string;
}

function CompanyPostEditClient({ postId }: CompanyPostEditClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();

  // 인증 완료 후 권한 체크 — 비인증 또는 기업 회원이 아닌 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || userType !== 'company')) {
      router.replace('/company-login');
    }
  }, [authLoading, isAuthenticated, userType, router]);

  // 공고 데이터 로드
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['companyPost', postId],
    queryFn: () => postsApi.getCompanyPostById(Number(postId)),
    enabled: !!postId && isAuthenticated && userType === 'company',
    retry: false,
  });

  // 수정 mutation
  const updatePostMutation = useMutation({
    mutationFn: (data: UpdateCompanyPostRequest) => postsApi.updateCompanyPost(Number(postId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      queryClient.invalidateQueries({ queryKey: ['companyPost', postId] });
      toast.success('공고가 수정되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      logError(error, 'CompanyPostEditClient.updatePost');
      const errorMessage = extractErrorMessage(error, '공고 수정에 실패했습니다. 다시 시도해주세요.');
      toast.error(errorMessage);
    },
  });

  // 삭제 mutation
  const deletePostMutation = useMutation({
    mutationFn: () => postsApi.deleteCompanyPost(Number(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      toast.success('공고가 삭제되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      logError(error, 'CompanyPostEditClient.deletePost');
      const errorMessage = extractErrorMessage(error, '공고 삭제에 실패했습니다. 다시 시도해주세요.');
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (data: UpdateCompanyPostRequest) => {
    updatePostMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 공고를 삭제하시겠습니까?')) {
      deletePostMutation.mutate();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (authLoading || postLoading) {
    return (
      <Layout>
        <main className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-6 w-40 rounded" />
                <div className="skeleton-shimmer h-8 w-64 rounded" />
                {[180, 140, 220, 120].map((h, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="skeleton-shimmer h-5 w-32 rounded mb-5" />
                    <div className="space-y-3">
                      <div className="skeleton-shimmer h-10 w-full rounded-lg" />
                      {h > 150 && <div className="skeleton-shimmer h-10 w-full rounded-lg" />}
                      {h > 200 && <div className="skeleton-shimmer h-24 w-full rounded-lg" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (!isAuthenticated || userType !== 'company') {
    return null; // useEffect가 redirect 처리
  }

  if (!post) {
    return (
      <Layout>
        <main className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 text-[15px]">공고를 찾을 수 없습니다.</p>
            <button
              onClick={() => router.push('/company')}
              className="mt-4 text-blue-600 hover:text-blue-700 text-body-3 font-medium cursor-pointer"
            >
              기업 대시보드로 돌아가기
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  // ISO datetime → YYYY-MM-DD 변환 유틸
  const toDateOnly = (iso: string) => iso.split('T')[0];

  // 초기 데이터 변환
  const initialData = {
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
    start_date: toDateOnly(post.start_date),
    end_date: toDateOnly(post.end_date),
  };

  return (
    <Layout>
      <main className="min-h-screen bg-background-alternative py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── 페이지 헤더 ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-[22px] font-extrabold text-slate-900">채용 공고 수정</h1>
                <p className="text-caption-1 text-slate-500 mt-0.5">
                  채용 공고 정보를 수정해주세요
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── 2-column layout ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">

            {/* ── 좌측: 폼 ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="relative"
            >
              <CompanyPostForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                isSubmitting={updatePostMutation.isPending}
              />
            </motion.div>

            {/* ── 우측: 사이드바 (sticky) ── */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-6">

              {/* 수정 버튼 */}
              <Button
                type="submit"
                size="lg"
                form="company-post-form"
                isLoading={updatePostMutation.isPending}
                className="w-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
              >
                공고 수정하기
              </Button>

              {/* 취소 버튼 */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCancel}
              >
                취소
              </Button>

              {/* 삭제 버튼 */}
              <Button
                type="button"
                size="lg"
                className="w-full border border-red-200 text-red-500 hover:bg-red-50 bg-white"
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
              >
                공고 삭제
              </Button>

            </aside>

          </div>

        </div>
      </main>
    </Layout>
  );
}

export default CompanyPostEditClient;
