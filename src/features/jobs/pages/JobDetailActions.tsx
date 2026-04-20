'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function JobDetailActions() {
  const router = useRouter();
  const t = useTranslations('jobs.detail');

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>{t('backToList')}</span>
      </button>
    </>
  );
}
