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

    if (typeof window !== 'undefined') {
      try {
        await fetch(`/api/auth/logout`, {
          method: 'DELETE',
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
