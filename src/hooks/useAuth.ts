import { useState, useEffect } from 'react';
import { tokenManager, TokenType } from '@/lib/utils/tokenManager';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

// 인증이 필요 없는 페이지 경로 (로그인/회원가입)
const AUTH_PATHS = ['/login', '/signup', '/company-login', '/company-signup'];

// 로그인이 필수인 페이지 경로
const PROTECTED_PATHS = ['/gg'];
//'/user', '/company'

interface UseAuthOptions {
  required?: boolean; // true: 토큰 없으면 refresh 시도, false: 토큰 체크만
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { required } = options;
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<TokenType | null>(null);

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPath = AUTH_PATHS.some(path => pathname?.startsWith(path));

  // required 옵션이 있으면 우선 사용, 없으면 경로 기반으로 판단
  const isProtectedPath = required !== undefined
    ? required
    : PROTECTED_PATHS.some(path => pathname?.startsWith(path));

  useEffect(() => {
    const checkAuth = () => {
      // Avoid running auth logic on refresh API routes
      if (pathname?.includes('/api/auth')) {
        setIsLoading(false);
        return;
      }

      // 인증 페이지에서는 토큰 체크를 하지 않음
      if (isAuthPath) {
        setIsAuthenticated(false);
        setUserType(null);
        setIsLoading(false);
        return;
      }

      // 토큰 확인 (단일 토큰)
      const hasToken = tokenManager.hasToken();
      const isValid = tokenManager.isTokenValid();
      const currentTokenType = tokenManager.getUserType();

      if (hasToken && isValid && currentTokenType) {
        // 유효한 토큰이 있으면 인증 상태 설정
        setIsAuthenticated(true);
        setUserType(currentTokenType);
      } else {
        // 유효한 토큰이 없으면 인증 해제
        // Axios 인터셉터가 401 발생 시 자동으로 refresh 처리함
        setIsAuthenticated(false);
        setUserType(null);
      }

      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname, isAuthPath, isProtectedPath]);

  const login = (accessToken: string, rememberMe: boolean = false) => {
    tokenManager.setToken(accessToken, rememberMe);
    const userType = tokenManager.getUserType();
    setIsAuthenticated(true);
    setUserType(userType);
  };

  const logout = async () => {
    const currentUserType = tokenManager.getUserType();
    tokenManager.removeToken();
    setIsAuthenticated(false);
    setUserType(null);

    if (typeof window !== 'undefined') {
      try {
        // 사용자 타입에 따라 적절한 로그아웃 엔드포인트 호출
        const endpoint = currentUserType === 'company'
          ? '/api/auth/company/logout'
          : '/api/auth/logout';
        await apiClient.delete(endpoint);
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
  };

  return {
    isAuthenticated,
    isLoading,
    userType,
    login,
    logout,
  };
};
