'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { postsApi } from '@/lib/api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCompanyPostRequest, UpdateCompanyPostRequest } from '@/lib/api/types';
import { CompanyPostForm } from '@/components/company-posts/CompanyPostForm';

const CompanyPostCreateClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });

  const handleLogout = async () => {
    await logout();
  };

  const createPostMutation = useMutation({
    mutationFn: (data: CreateCompanyPostRequest) => postsApi.createCompanyPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      alert('공고가 등록되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      console.error('공고 등록 실패:', error);
      alert('공고 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleSubmit = (data: CreateCompanyPostRequest | UpdateCompanyPostRequest) => {
    createPostMutation.mutate(data as CreateCompanyPostRequest);
  };

  if (authLoading) {
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

  if (!isAuthenticated || userType !== 'company') {
    return null;
  }

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
            <h1 className="text-heading-1 font-bold text-label-900">채용 공고 등록</h1>
            <p className="text-body-2 text-label-600 mt-2">
              외국인 인재를 위한 채용 공고를 작성해주세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
};

export default CompanyPostCreateClient;
