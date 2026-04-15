'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-title-3 font-bold text-label-900 mb-2">문제가 발생했습니다</h2>
        <p className="text-body-2 text-label-500 mb-6">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold text-body-2 hover:bg-primary-700 transition-colors cursor-pointer"
          >
            다시 시도
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 border border-line-400 text-label-700 rounded-lg font-semibold text-body-2 hover:bg-label-50 transition-colors"
          >
            관리자 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
