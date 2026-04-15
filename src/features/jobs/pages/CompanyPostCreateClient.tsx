'use client';

/**
 * [UX 개선 요약]
 * 1. 브레드크럼 네비게이션: "대시보드 / 채용 공고 등록"으로 현재 위치 맥락 제공
 * 2. isSubmitting 로딩 오버레이: 폼 제출 중 전체 폼을 dim 처리해
 *    중복 제출 방지 + 진행 상태를 시각적으로 명시
 * 3. 성공 시 toast.success → /company?tab=posts 로 리다이렉트
 *    → 등록 직후 공고 목록 탭으로 자동 이동해 결과 확인 용이
 * 4. 페이지 진입 애니메이션: stagger로 헤더·폼이 순차적으로 등장해 부드러운 경험 제공
 */

import { useEffect } from 'react';
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

function CompanyPostCreateClient() {
  const router       = useRouter();
  const queryClient  = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();
  const t = useTranslations('jobs.postCreate');

  const createPostMutation = useMutation({
    mutationFn: (data: CreateCompanyPostRequest) => postsApi.createCompanyPost(data),
    onSuccess: () => {
      // 대시보드의 공고 목록 캐시를 무효화해 즉시 최신 목록이 표시되도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['myCompanyPosts'] });
      toast.success(t('successToast'));
      // 등록 완료 후 대시보드의 '관리 중인 공고' 탭으로 바로 이동
      router.push('/company?tab=posts');
    },
    onError: (error) => {
      logError(error, 'CompanyPostCreateClient.createPost');
      const message = extractErrorMessage(error, t('errorToast'));
      toast.error(message);
    },
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

  const handleCancel = () => {
    router.push('/company?tab=posts');
  };

  // ── 인증 로딩 중 스켈레톤 ──────────────────────────────────────────────────
  if (authLoading) {
    return (
      <Layout>
        <main className="min-h-screen bg-label-100 py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-6 w-40 rounded" />
                <div className="skeleton-shimmer h-8 w-64 rounded" />
                {/* 폼 섹션 스켈레톤 4개 */}
                {[180, 140, 220, 120].map((h, i) => (
                  <div key={i} className="bg-white rounded-xl border border-line-400 p-6">
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
        <main className="min-h-screen bg-label-100 py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-6 w-40 rounded" />
                <div className="skeleton-shimmer h-8 w-64 rounded" />
                {[180, 140, 220, 120].map((h, i) => (
                  <div key={i} className="bg-white rounded-xl border border-line-400 p-6">
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
      <main className="min-h-screen bg-label-100 py-8">
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
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={20} className="text-primary-600" />
              </div>
              <div>
                <h1 className="text-title-3 font-extrabold text-label-900">채용 공고 등록</h1>
                <p className="text-caption-1 text-label-500 mt-0.5">
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
              />
            </motion.div>

            {/* ── 우측: 사이드바 (sticky) ── */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-6">

              {/* 등록 버튼 */}
              <Button
                type="submit"
                size="lg"
                form="company-post-form"
                isLoading={createPostMutation.isPending}
                className="w-full shadow-[0_4px_14px_rgba(66,90,213,0.25)] hover:shadow-[0_6px_20px_rgba(66,90,213,0.35)]"
              >
                공고 등록하기
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

              {/* 작성 팁 카드 */}
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <div className="flex items-start gap-3">
                  <Lightbulb size={16} className="text-primary-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-caption-1 font-bold text-label-900 mb-2">작성 팁</h3>
                    <ul className="space-y-1.5 text-caption-2 text-label-600">
                      <li className="flex gap-2">
                        <span className="text-primary-600 shrink-0">•</span>
                        <span>명확하고 구체적인 직무 제목을 사용하세요</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600 shrink-0">•</span>
                        <span>필수 자격사항과 우대사항을 명확히 구분하세요</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600 shrink-0">•</span>
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
