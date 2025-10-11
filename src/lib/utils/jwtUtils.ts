interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * JWT 토큰을 디코딩하여 payload를 반환합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 payload 또는 null
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * JWT 토큰의 만료 시간을 반환합니다.
 * @param token JWT 토큰
 * @returns 만료 시간 (Unix timestamp in seconds) 또는 null
 */
export const getTokenExpiration = (token: string): number | null => {
  const payload = decodeJWT(token);
  return payload?.exp ?? null;
};

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰
 * @returns 만료 여부
 */
export const isTokenExpired = (token: string): boolean => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return now >= exp;
};

/**
 * JWT 토큰이 곧 만료될지 확인합니다.
 * @param token JWT 토큰
 * @param bufferSeconds 만료 전 버퍼 시간 (초) - 기본값 5분 (300초)
 * @returns 곧 만료 여부
 */
export const isTokenExpiringSoon = (token: string, bufferSeconds: number = 300): boolean => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return (exp - now) <= bufferSeconds;
};

/**
 * JWT 토큰의 남은 시간을 초 단위로 반환합니다.
 * @param token JWT 토큰
 * @returns 남은 시간 (초) 또는 null
 */
export const getTokenRemainingTime = (token: string): number | null => {
  const exp = getTokenExpiration(token);
  if (!exp) return null;

  const now = Math.floor(Date.now() / 1000);
  const remaining = exp - now;
  return remaining > 0 ? remaining : 0;
};
