import { useState, useEffect } from 'react';
import { tokenManager } from '@/lib/utils/tokenManager';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = tokenManager.hasAccessToken();
      setIsAuthenticated(hasToken);
      setIsLoading(false);
    };

    checkAuth();

    // 스토리지 변경 감지 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (accessToken: string) => {
    tokenManager.setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    tokenManager.removeAccessToken();
    setIsAuthenticated(false);

    // 외부 서버에 로그아웃 요청 (refreshToken 쿠키 삭제를 위해)
    if (typeof window !== 'undefined') {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
