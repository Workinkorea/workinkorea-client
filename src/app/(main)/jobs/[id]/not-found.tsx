import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function JobNotFound() {
  const t = await getTranslations('errors.jobNotFound');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-blue-300" />
        </div>
        <h1 className="text-title-3 font-extrabold text-slate-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-body-2 text-slate-500 mb-8">
          {t('description')}
        </p>
        <div className="space-y-3">
          <Link
            href="/jobs"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            style={{ color: '#ffffff' }}
          >
            {t('backToList')}
          </Link>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 border border-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
