import { isTokenExpired, isTokenExpiringSoon, getTokenRemainingTime } from './jwtUtils';

export type TokenType = 'user' | 'company';

const TOKEN_KEYS = {
  user: 'accessToken',
  company: 'companyAccessToken',
} as const;

export const tokenManager = {
  // 개인 로그인용 (기본)
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEYS.user, token);
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(TOKEN_KEYS.user);
    }
    return null;
  },

  removeAccessToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEYS.user);
    }
  },

  // 기업 로그인용
  setCompanyAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEYS.company, token);
    }
  },

  getCompanyAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(TOKEN_KEYS.company);
    }
    return null;
  },

  removeCompanyAccessToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEYS.company);
    }
  },

  // 공통 메서드 (타입 지정 가능)
  setToken: (token: string, type: TokenType = 'user') => {
    if (type === 'company') {
      tokenManager.setCompanyAccessToken(token);
    } else {
      tokenManager.setAccessToken(token);
    }
  },

  getToken: (type: TokenType = 'user'): string | null => {
    if (type === 'company') {
      return tokenManager.getCompanyAccessToken();
    }
    return tokenManager.getAccessToken();
  },

  removeToken: (type: TokenType = 'user') => {
    if (type === 'company') {
      tokenManager.removeCompanyAccessToken();
    } else {
      tokenManager.removeAccessToken();
    }
  },

  // 기존 메서드 (개인 로그인용으로 유지)
  hasAccessToken: (): boolean => {
    return !!tokenManager.getAccessToken();
  },

  /**
   * 토큰이 유효한지 확인합니다 (존재하고 만료되지 않음)
   */
  isTokenValid: (type: TokenType = 'user'): boolean => {
    const token = tokenManager.getToken(type);
    if (!token) return false;
    return !isTokenExpired(token);
  },

  /**
   * 토큰이 곧 만료될지 확인합니다 (기본: 5분 이내)
   * @param bufferSeconds 만료 전 버퍼 시간 (초)
   */
  isTokenExpiringSoon: (type: TokenType = 'user'): boolean => {
    const token = tokenManager.getToken(type);
    if (!token) return true;
    return isTokenExpiringSoon(token, 5);
  },

  /**
   * 토큰의 남은 시간을 초 단위로 반환합니다
   */
  getTokenRemainingTime: (type: TokenType = 'user'): number | null => {
    const token = tokenManager.getToken(type);
    if (!token) return null;
    return getTokenRemainingTime(token);
  },

  /**
   * 모든 토큰을 제거합니다 (로그아웃 시 사용)
   */
  clearAllTokens: () => {
    tokenManager.removeAccessToken();
    tokenManager.removeCompanyAccessToken();
  },
};
