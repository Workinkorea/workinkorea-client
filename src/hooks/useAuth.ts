import { useState, useEffect } from 'react';
import { tokenManager } from '@/lib/utils/tokenManager';
import { authApi } from '@/lib/api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = tokenManager.hasAccessToken();

      if (hasToken) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.refreshToken();
        const accessToken = response.accessToken;

        if (accessToken) {
          tokenManager.setAccessToken(accessToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
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
