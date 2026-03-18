'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.error');

  useEffect(() => {
    // 프로덕션에서는 에러 로깅 서비스로 전송
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <motion.div
        className="text-center mx-auto max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-[72px] font-extrabold text-slate-200 mb-2 leading-none">500</h1>
          <h2 className="text-[22px] font-extrabold text-slate-900 mb-3">
            {t('title')}
          </h2>
          <p className="text-body-2 text-slate-500">
            {t('description')}
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('retry')}
          </motion.button>

          <motion.button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('goHome')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}