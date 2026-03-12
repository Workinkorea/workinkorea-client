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

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Layout from '@/shared/components/layout/Layout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { postsApi } from '@/features/jobs/api/postsApi';
import { CreateCompanyPostRequest, UpdateCompanyPostRequest } from '@/shared/types/api';
import { CompanyPostForm } from '@/features/jobs/components/CompanyPostForm';
import { extractErrorMessage, logError } from '@/shared/lib/utils/errorHandler';

function CompanyPostCreateClient() {
  const router       = useRouter();
  const queryClient  = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType } = useAuth();

  const createPostMutation = useMutation({
    mutationFn: (data: CreateCompanyPostRequest) => postsApi.createCompanyPost(data),
    onSuccess: () => {
      // 대시보드의 공고 목록 캐시를 무효화해 즉시 최신 목록이 표시되도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['myCompanyPosts'] });
      toast.success('공고가 성공적으로 등록되었습니다!');
      // 등록 완료 후 대시보드의 '관리 중인 공고' 탭으로 바로 이동
      router.push('/company?tab=posts');
    },
    onError: (error) => {
      logError(error, 'CompanyPostCreateClient.createPost');
      const message = extractErrorMessage(error, '공고 등록에 실패했습니다. 다시 시도해주세요.');
      toast.error(message);
    },
  });

  const handleSubmit = (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => {
    createPostMutation.mutate(data as CreateCompanyPostRequest);
  };

  // ── 인증 로딩 중 스켈레톤 ──────────────────────────────────────────────────
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white py-8 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
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
      </Layout>
    );
  }

  // 미인증 또는 기업 회원이 아닐 경우 렌더링하지 않음 (middleware가 처리)
  if (!isAuthenticated || userType !== 'company') {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">

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
            {/* 브레드크럼 */}
            <button
              onClick={() => router.push('/company?tab=posts')}
              className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors mb-4 cursor-pointer focus:outline-none"
            >
              <ArrowLeft size={15} />
              대시보드로 돌아가기
            </button>

            {/* 페이지 제목 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-[22px] font-extrabold text-slate-900">채용 공고 등록</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  외국인 인재를 위한 채용 공고를 작성해주세요
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── 폼 영역 ───────────────────────────────────────────────────
              UX 근거: 제출 중(isSubmitting) 폼 전체에 오버레이를 표시해
              중복 제출을 방지하고 진행 중임을 명확히 알립니다.
          ──────────────────────────────────────────────────────────────── */}
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

        </div>
      </div>
    </Layout>
  );
}

export default CompanyPostCreateClient;
