'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 프로덕션에서는 에러 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">500</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            문제가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-8">
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={reset}
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            다시 시도
          </motion.button>

          <motion.button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 border border-line-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            홈으로 돌아가기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}