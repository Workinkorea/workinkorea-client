'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const status = searchParams.get('status');
      const token = searchParams.get('token');
      const name = searchParams.get('name');
      const message = searchParams.get('message');

      if (!window.opener) {
        console.error('No opener window found');
        return;
      }

      // 회원가입 필요
      if (status === 'signup') {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SIGNUP_REQUIRED',
            name: name,
          },
          window.location.origin
        );
        window.close();
        return;
      }

      // 로그인 성공
      if (status === 'success' && token) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            accessToken: token,
          },
          window.location.origin
        );
        window.close();
        return;
      }

      // 에러
      if (status === 'error') {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: message || 'Authentication failed',
          },
          window.location.origin
        );
        window.close();
        return;
      }

      // 예상치 못한 상태
      window.opener.postMessage(
        {
          type: 'GOOGLE_AUTH_ERROR',
          error: 'Invalid callback parameters',
        },
        window.location.origin
      );
      window.close();
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">인증 처리 중...</h2>
        <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">로딩 중...</h2>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
