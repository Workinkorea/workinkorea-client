/**
 * Phone Number Utilities
 *
 * Handles phone number validation and formatting for both mobile and landline numbers
 *
 * Mobile (휴대전화): 010, 011, 016, 017, 018, 019
 * Landline (일반전화): Area codes like 02, 031-064
 */

export type PhoneType = 'MOBILE' | 'LANDLINE';

/**
 * Detect phone type from phone number
 *
 * @param phoneNumber - Phone number (with or without hyphens)
 * @returns PhoneType or null if unable to detect
 *
 * @example
 * detectPhoneType('010-1234-5678') // 'MOBILE'
 * detectPhoneType('02-1234-5678')  // 'LANDLINE'
 */
export function detectPhoneType(phoneNumber: string): PhoneType | null {
  const digits = phoneNumber.replace(/\D/g, '');

  if (!digits) return null;

  // Mobile: starts with 01X
  if (/^01[0-9]/.test(digits)) {
    return 'MOBILE';
  }

  // Landline: starts with 0 followed by area code
  if (/^0(2|[3-6][0-9])/.test(digits)) {
    return 'LANDLINE';
  }

  return null;
}

/**
 * Validate phone number matches the specified type
 *
 * @param phoneNumber - Phone number (with or without hyphens)
 * @param phoneType - Expected phone type
 * @returns Validation error message or empty string if valid
 *
 * @example
 * validatePhoneType('010-1234-5678', 'MOBILE')   // ''
 * validatePhoneType('010-1234-5678', 'LANDLINE') // '휴대전화번호는 일반전화로 등록할 수 없습니다.'
 */
export function validatePhoneType(phoneNumber: string, phoneType: PhoneType): string {
  const digits = phoneNumber.replace(/\D/g, '');

  if (!digits) {
    return '전화번호를 입력해주세요.';
  }

  const detectedType = detectPhoneType(phoneNumber);

  if (!detectedType) {
    return '유효하지 않은 전화번호 형식입니다.';
  }

  if (detectedType !== phoneType) {
    if (phoneType === 'MOBILE') {
      return '휴대전화번호 형식이 아닙니다. 010, 011, 016-019로 시작하는 번호를 입력해주세요.';
    } else {
      return '일반전화번호 형식이 아닙니다. 지역번호(예: 02, 031, 051)로 시작하는 번호를 입력해주세요.';
    }
  }

  // Additional format validation
  if (phoneType === 'MOBILE') {
    // Mobile: 010-XXXX-XXXX (10-11 digits)
    if (!/^01[0-9]\d{7,8}$/.test(digits)) {
      return '휴대전화번호는 10-11자리여야 합니다.';
    }
  } else {
    // Landline: 0XX-XXX-XXXX or 0XX-XXXX-XXXX (9-11 digits)
    if (!/^0(2|[3-6][0-9])\d{7,8}$/.test(digits)) {
      return '일반전화번호 형식이 올바르지 않습니다.';
    }
  }

  return '';
}

/**
 * Format phone number based on type
 *
 * @param phoneNumber - Phone number (digits only)
 * @param phoneType - Phone type
 * @returns Formatted phone number with hyphens
 *
 * @example
 * formatPhoneByType('01012345678', 'MOBILE')   // '010-1234-5678'
 * formatPhoneByType('0212345678', 'LANDLINE')  // '02-1234-5678'
 * formatPhoneByType('03112345678', 'LANDLINE') // '031-1234-5678'
 */
export function formatPhoneByType(phoneNumber: string, phoneType: PhoneType): string {
  const digits = phoneNumber.replace(/\D/g, '');

  if (!digits) return '';

  if (phoneType === 'MOBILE') {
    // Mobile: 010-XXXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  } else {
    // Landline: Area code varies
    // Seoul (02): 02-XXX-XXXX or 02-XXXX-XXXX
    // Others (031-064): 0XX-XXX-XXXX or 0XX-XXXX-XXXX

    if (digits.startsWith('02')) {
      // Seoul area code (2 digits)
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 5) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      } else if (digits.length <= 9) {
        // 02-XXX-XXXX
        return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
      } else {
        // 02-XXXX-XXXX
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
      }
    } else {
      // Other area codes (3 digits)
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else if (digits.length <= 10) {
        // 0XX-XXX-XXXX
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      } else {
        // 0XX-XXXX-XXXX
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
      }
    }
  }
}

/**
 * Get phone type label in Korean
 *
 * @param phoneType - Phone type
 * @returns Korean label
 *
 * @example
 * getPhoneTypeLabel('MOBILE')   // '휴대전화'
 * getPhoneTypeLabel('LANDLINE') // '일반전화'
 */
export function getPhoneTypeLabel(phoneType: PhoneType): string {
  return phoneType === 'MOBILE' ? '휴대전화' : '일반전화';
}

/**
 * Get placeholder text for phone input based on type
 *
 * @param phoneType - Phone type
 * @returns Placeholder text
 *
 * @example
 * getPhonePlaceholder('MOBILE')   // '010-1234-5678'
 * getPhonePlaceholder('LANDLINE') // '02-1234-5678'
 */
export function getPhonePlaceholder(phoneType: PhoneType): string {
  return phoneType === 'MOBILE' ? '010-1234-5678' : '02-1234-5678';
}

/**
 * Check if phone number is valid for the given type
 *
 * @param phoneNumber - Phone number
 * @param phoneType - Phone type
 * @returns Boolean indicating validity
 *
 * @example
 * isValidPhone('010-1234-5678', 'MOBILE')   // true
 * isValidPhone('02-1234-5678', 'MOBILE')    // false
 */
export function isValidPhone(phoneNumber: string, phoneType: PhoneType): boolean {
  return validatePhoneType(phoneNumber, phoneType) === '';
}

/**
 * Get area code information for landline numbers
 *
 * @param phoneNumber - Landline phone number
 * @returns Area code info or null
 *
 * @example
 * getAreaCodeInfo('02-1234-5678')  // { code: '02', region: '서울' }
 * getAreaCodeInfo('031-123-4567')  // { code: '031', region: '경기' }
 */
export function getAreaCodeInfo(phoneNumber: string): { code: string; region: string } | null {
  const digits = phoneNumber.replace(/\D/g, '');

  const areaCodes: Record<string, string> = {
    '02': '서울',
    '031': '경기',
    '032': '인천',
    '033': '강원',
    '041': '충남',
    '042': '대전',
    '043': '충북',
    '044': '세종',
    '051': '부산',
    '052': '울산',
    '053': '대구',
    '054': '경북',
    '055': '경남',
    '061': '전남',
    '062': '광주',
    '063': '전북',
    '064': '제주',
  };

  if (digits.startsWith('02')) {
    return { code: '02', region: '서울' };
  }

  const areaCode = digits.slice(0, 3);
  const region = areaCodes[areaCode];

  if (region) {
    return { code: areaCode, region };
  }

  return null;
}
