import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isTokenExpired } from '@/shared/lib/utils/jwtUtils';

/**
 * ✅ Phase 4 최적화 13: 서버 측 쿠키 관리 개선
 *
 * ⚠️ 중요: 별도 Python 백엔드 사용 시 제한적으로 작동
 *
 * 이 함수는 Next.js 서버로 직접 전달된 쿠키만 읽을 수 있습니다.
 * Python 백엔드가 설정한 HttpOnly 쿠키는:
 * - 브라우저 → Python 백엔드: ✅ 자동 전송됨
 * - Next.js 서버 → Python 백엔드: ❌ 전송 안 됨
 *
 * 권장: 서버 컴포넌트에서는 Python 백엔드의 /auth/me 엔드포인트를 호출하여 인증 확인
 */
export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');
  const userType = cookieStore.get('userType');

  // ✅ 토큰이 있지만 만료된 경우 처리
  let isAuthenticated = false;
  if (token?.value) {
    isAuthenticated = !isTokenExpired(token.value);
  }

  return {
    isAuthenticated,
    userType: (userType?.value as 'user' | 'company') || null,
    token: token?.value || null,
  };
}

/**
 * ✅ Python 백엔드로 인증 확인 (추천 방법)
 *
 * 서버 컴포넌트에서 Python 백엔드의 /auth/me를 호출하여
 * 실제 인증 상태를 확인합니다.
 *
 * @example
 * // app/dashboard/page.tsx (서버 컴포넌트)
 * export default async function DashboardPage() {
 *   const auth = await getServerAuthFromBackend();
 *   if (!auth.isAuthenticated) redirect('/login');
 *   return <div>Welcome {auth.user?.name}</div>;
 * }
 */
export async function getServerAuthFromBackend() {
  try {
    // createServerApiClient import 추가 필요
    const { createServerApiClient } = await import('@/shared/api/server');
    const apiClient = await createServerApiClient();
    const response = await apiClient.get('/auth/me');

    return {
      isAuthenticated: true,
      userType: response.data.user_type as 'user' | 'company',
      user: response.data,
    };
  } catch {
    return {
      isAuthenticated: false,
      userType: null,
      user: null,
    };
  }
}

/**
 * 서버 컴포넌트에서 인증을 요구합니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
export async function requireAuth() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated) {
    redirect('/login');
  }
  return auth;
}

/**
 * 서버 컴포넌트에서 특정 사용자 타입을 요구합니다.
 * @param requiredType - 'user' 또는 'company'
 */
export async function requireUserType(requiredType: 'user' | 'company') {
  const auth = await requireAuth();
  if (auth.userType !== requiredType) {
    redirect('/');
  }
  return auth;
}

/**
 * ✅ Phase 4 최적화 13: 쿠키 설정 유틸리티
 *
 * 안전한 쿠키 설정 옵션
 * 참고: 실제 쿠키 설정은 백엔드에서 수행해야 합니다.
 */
export const SECURE_COOKIE_OPTIONS = {
  /**
   * HttpOnly 쿠키 설정 (백엔드에서 사용)
   * JavaScript에서 접근 불가 → XSS 방어
   */
  httpOnly: true,

  /**
   * Secure 플래그 (HTTPS 전용)
   * 프로덕션 환경에서만 활성화
   */
  secure: process.env.NODE_ENV === 'production',

  /**
   * SameSite 설정 (CSRF 방어)
   * - 'strict': 가장 엄격 (외부 사이트에서 쿠키 전송 안 함)
   * - 'lax': 일부 크로스 사이트 요청 허용 (링크 클릭 등)
   * - 'none': 모든 크로스 사이트 요청 허용 (secure: true 필수)
   */
  sameSite: 'lax' as const,

  /**
   * 쿠키 경로
   */
  path: '/',

  /**
   * 쿠키 만료 시간
   */
  maxAge: {
    accessToken: 30 * 60, // 30분 (초 단위)
    refreshToken: 7 * 24 * 60 * 60, // 7일 (초 단위)
  },
} as const;
