import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function JobNotFound() {
  const t = await getTranslations('errors.jobNotFound');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-label-50">
      <div className="text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-primary-300" />
        </div>
        <h1 className="text-title-3 font-extrabold text-label-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-body-2 text-label-500 mb-8">
          {t('description')}
        </p>
        <div className="space-y-3">
          <Link
            href="/jobs"
            className="inline-block w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {t('backToList')}
          </Link>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 border border-line-200 text-label-600 rounded-lg font-semibold hover:bg-label-100 transition-colors"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
