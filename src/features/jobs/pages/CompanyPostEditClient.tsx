'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cookieManager } from '@/shared/lib/utils/cookieManager';
import { postsApi } from '@/features/jobs/api/postsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdateCompanyPostRequest } from '@/shared/types/api';
import { CompanyPostForm } from '@/features/jobs/components/CompanyPostForm';
import { toast } from 'sonner';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';
import { useUnsavedChangesWarning } from '@/shared/lib/form';

interface CompanyPostEditClientProps {
  postId: string;
}

function CompanyPostEditClient({ postId }: CompanyPostEditClientProps) {
  const t = useTranslations('jobs.postEdit');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();
  const [isDirty, setIsDirty] = useState(false);

  // 인증 완료 후 권한 체크 — 비인증 또는 기업 회원이 아닌 경우 로그인 페이지로 리다이렉트.
  // ISSUE-117: authStore 초기화가 실패(refresh 401 등)해도 userType 쿠키가 'company' 면
  // 미들웨어는 통과시켜 주는데 client 측에서 /company 로 리턴해버리던 문제 수정.
  // 쿠키 fallback 으로 실제 userType 을 확인하여 불필요한 redirect 를 방지.
  useEffect(() => {
    if (authLoading) return;
    const effectiveUserType = userType ?? cookieManager.getUserType();
    if (!effectiveUserType) {
      router.replace('/company-login');
      return;
    }
    if (effectiveUserType !== 'company') {
      router.replace('/company-login');
    }
  }, [authLoading, isAuthenticated, userType, router]);

  // 공고 데이터 로드 — userType 쿠키 fallback 허용
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['companyPost', postId],
    queryFn: () => postsApi.getCompanyPostById(Number(postId)),
    enabled: !!postId && !authLoading && (userType === 'company' || cookieManager.getUserType() === 'company'),
    retry: false,
  });

  // 수정 mutation
  const updatePostMutation = useMutation({
    mutationFn: (data: UpdateCompanyPostRequest) => postsApi.updateCompanyPost(Number(postId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      queryClient.invalidateQueries({ queryKey: ['companyPost', postId] });
      toast.success(t('updateSuccess'));
      router.push('/company');
    },
    onError: (error) => {
      logError(error, 'CompanyPostEditClient.updatePost');
      const errorMessage = extractErrorMessage(error, t('updateError'));
      toast.error(errorMessage);
    },
  });

  // 삭제 mutation
  const deletePostMutation = useMutation({
    mutationFn: () => postsApi.deleteCompanyPost(Number(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      toast.success(t('deleteSuccess'));
      router.push('/company');
    },
    onError: (error) => {
      logError(error, 'CompanyPostEditClient.deletePost');
      const rawMessage = extractErrorMessage(error, '');
      const isServerInternalError = rawMessage.includes('is not mapped') || rawMessage.includes('Internal');
      toast.error(isServerInternalError ? t('deleteError') : rawMessage || t('deleteError'));
    },
  });

  useUnsavedChangesWarning({
    isDirty,
    isSubmitSuccessful: updatePostMutation.isSuccess,
  });

  const handleSubmit = (data: UpdateCompanyPostRequest) => {
    updatePostMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm(t('deleteConfirm'))) {
      deletePostMutation.mutate();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (authLoading || postLoading) {
    return (
      <Layout>
        <main className="min-h-screen bg-slate-100 py-8 flex items-center justify-center">
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
        <main className="min-h-screen bg-slate-100 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 text-body-2">{t('notFound')}</p>
            <button
              onClick={() => router.push('/company')}
              className="mt-4 text-blue-600 hover:text-blue-700 text-body-3 font-medium cursor-pointer"
            >
              {t('backToDashboard')}
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
      <main className="min-h-screen bg-slate-100 py-8">
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
                <h1 className="text-title-3 font-extrabold text-slate-900">{t('title')}</h1>
                <p className="text-caption-1 text-slate-500 mt-0.5">
                  {t('subtitle')}
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
                onDirtyChange={setIsDirty}
              />
            </motion.div>

            {/* ── 우측: 사이드바 (sticky) ── */}
            {/* 사이드바는 폼 내부 버튼으로 통합 (중복 submit 방지) */}

          </div>

        </div>
      </main>
    </Layout>
  );
}

export default CompanyPostEditClient;
