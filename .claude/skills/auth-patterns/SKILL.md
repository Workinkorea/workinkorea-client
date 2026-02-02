---
name: auth-patterns
description: Authentication patterns for HttpOnly Cookie-based authentication system
---

# 인증 패턴 (Authentication Patterns)

## 목적
이 스킬은 HttpOnly Cookie 기반 인증 시스템 구현 패턴을 제공합니다.

## 사용 시점
- 로그인/회원가입 구현 시
- 인증이 필요한 API 호출 시
- 보호된 페이지 구현 시
- 세션 관리 기능 추가 시

## 핵심 원칙

### ⚠️ 절대 규칙
1. **절대 금지**: `localStorage` 또는 `sessionStorage`에 토큰 저장
2. **필수**: `fetchClient` 사용 (직접 `fetch` 금지)
3. **필수**: `credentials: 'include'` 설정
4. **보안**: HttpOnly Cookie만 사용

## 인증 플로우 패턴

### 1. 로그인 패턴

```typescript
// src/features/auth/api/login.ts
import { fetchClient } from '@/shared/api/fetchClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'NORMAL' | 'COMPANY';
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return fetchClient.post<LoginResponse>('/api/auth/login', data);
  // 백엔드가 Set-Cookie로 accessToken, refreshToken 전송
  // 프론트엔드는 쿠키를 직접 다루지 않음
}
```

```typescript
// src/features/auth/pages/LoginClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { login } from '../api/login';
import { loginSchema } from '../validations/authSchema';
import type { LoginFormData } from '../types/auth';

export function LoginClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await login(data);

      // ✅ 쿠키는 자동으로 저장됨 (HttpOnly)
      // ❌ localStorage.setItem('token', ...) 절대 금지!

      toast.success('로그인에 성공했습니다');

      // 사용자 타입에 따라 리다이렉트
      if (response.user.userType === 'COMPANY') {
        router.push('/company');
      } else {
        router.push('/user');
      }

      router.refresh(); // Server Component 데이터 갱신
    } catch (error) {
      toast.error('로그인에 실패했습니다');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          이메일
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
```

### 2. 회원가입 패턴

```typescript
// src/features/auth/api/signup.ts
import { fetchClient } from '@/shared/api/fetchClient';

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  userType: 'NORMAL' | 'COMPANY';

  // 일반 회원
  nationality?: string;
  phone?: string;

  // 기업 회원
  companyName?: string;
  businessNumber?: string;
}

export async function signup(data: SignupRequest): Promise<void> {
  const endpoint = data.userType === 'COMPANY'
    ? '/api/auth/signup/company'
    : '/api/auth/signup';

  await fetchClient.post(endpoint, data);
}
```

```typescript
// src/features/auth/validations/authSchema.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
    ),

  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),

  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요'),

  userType: z.enum(['NORMAL', 'COMPANY']),

  // 일반 회원
  nationality: z.string().optional(),
  phone: z.string().optional(),

  // 기업 회원
  companyName: z.string().optional(),
  businessNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});
```

### 3. 로그아웃 패턴

```typescript
// src/features/auth/api/logout.ts
import { fetchClient } from '@/shared/api/fetchClient';

export async function logout(): Promise<void> {
  await fetchClient.post('/api/auth/logout');
  // 백엔드가 쿠키 삭제 (Set-Cookie: accessToken=; Max-Age=0)
}
```

```typescript
// src/shared/components/Header.tsx
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logout } from '@/features/auth/api/logout';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success('로그아웃되었습니다');

      router.push('/');
      router.refresh(); // Server Component 재렌더링
    } catch (error) {
      toast.error('로그아웃에 실패했습니다');
      console.error('Logout error:', error);
    }
  };

  return (
    <header>
      <nav>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          로그아웃
        </button>
      </nav>
    </header>
  );
}
```

### 4. 인증 상태 확인 패턴

