'use client';

import { useEffect } from 'react';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[MainLayout] Render error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center mx-auto max-w-sm">
        <div className="mb-8">
          <h1 className="text-display-1 font-extrabold text-slate-200 mb-2 leading-none">오류</h1>
          <h2 className="text-title-3 font-bold text-slate-900 mb-3">
            페이지를 불러올 수 없습니다
          </h2>
          <p className="text-slate-500">
            일시적인 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            다시 시도
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
