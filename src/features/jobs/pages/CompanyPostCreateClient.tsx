'use client';

/**
 * [UX 개선 요약]
 * 1. 브레드크럼 네비게이션: "대시보드 / 채용 공고 등록"으로 현재 위치 맥락 제공
 * 2. isSubmitting 로딩 오버레이: 폼 제출 중 전체 폼을 dim 처리해
 *    중복 제출 방지 + 진행 상태를 시각적으로 명시
 * 3. 성공 시 toast.success → /company?tab=posts 로 리다이렉트
 *    → 등록 직후 공고 목록 탭으로 자동 이동해 결과 확인 용이
 * 4. 페이지 진입 애니메이션: stagger로 헤더·폼이 순차적으로 등장해 부드러운 경험 제공
 * 5. 무한 skeleton 방지: 12초 타임아웃 후 재시도 UI 표시
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FileText, Lightbulb } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { postsApi } from '@/features/jobs/api/postsApi';
import { CreateCompanyPostRequest, UpdateCompanyPostRequest } from '@/shared/types/api';
import { CompanyPostForm } from '@/features/jobs/components/CompanyPostForm';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';
import { useUnsavedChangesWarning } from '@/shared/lib/form';

function CompanyPostCreateClient() {
  const router       = useRouter();
  const queryClient  = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();
  const t = useTranslations('jobs.postCreate');
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: (data: CreateCompanyPostRequest) => postsApi.createCompanyPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompanyPosts'] });
      toast.success(t('successToast'));
      router.push('/company?tab=posts');
    },
    onError: (error) => {
      logError(error, 'CompanyPostCreateClient.createPost');
      const message = extractErrorMessage(error, t('errorToast'));
      toast.error(message);
    },
  });

  useUnsavedChangesWarning({
    isDirty,
    isSubmitSuccessful: createPostMutation.isSuccess,
  });

  const handleSubmit = (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => {
    createPostMutation.mutate(data as CreateCompanyPostRequest);
  };

  // 미인증 또는 기업 회원 아닌 경우 리다이렉트 (auth 로딩 완료 후)
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || userType !== 'company')) {
      router.replace('/company-login');
    }
  }, [isAuthenticated, authLoading, userType, router]);

  // 12초 타임아웃: authLoading이 계속되면 재시도 UI 표시
  useEffect(() => {
    if (!authLoading) return;
    const timer = setTimeout(() => setLoadTimeout(true), 12000);
    return () => clearTimeout(timer);
  }, [authLoading]);

  const handleCancel = () => {
    router.push('/company?tab=posts');
  };

  const handleRetry = () => {
    setLoadTimeout(false);
    window.location.reload();
  };

  // ── 인증 로딩 중 (타임아웃 후 재시도 UI) ──────────────────────────────────
  if (authLoading) {
    if (loadTimeout) {
      return (
        <Layout>
          <main className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <FileText size={48} className="text-slate-300 mx-auto" />
              </div>
              <h2 className="text-title-2 text-slate-900 mb-2">페이지를 불러오지 못했어요</h2>
              <p className="text-body-2 text-slate-600 mb-8">
                네트워크 연결을 확인하고 다시 시도해주세요.
              </p>
              <Button
                size="lg"
                onClick={handleRetry}
                className="w-full shadow-[0_4px_14px_rgba(66,90,213,0.25)] hover:shadow-[0_6px_20px_rgba(66,90,213,0.35)]"
              >
                다시 시도
              </Button>
            </div>
          </main>
        </Layout>
      );
    }

    return (
      <Layout>
        <main className="min-h-screen bg-slate-50 py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-6 w-40 rounded" />
                <div className="skeleton-shimmer h-8 w-64 rounded" />
                {/* 폼 섹션 스켈레톤 4개 */}
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

  // 미인증 또는 기업 회원이 아닐 경우 — useEffect에서 리다이렉트 처리 중, 스켈레톤 유지
  if (!isAuthenticated || userType !== 'company') {
    return (
      <Layout>
        <main className="min-h-screen bg-slate-50 py-8">
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

  return (
    <Layout>
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── 페이지 헤더 ────────────────────────────────────────────────
              UX 근거: 브레드크럼 + 제목으로 현재 위치와 컨텍스트를 명시합니다.
              '뒤로 가기' 버튼은 사용자가 진입 경로로 안전하게 돌아갈 수 있게 합니다.
          ──────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {/* 페이지 제목 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-title-3 font-extrabold text-slate-900">채용 공고 등록</h1>
                <p className="text-caption-1 text-slate-600 mt-0.5">
                  외국인 인재를 위한 채용 공고를 작성해주세요
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
                mode="create"
                onSubmit={handleSubmit}
                isSubmitting={createPostMutation.isPending}
                onDirtyChange={setIsDirty}
              />
            </motion.div>

            {/* ── 우측: 사이드바 (sticky) ── */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-6">

              {/* 작성 팁 카드 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Lightbulb size={16} className="text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-caption-1 font-bold text-slate-900 mb-2">작성 팁</h3>
                    <ul className="space-y-1.5 text-caption-2 text-slate-700">
                      <li className="flex gap-2">
                        <span className="text-blue-600 shrink-0">•</span>
                        <span>명확하고 구체적인 직무 제목을 사용하세요</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 shrink-0">•</span>
                        <span>필수 자격사항과 우대사항을 명확히 구분하세요</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 shrink-0">•</span>
                        <span>정확한 급여 정보를 제공하면 지원율이 높아집니다</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </aside>

          </div>

        </div>
      </main>
    </Layout>
  );
}

export default CompanyPostCreateClient;
