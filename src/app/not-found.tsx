'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors.notFound');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <motion.div
        className="text-center max-w-sm mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-display-hero font-extrabold text-slate-200 mb-2 leading-none">404</h1>
          <h2 className="text-title-3 font-extrabold text-slate-900 mb-3">
            {t('title')}
          </h2>
          <p className="text-body-2 text-slate-500">
            {t('description')}
          </p>
        </div>

        <div className="space-y-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('goHome')}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border border-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('goBack')}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
