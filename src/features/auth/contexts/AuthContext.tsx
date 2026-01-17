'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { cookieManager, UserType } from '@/shared/lib/utils/cookieManager';
import { usePathname, useRouter } from 'next/navigation';
import { fetchClient } from '@/shared/api/fetchClient';
import { authApi } from '@/features/auth/api/authApi';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType | null;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<UserType | null>(null);

  // 인증 상태 체크 함수
  const checkAuth = useCallback(async () => {
    // API 경로에서는 인증 로직 스킵
    if (pathname?.includes('auth')) {
      setIsLoading(false);
      return;
    }

    // 인증 페이지에서는 인증 체크 안 함
    const AUTH_PATHS = ['/login', '/signup', '/company-login', '/company-signup'];
    const isAuthPath = AUTH_PATHS.some(path => pathname?.startsWith(path));

    if (isAuthPath) {
      setIsAuthenticated(false);
      setUserType(null);
      setIsLoading(false);
      return;
    }

    // HttpOnly Cookie 기반 인증 확인 (API 호출)
    try {
      const userInfo = await authApi.getProfile();

      // 성공 시 인증 상태 true
      setIsAuthenticated(true);

      // userType 설정 로직
      // 1. 공용 쿠키(cookieManager)에서 확인 (HttpOnly 아니라고 가정 시 시도)
      const cookieUserType = cookieManager.getUserType();

      if (cookieUserType) {
        setUserType(cookieUserType);
      } else {
        // 2. 쿠키도 없고 응답에도 없다면 기본값 'user'로 설정
        // (기업 회원이면 UI가 잘못 나올 수 있음 -> 백엔드 수정 필요: /api/me 응답에 type 포함 권장)
        console.warn('[AuthContext] Cannot determine userType from cookie or API. Defaulting to "user".');
        setUserType('user');
      }
    } catch (error) {
      // 401 등 에러 시 로그아웃 처리
      console.warn('[AuthContext] Auth check failed (token invalid or expired):', error);
      setIsAuthenticated(false);
      setUserType(null);
    }

    setIsLoading(false);
  }, [pathname]);

  // 초기 인증 체크 + pathname 변경 시 재체크
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Cookie 변경 감지 (userType 쿠키)
  useEffect(() => {
    const handleStorageChange = () => {
      // Cookie 변경은 storage 이벤트로 감지되지 않음
      // 대신 정기적인 체크 또는 API 401 에러로 감지
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  // 로그인 함수 (HttpOnly Cookie는 백엔드가 설정)
  const login = useCallback(() => {
    // HttpOnly Cookie는 백엔드가 자동 설정
    // 클라이언트는 인증 상태만 업데이트
    checkAuth();
  }, [checkAuth]);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    const currentUserType = cookieManager.getUserType();

    setIsAuthenticated(false);
    setUserType(null);

    if (typeof window !== 'undefined') {
      try {
        // 백엔드에 로그아웃 요청 (HttpOnly Cookie 삭제)
        await fetchClient.delete('/api/auth/logout');
      } catch (err) {
        console.error('Logout failed:', err);
      }

      // Public Cookie 정리
      cookieManager.clearAuth();

      const loginPath =
        currentUserType === 'company' ? '/company-login' :
          currentUserType === 'admin' ? '/admin/login' :
            '/login';
      router.push(loginPath);
    }
  }, [router]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    userType,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
