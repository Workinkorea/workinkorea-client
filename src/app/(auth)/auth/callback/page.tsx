'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { consumeCallbackUrl } from '@/shared/lib/callbackUrl';
import { tokenStore } from '@/shared/api/tokenStore';
import { profileApi } from '@/features/profile/api/profileApi';
import { cookieManager } from '@/shared/lib/utils/cookieManager';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const status = searchParams.get('status');
      const token = searchParams.get('token');
      const message = searchParams.get('message');

      // 회원가입 필요 (Google OAuth — 신규 사용자)
      if (status === 'signup') {
        const email = searchParams.get('email') || searchParams.get('user_email');
        const signupUrl = email
          ? `/signup?user_email=${encodeURIComponent(email)}&status=error`
          : '/signup?status=error';
        router.push(signupUrl);
        return;
      }

      // 로그인 성공
      if (status === 'success' && token) {
        // HttpOnly Cookie는 백엔드가 이미 설정함
        // access_token을 메모리에 저장 (인증 상태 복원용)
        tokenStore.set(token);

        // rememberMe 처리
        localStorage.removeItem('googleLoginRememberMe');

        login('user');
        // Defensive: re-set cookie directly in case login() call is delayed
        cookieManager.setUserType('user');

        // 프로필 존재 여부 확인 → 없으면 프로필 생성 페이지로
        try {
          await profileApi.getProfile();
          // 프로필 존재 → 기존 페이지로 복귀
          const callbackUrl = consumeCallbackUrl();
          window.location.href = callbackUrl ?? '/';
        } catch {
          // 404 = 프로필 미생성 → 프로필 생성 페이지로
          consumeCallbackUrl(); // 콜백 URL 소비 (나중에 사용 안 함)
          router.replace('/user/profile/setup');
        }
        return;
      }

      // 에러
      if (status === 'error') {
        if (process.env.NODE_ENV === 'development') {
          console.error('Google login failed:', message || 'Authentication failed');
        }
        router.push(`/login?error=oauth_failed`);
        return;
      }

      // 예상치 못한 상태
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid callback parameters');
      }
      router.push('/login?error=unknown');
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-title-4 font-semibold">인증 처리 중...</h2>
        <p className="mt-2 text-label-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-title-4 font-semibold">로딩 중...</h2>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
