import { useState, useEffect, useRef, useCallback } from 'react';
import { tokenManager } from '@/lib/utils/tokenManager';
import { authApi } from '@/lib/api/auth';
import { usePathname } from 'next/navigation';

// 인증이 필요 없는 페이지 경로 (로그인/회원가입)
const AUTH_PATHS = ['/login', '/signup', '/company-login', '/company-signup'];

// 로그인이 필수인 페이지 경로
const PROTECTED_PATHS = ['/user'];

export const useAuth = () => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPath = AUTH_PATHS.some(path => pathname?.startsWith(path));

  // 현재 경로가 로그인이 필수인 페이지인지 확인
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.startsWith(path));

  // 토큰 갱신 스케줄링 (전방 선언을 위한 ref)
  const scheduleTokenRefreshRef = useRef<(() => void) | null>(null);

  // 토큰 갱신 함수
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authApi.refreshToken();
      const accessToken = response.accessToken;

      if (accessToken) {
        tokenManager.setAccessToken(accessToken);
        setIsAuthenticated(true);
        scheduleTokenRefreshRef.current?.();
        return true;
      }
      return false;
    } catch {
      tokenManager.removeAccessToken();
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // 토큰 갱신 스케줄링
  const scheduleTokenRefresh = useCallback(() => {
    // 기존 타이머 정리
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const remainingTime = tokenManager.getTokenRemainingTime();

    if (!remainingTime || remainingTime <= 0) {
      // 토큰이 이미 만료됨 - 즉시 갱신
      refreshAccessToken();
      return;
    }

    const bufferTime = 5 * 60;
    let refreshIn: number;

    if (remainingTime <= bufferTime) {
      // 남은 시간이 5분 이하면, 남은 시간의 50% 지점에 갱신
      refreshIn = Math.max(remainingTime * 0.5, 1); // 최소 1초
    } else {
      // 만료 5분 전에 갱신
      refreshIn = remainingTime - bufferTime;
    }

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshIn * 1000);
  }, [refreshAccessToken]);

  // scheduleTokenRefresh를 ref에 할당
  scheduleTokenRefreshRef.current = scheduleTokenRefresh;

  useEffect(() => {
    const checkAuth = async () => {
      // 인증 페이지에서는 토큰 체크를 하지 않음
      if (isAuthPath) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const hasToken = tokenManager.hasAccessToken();

      if (hasToken && tokenManager.isTokenValid()) {
        // 유효한 토큰이 있으면 인증 상태 설정 및 갱신 스케줄링
        setIsAuthenticated(true);
        setIsLoading(false);
        scheduleTokenRefresh();
        return;
      }

      // 로그인이 필수인 페이지에서만 자동으로 refresh 시도
      if (isProtectedPath) {
        try {
          const success = await refreshAccessToken();
          if (!success) {
            tokenManager.removeAccessToken();
            setIsAuthenticated(false);
          }
        } catch {
          tokenManager.removeAccessToken();
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        // 로그인이 선택적인 페이지에서는 토큰이 없어도 그냥 진행
        setIsAuthenticated(false);
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
      // 컴포넌트 언마운트 시 타이머 정리
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
    // scheduleTokenRefresh는 ref를 통해 호출하므로 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAccessToken, isAuthPath, isProtectedPath]);

  const login = (accessToken: string) => {
    tokenManager.setAccessToken(accessToken);
    setIsAuthenticated(true);
    scheduleTokenRefresh(); // 로그인 후 갱신 스케줄링
  };

  const logout = async () => {
    // 타이머 정리
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

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
