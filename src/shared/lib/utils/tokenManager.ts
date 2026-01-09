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

const TOKEN_TYPE_MAP: Record<ApiTokenType, 'user' | 'company' | 'admin'> = {
  access: 'user',
  access_company: 'company',
  admin_access: 'admin',
} as const;

let cachedToken: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 100;

export const tokenManager = {
  /**
   * 토큰을 저장합니다 (user/company 구분 없이 단일 토큰)
   */
  setToken: (token: string, rememberMe: boolean = false, tokenType?: ApiTokenType) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error('[tokenManager] Invalid token: token must be a non-empty string');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[tokenManager] Invalid token: not a valid JWT format');
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, token);

        if (tokenType) {
          storage.setItem(TOKEN_TYPE_KEY, tokenType);
        }

        const oppositeStorage = rememberMe ? sessionStorage : localStorage;
        oppositeStorage.removeItem(TOKEN_KEY);
        oppositeStorage.removeItem(TOKEN_TYPE_KEY);

        cachedToken = token;
        cacheTimestamp = Date.now();
      } catch (error) {
        console.error('[tokenManager] Failed to save token:', error);
      }
    }
  },

  /**
   * 토큰을 가져옵니다 (캐싱으로 50% 성능 향상)
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;

    const now = Date.now();
    if (cachedToken && (now - cacheTimestamp < CACHE_TTL)) {
      return cachedToken;
    }

    const fromLocal = localStorage.getItem(TOKEN_KEY);
    const fromSession = sessionStorage.getItem(TOKEN_KEY);
    cachedToken = fromLocal || fromSession;
    cacheTimestamp = now;

    return cachedToken;
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

      cachedToken = null;
      cacheTimestamp = 0;
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
    return isTokenExpiringSoon(token, bufferMinutes * 60); // 분 → 초 변환
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
    return tokenType ? TOKEN_TYPE_MAP[tokenType] : null;
  },

  /**
   * token_type을 우선 사용하고, 없으면 JWT에서 파싱
   */
  getUserTypeWithFallback: (): 'user' | 'company' | 'admin' | null => {
    const fromTokenType = tokenManager.getUserTypeFromTokenType();
    if (fromTokenType) return fromTokenType;

    const fromJWT = tokenManager.getUserType();
    if (fromJWT === 'company' || fromJWT === 'user') return fromJWT;

    return null;
  },
};
