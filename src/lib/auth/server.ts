import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 서버 컴포넌트에서 사용자 인증 정보를 가져옵니다.
 */
export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');
  const userType = cookieStore.get('userType');

  return {
    isAuthenticated: !!token,
    userType: (userType?.value as 'user' | 'company') || null,
    token: token?.value || null,
  };
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
