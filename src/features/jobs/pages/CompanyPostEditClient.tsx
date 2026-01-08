'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
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

const CompanyPostEditClient: React.FC<CompanyPostEditClientProps> = ({ postId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // 공고 데이터 로드
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['companyPost', postId],
    queryFn: () => postsApi.getCompanyPostById(Number(postId)),
    enabled: !!postId && isAuthenticated,
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

  if (authLoading || postLoading) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="flex justify-center items-center h-screen">
          <div className="text-label-500">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || userType !== 'company' || !post) {
    return null;
  }

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
    start_date: post.start_date,
    end_date: post.end_date,
  };

  return (
    <Layout>
      <Header
        type="business"
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-bg-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-label-600 hover:text-primary-600 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>뒤로 가기</span>
            </button>
            <h1 className="text-heading-1 font-bold text-label-900">채용 공고 수정</h1>
            <p className="text-body-2 text-label-600 mt-2">
              채용 공고 정보를 수정해주세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CompanyPostForm
              mode="edit"
              initialData={initialData}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              isSubmitting={updatePostMutation.isPending}
            />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyPostEditClient;