```typescript
// src/features/auth/hooks/useAuth.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/shared/api/fetchClient';
import type { User } from '@/shared/types/user';

export function useAuth() {
  return useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => fetchClient.get<User>('/api/users/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,  // 5분
  });
}

// 사용 예시
export function ProtectedComponent() {
  const { data: user, isLoading, error } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    // 401 에러 → fetchClient가 자동으로 로그인 페이지로 리다이렉트
    return null;
  }

  return (
    <div>
      <h1>안녕하세요, {user.name}님</h1>
    </div>
  );
}
```

### 5. 보호된 페이지 패턴

#### A. Middleware 인증 (권장)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  // 인증 필요 페이지
  const protectedPaths = ['/user', '/company', '/admin'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 권한 체크 (기업 회원 전용)
  if (request.nextUrl.pathname.startsWith('/company')) {
    const userType = request.cookies.get('userType');
    if (userType?.value !== 'COMPANY') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/company/:path*',
    '/admin/:path*',
  ],
};
```

#### B. Client Component 인증 체크

```typescript
// src/features/auth/components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '@/shared/ui/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'NORMAL' | 'COMPANY';
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useAuth();

  useEffect(() => {
    if (error) {
      router.push('/login');
    } else if (user && requiredUserType && user.userType !== requiredUserType) {
      router.push('/');
    }
  }, [user, error, requiredUserType, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || (requiredUserType && user?.userType !== requiredUserType)) {
    return null;
  }

  return <>{children}</>;
}

// 사용 예시
export function CompanyDashboard() {
  return (
    <AuthGuard requiredUserType="COMPANY">
      <div>기업 회원 전용 대시보드</div>
    </AuthGuard>
  );
}
```

### 6. 자동 토큰 갱신 (fetchClient 내장)

```typescript
// src/shared/api/fetchClient.ts
// ⚠️ 이 파일은 수정 금지!

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(API_BASE_URL + url, {
    ...options,
    credentials: 'include',  // 쿠키 자동 전송
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // 401 에러 시 토큰 갱신
  if (response.status === 401) {
    // refreshToken으로 새 accessToken 발급
    const refreshed = await fetch(API_BASE_URL + '/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshed.ok) {
      // 원래 요청 재시도
      return request<T>(url, options);
    } else {
      // 리프레시 실패 → 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const fetchClient = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};
```

## 보안 체크리스트

### 필수 보안 규칙
- [ ] `localStorage`/`sessionStorage`에 토큰 저장 금지
- [ ] `fetchClient` 사용 (직접 `fetch` 금지)
- [ ] `credentials: 'include'` 설정
- [ ] HttpOnly 쿠키 사용
- [ ] Secure 플래그 (HTTPS 전용)
- [ ] SameSite 속성 (CSRF 방어)
- [ ] 비밀번호 평문 저장 금지

### XSS 방어
- [ ] `dangerouslySetInnerHTML` 사용 최소화
- [ ] 사용자 입력 자동 이스케이프 (React 기본)
- [ ] DOMPurify 사용 (필요 시)

### CSRF 방어
- [ ] SameSite 쿠키 속성 설정
- [ ] 중요한 작업은 POST 메서드 사용
- [ ] Next.js 자동 CSRF 토큰 활용

## 디버깅 가이드

### 쿠키가 전송되지 않는 경우
1. `credentials: 'include'` 확인
2. CORS 설정 확인 (`Access-Control-Allow-Credentials: true`)
3. 쿠키 도메인 일치 확인
4. 브라우저 DevTools → Application → Cookies 확인

### 401 에러 반복
1. Refresh 토큰 만료 여부 확인
2. `/api/auth/refresh` 엔드포인트 응답 확인
3. 네트워크 탭에서 쿠키 전송 여부 확인
4. fetchClient의 토큰 갱신 로직 확인

### 로그인 후 리다이렉트 실패
1. `router.push()` 호출 확인
2. `router.refresh()` 호출 (Server Component 데이터 갱신)
3. 쿠키 저장 확인

## 참고 자료

- [auth-specialist 에이전트](/.claude/agents/auth-specialist.md)
- [프로젝트 CLAUDE.md](/.claude/Claude.md)
- [OWASP 인증 가이드](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
