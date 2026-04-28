import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type UserType = 'user' | 'admin' | 'company' | null;

/**
 * Next.js Middleware for Route Protection
 *
 * 장점:
 * - Edge Runtime에서 실행 (초고속)
 * - 페이지 렌더링 전에 체크 (깜빡임 없음)
 * - Server-side 체크 (클라이언트 우회 불가)
 *
 * 보안 주의:
 * - userType 쿠키는 UI용이며, 실제 인증은 백엔드 API가 담당
 * - access_token(HttpOnly)이 진짜 인증 토큰
 */
export function middleware(request: NextRequest) {
  const response = routeGuard(request);
  return bridgeUserTypeCookie(response, request);
}

/**
 * HttpOnly userType 쿠키 → JS-readable userTypeClient 쿠키 동기화
 *
 * 문제: 백엔드가 userType을 HttpOnly로 설정 → document.cookie로 읽기 불가
 *       → authStore.initialize()가 유저 타입을 판별하지 못해 비로그인 표시
 *
 * 해결: 미들웨어(서버사이드)에서 HttpOnly userType을 읽어
 *       non-HttpOnly userTypeClient 쿠키로 복사 (ISSUE-107/126)
 */
function bridgeUserTypeCookie(response: NextResponse, request: NextRequest): NextResponse {
  const userType = request.cookies.get('userType')?.value;

  if (userType && ['user', 'company', 'admin'].includes(userType)) {
    response.cookies.set('userTypeClient', userType, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7일
    });
  } else {
    // userType 없으면 bridge 쿠키도 정리
    response.cookies.delete('userTypeClient');
  }

  return response;
}

/**
 * Route Guard — 라우트 보호 로직
 */
function routeGuard(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const userType = request.cookies.get('userType')?.value as UserType | undefined;

  // ===== 1. Public Routes (비회원 접근 가능) =====
  const publicRoutes = [
    '/',
    '/jobs',
    '/self-diagnosis',
    '/diagnosis',
    '/companies', // 기업 목록
  ];

  // Exact match or starts with (for dynamic routes like /jobs/123)
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ===== 2. Auth Pages (로그인 페이지) =====
  const authRoutes = [
    '/login',
    '/login-select',
    '/signup',
    '/signup-select',
    '/company-login',
    '/company-signup',
    '/auth/callback',
  ];

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    // 이미 로그인된 경우 대시보드로
    if (userType) {
      const dashboardUrl = getDashboardUrl(userType);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // ===== 3. Protected Routes (인증 필요) =====

  // User routes
  if (pathname.startsWith('/user')) {
    if (!userType) {
      const loginUrl = new URL('/login-select', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userType !== 'user') {
      const url = new URL(getDashboardUrl(userType), request.url);
      url.searchParams.set('redirected', '1');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Company routes
  // /company (exact) is the public landing page
  // /company/* sub-routes (including /company/dashboard) require company auth
  if (pathname.startsWith('/company/')) {
    if (!userType) {
      const loginUrl = new URL('/company-login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userType !== 'company') {
      const url = new URL(getDashboardUrl(userType), request.url);
      url.searchParams.set('redirected', '1');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();  // pass-through
    if (!userType) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userType !== 'admin') {
      const url = new URL(getDashboardUrl(userType), request.url);
      url.searchParams.set('redirected', '1');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

/**
 * Get dashboard URL based on userType
 */
function getDashboardUrl(userType: UserType): string {
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'company':
      return '/company/dashboard';
    case 'user':
      return '/user/profile';
    default:
      return '/';
  }
}

/**
 * Middleware Matcher
 *
 * 제외:
 * - _next/static: Next.js 정적 파일
 * - _next/image: 이미지 최적화
 * - favicon.ico: 파비콘
 * - .*\\..*: 정적 자산 (images, fonts)
 * - api: API 라우트
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
