'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Briefcase, MapPin, Calendar, DollarSign, Clock, GraduationCap, Languages, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { postsApi } from '@/lib/api/posts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdateCompanyPostRequest } from '@/lib/api/types';
import { getMockPostById, updateMockPost, deleteMockPost } from '@/lib/mock/companyPosts';

interface CompanyPostEditClientProps {
  postId: string;
}

const CompanyPostEditClient: React.FC<CompanyPostEditClientProps> = ({ postId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, userType, logout } = useAuth({ required: true });

  const [formData, setFormData] = useState<UpdateCompanyPostRequest>({
    title: '',
    content: '',
    work_experience: '',
    position_id: 1,
    education: '',
    language: '',
    employment_type: '',
    work_location: '',
    working_hours: 0,
    salary: 0,
    start_date: '',
    end_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 기존 공고 데이터 조회 (API 실패 시 mock 데이터 사용)
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['companyPost', postId],
    queryFn: async () => {
      try {
        return await postsApi.getCompanyPostById(Number(postId));
      } catch (err) {
        console.error('공고 조회 실패, mock 데이터 사용:', err);
        // API 호출 실패 시 mock 데이터 반환
        const mockPost = getMockPostById(Number(postId));
        if (mockPost) {
          return mockPost;
        }
        throw err;
      }
    },
    enabled: !!postId,
  });

  // 공고 데이터가 로드되면 폼에 설정
  useEffect(() => {
    if (post) {
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
    }
  }, [post]);

  const updatePostMutation = useMutation({
    mutationFn: async (data: UpdateCompanyPostRequest) => {
      try {
        return await postsApi.updateCompanyPost(Number(postId), data);
      } catch (err) {
        console.error('공고 수정 API 실패, mock 데이터 업데이트:', err);
        // API 호출 실패 시 mock 데이터 업데이트
        const updated = updateMockPost(Number(postId), data);
        if (updated) {
          return updated;
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      queryClient.invalidateQueries({ queryKey: ['companyPost', postId] });
      alert('공고가 수정되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      console.error('공고 수정 실패:', error);
      alert('공고 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      try {
        return await postsApi.deleteCompanyPost(Number(postId));
      } catch (err) {
        console.error('공고 삭제 API 실패, mock 데이터 삭제:', err);
        // API 호출 실패 시 mock 데이터 삭제
        const deleted = deleteMockPost(Number(postId));
        if (deleted) {
          return { message: 'Mock 데이터 삭제 성공' };
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPosts'] });
      alert('공고가 삭제되었습니다.');
      router.push('/company');
    },
    onError: (error) => {
      console.error('공고 삭제 실패:', error);
      alert('공고 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'working_hours' || name === 'salary' || name === 'position_id'
        ? Number(value)
        : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = '공고 제목을 입력해주세요.';
    }
    if (!formData.content?.trim()) {
      newErrors.content = '공고 내용을 입력해주세요.';
    }
    if (!formData.work_location?.trim()) {
      newErrors.work_location = '근무지를 입력해주세요.';
    }
    if ((formData.working_hours ?? 0) <= 0) {
      newErrors.working_hours = '주당 근무시간을 입력해주세요.';
    }
    if ((formData.salary ?? 0) < 0) {
      newErrors.salary = '급여를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updatePostMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 공고를 삭제하시겠습니까?')) {
      deletePostMutation.mutate();
    }
  };

  if (postLoading || authLoading) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (postError || !post) {
    return (
      <Layout>
        <Header
          type={userType === 'company' ? 'business' : 'homepage'}
          isAuthenticated={isAuthenticated}
          isLoading={authLoading}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-background-alternative py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-title-3 font-semibold text-label-700 mb-2">
              공고를 불러올 수 없습니다
            </h2>
            <p className="text-body-3 text-label-500 mb-4">
              잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-3 hover:bg-primary-600 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-label-600 hover:text-label-900 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-body-3">돌아가기</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-title-2 font-bold text-label-900">채용 공고 수정</h1>
                <p className="text-body-3 text-label-500 mt-1">
                  채용 공고를 수정하세요
                </p>
              </div>
              <button
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 border border-status-error text-status-error rounded-lg text-body-3 font-medium hover:bg-status-error hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                공고 삭제
              </button>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                기본 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-body-3 font-medium text-label-700 mb-2">
                    공고 제목 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.title ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="예: 프론트엔드 개발자 (React) 모집"
                  />
                  {errors.title && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="position_id" className="block text-body-3 font-medium text-label-700 mb-2">
                    포지션 *
                  </label>
                  <select
                    id="position_id"
                    name="position_id"
                    value={formData.position_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="1">프론트엔드 개발자</option>
                    <option value="2">백엔드 개발자</option>
                    <option value="3">풀스택 개발자</option>
                    <option value="4">데이터 엔지니어</option>
                    <option value="5">DevOps 엔지니어</option>
                    <option value="6">QA 엔지니어</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-body-3 font-medium text-label-700 mb-2">
                    상세 설명 *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full px-4 py-2 border ${errors.content ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="채용 공고 상세 내용을 입력하세요..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.content}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 자격 요건 */}
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} />
                자격 요건
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="work_experience" className="block text-body-3 font-medium text-label-700 mb-2">
                    경력 요건
                  </label>
                  <select
                    id="work_experience"
                    name="work_experience"
                    value={formData.work_experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="경력무관">경력무관</option>
                    <option value="신입">신입</option>
                    <option value="1년 이상">1년 이상</option>
                    <option value="3년 이상">3년 이상</option>
                    <option value="5년 이상">5년 이상</option>
                    <option value="10년 이상">10년 이상</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="education" className="block text-body-3 font-medium text-label-700 mb-2">
                    학력 요건
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="학력무관">학력무관</option>
                    <option value="고졸 이상">고졸 이상</option>
                    <option value="전문대졸 이상">전문대졸 이상</option>
                    <option value="대졸 이상">대졸 이상</option>
                    <option value="석사 이상">석사 이상</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <Languages size={16} />
                    언어 요건
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="한국어 능통">한국어 능통</option>
                    <option value="영어 가능">영어 가능</option>
                    <option value="한국어, 영어 모두 가능">한국어, 영어 모두 가능</option>
                    <option value="무관">무관</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 근무 조건 */}
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                근무 조건
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="employment_type" className="block text-body-3 font-medium text-label-700 mb-2">
                    고용 형태
                  </label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="정규직">정규직</option>
                    <option value="계약직">계약직</option>
                    <option value="인턴">인턴</option>
                    <option value="프리랜서">프리랜서</option>
                    <option value="파트타임">파트타임</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="work_location" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    근무지 *
                  </label>
                  <input
                    type="text"
                    id="work_location"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.work_location ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="예: 서울특별시 강남구 테헤란로 123"
                  />
                  {errors.work_location && (
                    <p className="mt-1 text-caption-2 text-status-error">{errors.work_location}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="working_hours" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      주당 근무시간 *
                    </label>
                    <input
                      type="number"
                      id="working_hours"
                      name="working_hours"
                      value={formData.working_hours}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border ${errors.working_hours ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.working_hours && (
                      <p className="mt-1 text-caption-2 text-status-error">{errors.working_hours}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="salary" className="block text-body-3 font-medium text-label-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      연봉 (만원) *
                    </label>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className={`w-full px-4 py-2 border ${errors.salary ? 'border-status-error' : 'border-line-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="예: 4000"
                    />
                    {errors.salary && (
                      <p className="mt-1 text-caption-2 text-status-error">{errors.salary}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 모집 기간 */}
            <div className="bg-white rounded-lg p-6 shadow-normal">
              <h2 className="text-title-4 font-semibold text-label-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                모집 기간
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-body-3 font-medium text-label-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-body-3 font-medium text-label-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-line-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-line-400 rounded-lg text-body-3 font-medium text-label-700 hover:bg-component-alternative transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updatePostMutation.isPending}
                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg text-body-3 font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatePostMutation.isPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    수정 완료
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyPostEditClient;
