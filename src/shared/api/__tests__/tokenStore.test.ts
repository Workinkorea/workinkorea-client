import { describe, it, expect, beforeEach } from 'vitest';
import { tokenStore, decodeUserType } from '../tokenStore';

/**
 * Helper function to create a fake JWT with a given payload.
 * JWT format: header.payload.signature
 */
function makeJWT(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('tokenStore', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  describe('get()', () => {
    it('returns null initially', () => {
      expect(tokenStore.get()).toBeNull();
    });

    it('returns the token after set()', () => {
      const token = 'test-token-123';
      tokenStore.set(token);
      expect(tokenStore.get()).toBe(token);
    });

    it('returns null after clear()', () => {
      tokenStore.set('test-token');
      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();
    });
  });

  describe('set()', () => {
    it('stores a token', () => {
      const token = 'my-access-token';
      tokenStore.set(token);
      expect(tokenStore.get()).toBe(token);
    });

    it('overwrites the previous token', () => {
      tokenStore.set('old-token');
      tokenStore.set('new-token');
      expect(tokenStore.get()).toBe('new-token');
    });

    it('stores empty string as a valid token', () => {
      tokenStore.set('');
      expect(tokenStore.get()).toBe('');
    });

    it('stores long tokens', () => {
      const longToken = 'x'.repeat(1000);
      tokenStore.set(longToken);
      expect(tokenStore.get()).toBe(longToken);
    });
  });

  describe('clear()', () => {
    it('resets token to null', () => {
      tokenStore.set('test-token');
      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();
    });

    it('is safe to call multiple times', () => {
      tokenStore.set('token1');
      tokenStore.clear();
      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();
    });
  });

  describe('state isolation', () => {
    it('multiple set/clear cycles work independently', () => {
      // Cycle 1
      tokenStore.set('token-1');
      expect(tokenStore.get()).toBe('token-1');

      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();

      // Cycle 2
      tokenStore.set('token-2');
      expect(tokenStore.get()).toBe('token-2');

      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();

      // Cycle 3
      tokenStore.set('token-3');
      expect(tokenStore.get()).toBe('token-3');

      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();
    });
  });
});

describe('decodeUserType', () => {
  describe('valid JWTs', () => {
    it('decodes user type from JWT with type: "access"', () => {
      const token = makeJWT({ type: 'access', sub: 'user-123' });
      expect(decodeUserType(token)).toBe('user');
    });

    it('decodes company type from JWT with type: "access_company"', () => {
      const token = makeJWT({ type: 'access_company', sub: 'company-456' });
      expect(decodeUserType(token)).toBe('company');
    });

    it('decodes admin type from JWT with type: "admin_access"', () => {
      const token = makeJWT({ type: 'admin_access', sub: 'admin-789' });
      expect(decodeUserType(token)).toBe('admin');
    });

    it('returns null for unknown type value', () => {
      const token = makeJWT({ type: 'unknown_type', sub: 'user-123' });
      expect(decodeUserType(token)).toBeNull();
    });

    it('returns null when type field is missing', () => {
      const token = makeJWT({ sub: 'user-123', exp: 1234567890 });
      expect(decodeUserType(token)).toBeNull();
    });

    it('handles JWT with additional fields', () => {
      const token = makeJWT({
        type: 'access',
        sub: 'user-123',
        exp: 1234567890,
        iat: 1234567800,
        email: 'user@example.com',
      });
      expect(decodeUserType(token)).toBe('user');
    });
  });

  describe('malformed JWTs', () => {
    it('returns null for JWT with only 1 part (no dots)', () => {
      const malformed = btoa(JSON.stringify({ type: 'access' }));
      expect(decodeUserType(malformed)).toBeNull();
    });

    it('still decodes correctly with JWT with only 2 parts (no signature)', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const payload = btoa(JSON.stringify({ type: 'access' }));
      const twoPartToken = `${header}.${payload}`;
      // The function only uses parts[1], so this still works
      expect(decodeUserType(twoPartToken)).toBe('user');
    });

    it('returns null for non-base64 middle part', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const signature = 'fakesignature';
      const malformed = `${header}.!@#$%^&*().${signature}`;
      expect(decodeUserType(malformed)).toBeNull();
    });

    it('returns null for non-JSON payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const payload = btoa('not a json object');
      const signature = 'fakesignature';
      const malformed = `${header}.${payload}.${signature}`;
      expect(decodeUserType(malformed)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('returns null for empty string', () => {
      expect(decodeUserType('')).toBeNull();
    });

    it('returns null for whitespace-only string', () => {
      expect(decodeUserType('   ')).toBeNull();
    });

    it('returns null for null-like string', () => {
      expect(decodeUserType('null')).toBeNull();
    });

    it('handles JWT with null type value', () => {
      const token = makeJWT({ type: null });
      expect(decodeUserType(token)).toBeNull();
    });

    it('handles JWT with empty string type', () => {
      const token = makeJWT({ type: '' });
      expect(decodeUserType(token)).toBeNull();
    });

    it('handles JWT with numeric type value', () => {
      const token = makeJWT({ type: 123 });
      expect(decodeUserType(token)).toBeNull();
    });

    it('handles JWT with type as object', () => {
      const token = makeJWT({ type: { role: 'user' } });
      expect(decodeUserType(token)).toBeNull();
    });
  });

  describe('case sensitivity', () => {
    it('is case-sensitive: "ACCESS" is not "access"', () => {
      const token = makeJWT({ type: 'ACCESS' });
      expect(decodeUserType(token)).toBeNull();
    });

    it('is case-sensitive: "Access_Company" is not "access_company"', () => {
      const token = makeJWT({ type: 'Access_Company' });
      expect(decodeUserType(token)).toBeNull();
    });
  });
});
