'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Phone, Mail, Building2, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fetchClient } from '@/shared/api/fetchClient';
import { CompanyProfileResponse } from '@/shared/types/api';

/**
 * STEP 4 — 담당자 정보 (read-only)
 *
 * 이 섹션은 기업 프로필의 정보를 그대로 표시합니다.
 * 백엔드 `CreateCompanyPostRequest` 스키마에 담당자 필드가 없어,
 * 입력값을 받으면 그대로 버려지기 때문에 read-only 디스플레이로 변경했습니다.
 * 담당자 정보는 `/company/profile/edit` 에서만 수정 가능합니다.
 */
export function ManagerInfoSection() {
  const t = useTranslations('jobs.manager');

  const [profile, setProfile] = useState<CompanyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchClient.get<CompanyProfileResponse>('/api/company-profile');
        if (active) setProfile(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const phone = profile?.phone_number?.toString().trim();
  const email = profile?.email?.trim();
  const isEmpty = !phone && !email;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <User size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-caption-3 font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded tracking-wide">
                STEP 4
              </span>
              <h2 className="text-body-2 font-bold text-slate-900">{t('title')}</h2>
            </div>
            <p className="text-caption-2 text-slate-400">{t('readOnlyHint')}</p>
          </div>
        </div>

        <Link
          href="/company/profile/edit"
          className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-caption-2 font-semibold rounded-lg
                     border border-blue-200 text-blue-600 bg-blue-50
                     hover:bg-blue-100 hover:border-blue-300 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Building2 size={13} />
          <span className="hidden sm:inline">{t('editInProfile')}</span>
          <span className="sm:hidden">
            <ExternalLink size={13} />
          </span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton-shimmer h-10 w-full rounded-lg" />
          <div className="skeleton-shimmer h-10 w-full rounded-lg" />
        </div>
      ) : error ? (
        <p className="text-caption-1 text-slate-500">{t('loadFailed')}</p>
      ) : isEmpty ? (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-caption-1 text-amber-700">{t('emptyProfile')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg bg-slate-50">
            <Phone size={15} className="text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-caption-3 text-slate-400 mb-0.5">{t('phoneLabel')}</p>
              <p className="text-body-3 text-slate-800 truncate">{phone || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg bg-slate-50">
            <Mail size={15} className="text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-caption-3 text-slate-400 mb-0.5">{t('emailLabel')}</p>
              <p className="text-body-3 text-slate-800 truncate">{email || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
