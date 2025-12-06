import { useState, useEffect, useRef, useCallback } from 'react';
import { tokenManager, TokenType } from '@/lib/utils/tokenManager';
import { authApi } from '@/lib/api/auth';
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
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false); // refresh 중복 방지

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPath = AUTH_PATHS.some(path => pathname?.startsWith(path));

  // required 옵션이 있으면 우선 사용, 없으면 경로 기반으로 판단
  const isProtectedPath = required !== undefined
    ? required
    : PROTECTED_PATHS.some(path => pathname?.startsWith(path));

  // 토큰 갱신 스케줄링 (전방 선언을 위한 ref)
  const scheduleTokenRefreshRef = useRef<(() => void) | null>(null);

  // 토큰 갱신 함수
  const refreshAccessToken = useCallback(async () => {
    // 이미 refresh 중이면 중복 호출 방지
    if (isRefreshingRef.current) {
      console.log('[useAuth] Already refreshing, skipping');
      return false;
    }

    isRefreshingRef.current = true;

    try {
      console.log('[useAuth] Starting token refresh');
      // 원래 토큰이 어디에 저장되어 있었는지 확인
      const rememberMe = tokenManager.isTokenInLocalStorage('user');

      const response = await authApi.refreshToken();
      const accessToken = response.accessToken;

      if (accessToken) {
        console.log('[useAuth] Token refresh successful');
        // 같은 저장소에 새 토큰 저장
        tokenManager.setAccessToken(accessToken, rememberMe);

        // 새 토큰의 만료 시간 확인
        const newTokenRemainingTime = tokenManager.getTokenRemainingTime();
        console.log('[useAuth] New token remaining time:', newTokenRemainingTime, 'seconds');

        setIsAuthenticated(true);

        // 새 토큰이 유효한 경우에만 재스케줄링
        if (newTokenRemainingTime && newTokenRemainingTime > 60) {
          scheduleTokenRefreshRef.current?.();
        } else {
          console.error('[useAuth] New token is already expired or expires too soon!');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('[useAuth] Token refresh failed:', error);
      tokenManager.removeAccessToken();
      setIsAuthenticated(false);
      return false;
    } finally {
      isRefreshingRef.current = false;
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
      // 토큰이 이미 만료됨
      console.log('[useAuth] Token expired, clearing auth');
      // 즉시 갱신하지 말고 인증 상태만 초기화
      // (무한 루프 방지: refresh가 계속 실패하는 경우)
      tokenManager.removeAccessToken();
      setIsAuthenticated(false);
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

    console.log('[useAuth] Scheduling next refresh in', refreshIn, 'seconds');

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
        setUserType(null);
        setIsLoading(false);
        return;
      }

      // 어떤 타입의 토큰이 있는지 확인
      const hasUserToken = tokenManager.getAccessToken();
      const hasCompanyToken = tokenManager.getCompanyAccessToken();

      let currentTokenType: TokenType | null = null;
      let hasValidToken = false;

      // 개인 토큰 먼저 확인
      if (hasUserToken && tokenManager.isTokenValid('user')) {
        currentTokenType = 'user';
        hasValidToken = true;
      }
      // 개인 토큰이 없거나 유효하지 않으면 기업 토큰 확인
      else if (hasCompanyToken && tokenManager.isTokenValid('company')) {
        currentTokenType = 'company';
        hasValidToken = true;
      }

      if (hasValidToken && currentTokenType) {
        // 유효한 토큰이 있으면 인증 상태 설정
        setIsAuthenticated(true);
        setUserType(currentTokenType);
        setIsLoading(false);

        // protected path에서만 토큰 갱신 스케줄링
        // 메인 페이지 등 선택적 로그인 페이지에서는 자동 갱신하지 않음
        if (isProtectedPath) {
          scheduleTokenRefresh();
        }
        return;
      }

      // 로그인이 필수인 페이지에서만 자동으로 refresh 시도
      if (isProtectedPath) {
        try {
          const success = await refreshAccessToken();
          if (!success) {
            tokenManager.removeAccessToken();
            setIsAuthenticated(false);
            setUserType(null);
          }
        } catch {
          tokenManager.removeAccessToken();
          setIsAuthenticated(false);
          setUserType(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // 로그인이 선택적인 페이지에서는 토큰이 없어도 그냥 진행
        setIsAuthenticated(false);
        setUserType(null);
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

  const login = (accessToken: string, rememberMe: boolean = false) => {
    tokenManager.setAccessToken(accessToken, rememberMe);
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
        await apiClient.delete(`/api/auth/logout`);
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
