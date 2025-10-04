'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_ERROR',
              error: error,
            },
            window.location.origin
          );
        }
        return;
      }

      if (!code) {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_ERROR',
              error: 'No authorization code received',
            },
            window.location.origin
          );
        }
        return;
      }

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_BASE_URL}/api/auth/login/google/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }

        const data = await response.json();
        const accessToken = data.accessToken || data.access_token || data.token;
        const user = data.user;

        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_SUCCESS',
              accessToken,
              user,
            },
            window.location.origin
          );
        }
      } catch (error) {
        console.error('Authentication error:', error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            window.location.origin
          );
        }
      }
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
