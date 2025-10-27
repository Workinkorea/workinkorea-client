'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const status = searchParams.get('status');
      const token = searchParams.get('token');
      const message = searchParams.get('message');

      // 회원가입 필요
      if (status === 'signup') {
        router.push('/signup');
        return;
      }

      // 로그인 성공
      if (status === 'success' && token) {
        login(token);
        router.push('/');
        return;
      }

      // 에러
      if (status === 'error') {
        console.error('Google login failed:', message || 'Authentication failed');
        router.push('/login');
        return;
      }

      // 예상치 못한 상태
      console.error('Invalid callback parameters');
      router.push('/login');
    };

    handleCallback();
  }, [searchParams, router, login]);

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
