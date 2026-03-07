import { describe, it, expect } from 'vitest';
import {
  detectPhoneType,
  validatePhoneType,
  formatPhoneByType,
  getPhoneTypeLabel,
  getPhonePlaceholder,
  isValidPhone,
  getAreaCodeInfo,
} from '../phoneUtils';

describe('phoneUtils', () => {
  describe('detectPhoneType', () => {
    it('should detect mobile phone numbers', () => {
      expect(detectPhoneType('010-1234-5678')).toBe('MOBILE');
      expect(detectPhoneType('01012345678')).toBe('MOBILE');
      expect(detectPhoneType('011-123-4567')).toBe('MOBILE');
      expect(detectPhoneType('016-1234-5678')).toBe('MOBILE');
      expect(detectPhoneType('017-123-4567')).toBe('MOBILE');
      expect(detectPhoneType('018-1234-5678')).toBe('MOBILE');
      expect(detectPhoneType('019-123-4567')).toBe('MOBILE');
    });

    it('should detect landline phone numbers', () => {
      expect(detectPhoneType('02-1234-5678')).toBe('LANDLINE');
      expect(detectPhoneType('02 1234 5678')).toBe('LANDLINE');
      expect(detectPhoneType('0212345678')).toBe('LANDLINE');
      expect(detectPhoneType('031-123-4567')).toBe('LANDLINE');
      expect(detectPhoneType('051-1234-5678')).toBe('LANDLINE');
      expect(detectPhoneType('064-123-4567')).toBe('LANDLINE');
    });

    it('should return null for invalid numbers', () => {
      expect(detectPhoneType('')).toBe(null);
      expect(detectPhoneType('1234')).toBe(null);
      expect(detectPhoneType('abc')).toBe(null);
      expect(detectPhoneType('090-1234-5678')).toBe(null);
    });
  });

  describe('validatePhoneType', () => {
    it('should validate mobile phone numbers', () => {
      expect(validatePhoneType('010-1234-5678', 'MOBILE')).toBe('');
      expect(validatePhoneType('01012345678', 'MOBILE')).toBe('');
      expect(validatePhoneType('010-123-4567', 'MOBILE')).toBe('');
    });

    it('should validate landline phone numbers', () => {
      expect(validatePhoneType('02-1234-5678', 'LANDLINE')).toBe('');
      expect(validatePhoneType('02-123-4567', 'LANDLINE')).toBe('');
      expect(validatePhoneType('031-1234-5678', 'LANDLINE')).toBe('');
      expect(validatePhoneType('031-123-4567', 'LANDLINE')).toBe('');
    });

    it('should return error for wrong phone type', () => {
      expect(validatePhoneType('010-1234-5678', 'LANDLINE')).not.toBe('');
      expect(validatePhoneType('02-1234-5678', 'MOBILE')).not.toBe('');
    });

    it('should return error for empty input', () => {
      expect(validatePhoneType('', 'MOBILE')).toBe('전화번호를 입력해주세요.');
      expect(validatePhoneType('', 'LANDLINE')).toBe('전화번호를 입력해주세요.');
    });

    it('should return error for invalid format', () => {
      expect(validatePhoneType('010-12-345', 'MOBILE')).not.toBe('');
      expect(validatePhoneType('02-12-34', 'LANDLINE')).not.toBe('');
    });
  });

  describe('formatPhoneByType', () => {
    it('should format mobile phone numbers', () => {
      expect(formatPhoneByType('01012345678', 'MOBILE')).toBe('010-1234-5678');
      expect(formatPhoneByType('0101234567', 'MOBILE')).toBe('010-1234-567');
      expect(formatPhoneByType('010', 'MOBILE')).toBe('010');
      expect(formatPhoneByType('0101', 'MOBILE')).toBe('010-1');
    });

    it('should format Seoul landline numbers', () => {
      expect(formatPhoneByType('0212345678', 'LANDLINE')).toBe('02-1234-5678');
      expect(formatPhoneByType('021234567', 'LANDLINE')).toBe('02-123-4567');
      expect(formatPhoneByType('02', 'LANDLINE')).toBe('02');
    });

    it('should format other landline numbers', () => {
      expect(formatPhoneByType('03112345678', 'LANDLINE')).toBe('031-1234-5678');
      expect(formatPhoneByType('0311234567', 'LANDLINE')).toBe('031-123-4567');
      expect(formatPhoneByType('031', 'LANDLINE')).toBe('031');
    });

    it('should handle empty input', () => {
      expect(formatPhoneByType('', 'MOBILE')).toBe('');
      expect(formatPhoneByType('', 'LANDLINE')).toBe('');
    });

    it('should strip non-digit characters', () => {
      expect(formatPhoneByType('010-1234-5678', 'MOBILE')).toBe('010-1234-5678');
      expect(formatPhoneByType('010 1234 5678', 'MOBILE')).toBe('010-1234-5678');
    });
  });

  describe('getPhoneTypeLabel', () => {
    it('should return correct labels', () => {
      expect(getPhoneTypeLabel('MOBILE')).toBe('휴대전화');
      expect(getPhoneTypeLabel('LANDLINE')).toBe('일반전화');
    });
  });

  describe('getPhonePlaceholder', () => {
    it('should return correct placeholders', () => {
      expect(getPhonePlaceholder('MOBILE')).toBe('010-1234-5678');
      expect(getPhonePlaceholder('LANDLINE')).toBe('02-1234-5678');
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phones', () => {
      expect(isValidPhone('010-1234-5678', 'MOBILE')).toBe(true);
      expect(isValidPhone('02-1234-5678', 'LANDLINE')).toBe(true);
    });

    it('should return false for invalid phones', () => {
      expect(isValidPhone('010-12-345', 'MOBILE')).toBe(false);
      expect(isValidPhone('02-12-34', 'LANDLINE')).toBe(false);
      expect(isValidPhone('', 'MOBILE')).toBe(false);
    });
  });

  describe('getAreaCodeInfo', () => {
    it('should return area code info for Seoul', () => {
      const info = getAreaCodeInfo('02-1234-5678');
      expect(info).toEqual({ code: '02', region: '서울' });
    });

    it('should return area code info for other regions', () => {
      expect(getAreaCodeInfo('031-123-4567')).toEqual({ code: '031', region: '경기' });
      expect(getAreaCodeInfo('051-123-4567')).toEqual({ code: '051', region: '부산' });
      expect(getAreaCodeInfo('064-123-4567')).toEqual({ code: '064', region: '제주' });
    });

    it('should return null for mobile numbers', () => {
      expect(getAreaCodeInfo('010-1234-5678')).toBe(null);
    });

    it('should return null for invalid area codes', () => {
      expect(getAreaCodeInfo('099-123-4567')).toBe(null);
    });
  });
});
