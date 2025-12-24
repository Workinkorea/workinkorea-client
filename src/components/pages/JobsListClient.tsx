'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { CompanyPost } from '@/lib/api/types';
import { postsApi } from '@/lib/api/posts';
import { useAuth } from '@/hooks/useAuth';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export default function JobsListClient() {
  const [posts, setPosts] = useState<CompanyPost[]>([]);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = DEFAULT_LIMIT;
  const totalPages = Math.ceil(total / limit);
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log('[Client] Fetching initial data');
      setLoading(true);
      try {
        const response = await postsApi.getPublicCompanyPosts({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT });
        console.log('[Client] Initial data loaded:', {
          postsCount: response.company_posts?.length || 0,
          total: response.total
        });
        setPosts(response.company_posts);
        setTotal(response.total);
        setCurrentPage(DEFAULT_PAGE);
      } catch (error) {
        console.error('[Client] Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;

    console.log('[Client] Changing page to:', newPage);
    setLoading(true);
    try {
      const response = await postsApi.getPublicCompanyPosts({ page: newPage, limit });
      console.log('[Client] Received response:', {
        postsCount: response.company_posts?.length || 0,
        total: response.total
      });
      setPosts(response.company_posts);
      setTotal(response.total);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('[Client] Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header
        type="homepage"
        isAuthenticated={isAuthenticated}
        isLoading={authLoading}
        onLogout={logout}
      />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-title-1 font-bold text-label-900 mb-2">
              채용 공고
            </h1>
            <p className="text-body-2 text-label-600">
              한국에서 외국인을 위한 다양한 채용 기회를 찾아보세요
            </p>
            <p className="text-body-3 text-label-500 mt-2">
              총 {total}개의 공고
            </p>
          </div>

          {/* 공고 목록 */}
          {posts && posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                const isRecent = new Date(post.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const language = post.language ? post.language.split(',').map(l => l.trim()) : [];

                return (
                  <Link
                    key={post.id}
                    href={`/jobs/${post.id}`}
                    className="bg-white border border-line-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    {/* 회사명과 시간 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {post.company_id}
                        </div>
                        <div>
                          <h3 className="font-semibold text-title-4 text-gray-900 group-hover:text-primary-500 transition-colors">
                            회사 #{post.company_id}
                          </h3>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 text-body-3 text-primary-500">
                              <Clock className="w-4 h-4" />
                              신규
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 포지션 */}
                    <h4 className="text-title-4 font-medium text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h4>

                    {/* 위치와 급여 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-body-3">{post.work_location}</span>
                        <span className="text-body-3">• {post.employment_type}</span>
                      </div>
                      <p className="text-primary-500 font-semibold text-body-2">
                        {post.salary ? `${post.salary.toLocaleString()}원` : '연봉 협의'}
                      </p>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2">
                      {language.slice(0, 3).map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-caption-1 rounded-md"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-lg border border-line-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-primary-500 text-white'
                            : 'border border-line-200 hover:bg-gray-50 text-label-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-lg border border-line-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
          ) : (
            <div className="text-center py-20">
              <p className="text-label-500 text-body-2">등록된 공고가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
