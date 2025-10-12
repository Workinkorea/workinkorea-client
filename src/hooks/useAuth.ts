import { useState, useEffect, useRef, useCallback } from 'react';
import { tokenManager } from '@/lib/utils/tokenManager';
import { authApi } from '@/lib/api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        scheduleTokenRefreshRef.current?.(); // 갱신 후 다음 갱신 스케줄링
        return true;
      }
      return false;
    } catch {
      // refresh 실패 시 만료된 accessToken 제거
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

    // 만료 5분 전에 갱신 (300초 = 5분)
    // 단, 남은 시간이 5분보다 적으면 남은 시간의 50% 지점에 갱신
    const bufferTime = 300; // 5분
    let refreshIn: number;

    if (remainingTime <= bufferTime) {
      // 남은 시간이 5분 이하면, 남은 시간의 50% 지점에 갱신
      refreshIn = Math.max(remainingTime * 0.5, 10); // 최소 10초
    } else {
      // 만료 5분 전에 갱신
      refreshIn = remainingTime - bufferTime;
    }

    console.log(`Token refresh scheduled in ${Math.floor(refreshIn)} seconds`);

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshIn * 1000);
  }, [refreshAccessToken]);

  // scheduleTokenRefresh를 ref에 할당
  scheduleTokenRefreshRef.current = scheduleTokenRefresh;

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = tokenManager.hasAccessToken();

      if (hasToken && tokenManager.isTokenValid()) {
        // 유효한 토큰이 있으면 인증 상태 설정 및 갱신 스케줄링
        setIsAuthenticated(true);
        setIsLoading(false);
        scheduleTokenRefresh();
        return;
      }

      // 토큰이 없거나 만료되었으면 refresh 시도
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
  }, [refreshAccessToken]);

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
