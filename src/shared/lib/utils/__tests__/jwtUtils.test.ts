import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  decodeJWT,
  getTokenExpiration,
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenRemainingTime,
  getUserTypeFromToken,
} from '../jwtUtils';

describe('jwtUtils', () => {
  // Helper function to create a valid JWT token
  const createToken = (payload: Record<string, unknown>) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = 'fake-signature';
    return `${header}.${body}.${signature}`;
  };

  describe('decodeJWT', () => {
    it('should decode a valid JWT token', () => {
      const payload = { sub: '123', user_type: 'user', exp: 1234567890 };
      const token = createToken(payload);
      const decoded = decodeJWT(token);

      expect(decoded).toEqual(payload);
    });

    it('should return null for empty token', () => {
      expect(decodeJWT('')).toBe(null);
      expect(decodeJWT('   ')).toBe(null);
    });

    it('should return null for invalid token format', () => {
      expect(decodeJWT('invalid')).toBe(null);
      expect(decodeJWT('invalid.token')).toBe(null);
    });

    it('should return null for non-string input', () => {
      expect(decodeJWT(null as any)).toBe(null);
      expect(decodeJWT(undefined as any)).toBe(null);
    });

    it('should cache decoded tokens for better performance', () => {
      const payload = { sub: '123', exp: 1234567890 };
      const token = createToken(payload);

      // First call
      const decoded1 = decodeJWT(token);
      // Second call (should use cache)
      const decoded2 = decodeJWT(token);

      expect(decoded1).toEqual(decoded2);
      expect(decoded1).toBe(decoded2); // Same reference (cached)
    });

    it('should handle tokens with multiple fields', () => {
      const payload = { sub: '123', name: 'John Doe', role: 'admin', email: 'test@example.com' };
      const token = createToken(payload);
      const decoded = decodeJWT(token);

      expect(decoded?.sub).toBe('123');
      expect(decoded?.name).toBe('John Doe');
      expect(decoded?.role).toBe('admin');
    });
  });

  describe('getTokenExpiration', () => {
    it('should return expiration time from token', () => {
      const exp = 1234567890;
      const token = createToken({ exp });

      expect(getTokenExpiration(token)).toBe(exp);
    });

    it('should return null if token has no exp field', () => {
      const token = createToken({ sub: '123' });

      expect(getTokenExpiration(token)).toBe(null);
    });

    it('should return null for invalid token', () => {
      expect(getTokenExpiration('invalid')).toBe(null);
    });
  });

  describe('isTokenExpired', () => {
    beforeEach(() => {
      // Mock Date.now to have consistent test results
      vi.useFakeTimers();
    });

    it('should return false for non-expired token', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const token = createToken({ exp: futureTime });

      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createToken({ exp: pastTime });

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for token without expiration', () => {
      const token = createToken({ sub: '123' });

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
    });
  });

  describe('isTokenExpiringSoon', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should return true if token expires within buffer time', () => {
      const soonTime = Math.floor(Date.now() / 1000) + 200; // 200 seconds from now
      const token = createToken({ exp: soonTime });

      // Default buffer is 300 seconds, so this should return true
      expect(isTokenExpiringSoon(token)).toBe(true);
    });

    it('should return false if token expires after buffer time', () => {
      const laterTime = Math.floor(Date.now() / 1000) + 400; // 400 seconds from now
      const token = createToken({ exp: laterTime });

      // Default buffer is 300 seconds, so this should return false
      expect(isTokenExpiringSoon(token)).toBe(false);
    });

    it('should use custom buffer time', () => {
      const time = Math.floor(Date.now() / 1000) + 100; // 100 seconds from now
      const token = createToken({ exp: time });

      expect(isTokenExpiringSoon(token, 50)).toBe(false);
      expect(isTokenExpiringSoon(token, 150)).toBe(true);
    });

    it('should return true for expired token', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 100;
      const token = createToken({ exp: pastTime });

      expect(isTokenExpiringSoon(token)).toBe(true);
    });
  });

  describe('getTokenRemainingTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should return remaining time in seconds', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const token = createToken({ exp: futureTime });

      expect(getTokenRemainingTime(token)).toBe(3600);
    });

    it('should return 0 for expired token', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 100;
      const token = createToken({ exp: pastTime });

      expect(getTokenRemainingTime(token)).toBe(0);
    });

    it('should return null for token without expiration', () => {
      const token = createToken({ sub: '123' });

      expect(getTokenRemainingTime(token)).toBe(null);
    });
  });

  describe('getUserTypeFromToken', () => {
    it('should return user type from user_type field', () => {
      expect(getUserTypeFromToken(createToken({ user_type: 'company' }))).toBe('company');
      expect(getUserTypeFromToken(createToken({ user_type: 'user' }))).toBe('user');
      expect(getUserTypeFromToken(createToken({ user_type: 'COMPANY' }))).toBe('company');
      expect(getUserTypeFromToken(createToken({ user_type: 'USER' }))).toBe('user');
    });

    it('should return user type from role field', () => {
      expect(getUserTypeFromToken(createToken({ role: 'company' }))).toBe('company');
      expect(getUserTypeFromToken(createToken({ role: 'user' }))).toBe('user');
      expect(getUserTypeFromToken(createToken({ role: 'COMPANY' }))).toBe('company');
    });

    it('should infer company from sub field', () => {
      expect(getUserTypeFromToken(createToken({ sub: 'company_123' }))).toBe('company');
    });

    it('should default to user for unknown type', () => {
      expect(getUserTypeFromToken(createToken({ sub: '123' }))).toBe('user');
    });

    it('should return null for invalid token', () => {
      expect(getUserTypeFromToken('invalid')).toBe(null);
    });

    it('should prioritize user_type over role', () => {
      const token = createToken({ user_type: 'company', role: 'user' });
      expect(getUserTypeFromToken(token)).toBe('company');
    });
  });
});
