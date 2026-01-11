'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { tokenManager, TokenType, ApiTokenType } from '@/shared/lib/utils/tokenManager';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/client';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: TokenType | null;
  login: (accessToken: string, rememberMe?: boolean, tokenType?: ApiTokenType) => void;
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
  const [userType, setUserType] = useState<TokenType | null>(null);

  // 인증 상태 체크 함수
  const checkAuth = useCallback(() => {
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

    // 토큰 확인
    const hasToken = tokenManager.hasToken();
    const isValid = tokenManager.isTokenValid();
    const currentTokenType = tokenManager.getUserTypeWithFallback();

    if (hasToken && isValid && currentTokenType) {
      setIsAuthenticated(true);
      setUserType(currentTokenType === 'admin' ? 'company' : currentTokenType);
    } else {
      setIsAuthenticated(false);
      setUserType(null);
    }

    setIsLoading(false);
  }, [pathname]);

  // 초기 인증 체크 + pathname 변경 시 재체크
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Storage 이벤트 리스너 - 딱 1번만 등록!
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  // 로그인 함수
  const login = useCallback((accessToken: string, rememberMe: boolean = false, tokenType?: ApiTokenType) => {
    tokenManager.setToken(accessToken, rememberMe, tokenType);
    const userType = tokenManager.getUserTypeWithFallback();

    setIsAuthenticated(true);
    setUserType(userType === 'admin' ? 'company' : userType);
  }, []);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    const currentUserType = tokenManager.getUserTypeWithFallback();
    tokenManager.removeToken();

    setIsAuthenticated(false);
    setUserType(null);

    if (typeof window !== 'undefined') {
      try {
        const endpoint =
          currentUserType === 'company' ? '/api/auth/company/logout' :
            currentUserType === 'admin' ? '/api/auth/admin/logout' :
              '/api/auth/logout';
        await apiClient.delete(endpoint);
      } catch (err) {
        console.error('Logout failed:', err);
      }

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
