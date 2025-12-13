import {
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenRemainingTime,
  getUserTypeFromToken,
  type UserType
} from './jwtUtils';

export type TokenType = UserType;
export type ApiTokenType = 'access' | 'access_company' | 'admin_access';

// 단일 토큰 키로 통합
const TOKEN_KEY = 'accessToken';
const TOKEN_TYPE_KEY = 'tokenType';

export const tokenManager = {
  /**
   * 토큰을 저장합니다 (user/company 구분 없이 단일 토큰)
   */
  setToken: (token: string, rememberMe: boolean = false, tokenType?: ApiTokenType) => {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);

      // token_type 저장 (제공된 경우)
      if (tokenType) {
        storage.setItem(TOKEN_TYPE_KEY, tokenType);
      }

      // 반대 스토리지에서는 제거 (중복 방지)
      const oppositeStorage = rememberMe ? sessionStorage : localStorage;
      oppositeStorage.removeItem(TOKEN_KEY);
      oppositeStorage.removeItem(TOKEN_TYPE_KEY);
    }
  },

  /**
   * 토큰을 가져옵니다
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      // localStorage를 먼저 확인 (자동 로그인), 없으면 sessionStorage 확인
      const fromLocal = localStorage.getItem(TOKEN_KEY);
      const fromSession = sessionStorage.getItem(TOKEN_KEY);
      return fromLocal || fromSession;
    }
    return null;
  },

  /**
   * 토큰을 제거합니다
   */
  removeToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_TYPE_KEY);
      localStorage.removeItem(TOKEN_TYPE_KEY);
    }
  },

  /**
   * 토큰이 존재하는지 확인합니다
   */
  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },

  /**
   * 토큰이 유효한지 확인합니다 (존재하고 만료되지 않음)
   */
  isTokenValid: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    return !isTokenExpired(token);
  },

  /**
   * 토큰이 곧 만료될지 확인합니다
   */
  isTokenExpiringSoon: (bufferMinutes: number = 5): boolean => {
    const token = tokenManager.getToken();
    if (!token) return true;
    return isTokenExpiringSoon(token, bufferMinutes);
  },

  /**
   * 토큰의 남은 시간을 초 단위로 반환합니다
   */
  getTokenRemainingTime: (): number | null => {
    const token = tokenManager.getToken();
    if (!token) return null;
    return getTokenRemainingTime(token);
  },

  /**
   * 토큰에서 사용자 타입을 추출합니다
   */
  getUserType: (): TokenType | null => {
    const token = tokenManager.getToken();
    if (!token) return null;
    return getUserTypeFromToken(token);
  },

  /**
   * 토큰이 localStorage에 저장되어 있는지 확인합니다 (자동 로그인 여부)
   */
  isTokenInLocalStorage: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * API token type을 저장합니다
   */
  setTokenType: (tokenType: ApiTokenType, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_TYPE_KEY, tokenType);

      // 반대 스토리지에서는 제거 (중복 방지)
      const oppositeStorage = rememberMe ? sessionStorage : localStorage;
      oppositeStorage.removeItem(TOKEN_TYPE_KEY);
    }
  },

  /**
   * API token type을 가져옵니다
   */
  getTokenType: (): ApiTokenType | null => {
    if (typeof window !== 'undefined') {
      const fromLocal = localStorage.getItem(TOKEN_TYPE_KEY);
      const fromSession = sessionStorage.getItem(TOKEN_TYPE_KEY);
      return (fromLocal || fromSession) as ApiTokenType | null;
    }
    return null;
  },

  /**
   * 저장된 token_type을 기반으로 사용자 타입을 반환합니다
   */
  getUserTypeFromTokenType: (): 'user' | 'company' | 'admin' | null => {
    const tokenType = tokenManager.getTokenType();
    if (!tokenType) return null;

    if (tokenType === 'access_company') return 'company';
    if (tokenType === 'admin_access') return 'admin';
    if (tokenType === 'access') return 'user';

    return null;
  },

  // === 하위 호환성을 위한 Deprecated 메서드들 ===
  // 점진적 마이그레이션을 위해 유지하되, 내부적으로는 단일 토큰 사용

  /** @deprecated 단일 토큰으로 통합되었습니다. setToken()을 사용하세요 */
  setAccessToken: (token: string, rememberMe: boolean = false, tokenType?: ApiTokenType) => {
    tokenManager.setToken(token, rememberMe, tokenType);
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. getToken()을 사용하세요 */
  getAccessToken: (): string | null => {
    return tokenManager.getToken();
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. removeToken()을 사용하세요 */
  removeAccessToken: () => {
    tokenManager.removeToken();
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. setToken()을 사용하세요 */
  setCompanyAccessToken: (token: string, rememberMe: boolean = false, tokenType?: ApiTokenType) => {
    tokenManager.setToken(token, rememberMe, tokenType);
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. getToken()을 사용하세요 */
  getCompanyAccessToken: (): string | null => {
    return tokenManager.getToken();
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. removeToken()을 사용하세요 */
  removeCompanyAccessToken: () => {
    tokenManager.removeToken();
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. hasToken()을 사용하세요 */
  hasAccessToken: (): boolean => {
    return tokenManager.hasToken();
  },

  /** @deprecated 단일 토큰으로 통합되었습니다. removeToken()을 사용하세요 */
  clearAllTokens: () => {
    tokenManager.removeToken();
  },
};
