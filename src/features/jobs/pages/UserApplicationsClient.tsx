'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Briefcase, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Layout from '@/shared/components/layout/Layout';
import { Skeleton } from '@/shared/ui/Skeleton';
import { postsApi } from '@/features/jobs/api/postsApi';
import { FetchError } from '@/shared/api/fetchClient';

/**
 * ISSUE-110 + ISSUE-121: /user/applications 지원 내역 페이지.
 * 서버 GET /api/applications/me 가 아직 미구현(404)이어서 구현 전까지 준비 중 화면을 표시.
 * 서버 구현 완료 시 applications 배열을 렌더링하도록 확장.
 */
function UserApplicationsClient() {
  const t = useTranslations('user.applications');

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', 'me'],
    queryFn: () => postsApi.getMyApplications(),
    retry: false,
  });

  const applications = data?.applications ?? [];
  const isNotImplemented = error instanceof FetchError && error.status === 404;

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="page-container space-y-6">
          <div>
            <h1 className="text-title-3 sm:text-title-2 font-extrabold text-slate-900">
              {t('title')}
            </h1>
            <p className="text-caption-1 sm:text-body-3 text-slate-500 mt-1">
              {t('subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : isNotImplemented ? (
            <div className="bg-slate-50 rounded-xl p-12 text-center">
              <Clock className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="text-body-3 font-semibold text-slate-700 mb-1">
                {t('notImplementedTitle')}
              </p>
              <p className="text-caption-1 text-slate-500 mb-6">
                {t('notImplementedSubtitle')}
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-body-3 font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('browseJobs')}
              </Link>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-12 text-center">
              <Briefcase className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="text-body-3 font-semibold text-slate-700 mb-1">
                {t('emptyTitle')}
              </p>
              <p className="text-caption-1 text-slate-500 mb-6">
                {t('emptySubtitle')}
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-body-3 font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('browseJobs')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {applications.map((app) => (
                <li
                  key={app.id}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4"
                >
                  <div className="min-w-0">
                    <p className="text-body-3 font-semibold text-slate-900 truncate">
                      공고 #{app.post_id}
                    </p>
                    <p className="text-caption-2 text-slate-500 mt-1">
                      {t('appliedOn', { date: new Date(app.applied_at).toLocaleDateString() })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserApplicationsClient;
