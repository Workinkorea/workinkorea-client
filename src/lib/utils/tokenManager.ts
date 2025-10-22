import { isTokenExpired, isTokenExpiringSoon, getTokenRemainingTime } from './jwtUtils';

export const tokenManager = {
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('accessToken');
    }
    return null;
  },

  removeAccessToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
    }
  },

  hasAccessToken: (): boolean => {
    return !!tokenManager.getAccessToken();
  },

  /**
   * 토큰이 유효한지 확인합니다 (존재하고 만료되지 않음)
   */
  isTokenValid: (): boolean => {
    const token = tokenManager.getAccessToken();
    if (!token) return false;
    return !isTokenExpired(token);
  },

  /**
   * 토큰이 곧 만료될지 확인합니다 (기본: 5분 이내)
   * @param bufferSeconds 만료 전 버퍼 시간 (초)
   */
  isTokenExpiringSoon: (): boolean => {
    const token = tokenManager.getAccessToken();
    if (!token) return true;
    return isTokenExpiringSoon(token, 5);
  },

  /**
   * 토큰의 남은 시간을 초 단위로 반환합니다
   */
  getTokenRemainingTime: (): number | null => {
    const token = tokenManager.getAccessToken();
    if (!token) return null;
    return getTokenRemainingTime(token);
  },
};
