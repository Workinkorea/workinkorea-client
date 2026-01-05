/**
 * Company Profile Validation Rules
 *
 * Centralized validation logic for company profile forms
 */

import { CompanyProfileRequest } from '@/lib/api/types';
import { validatePhoneType } from '@/lib/utils/phoneUtils';

export type ValidationRule = (value: string | number, formData?: CompanyProfileRequest) => string;

/**
 * Validation rules for company profile fields
 */
export const companyProfileValidationRules: Record<string, ValidationRule> = {
  email: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || strValue.trim() === '') return '이메일을 입력해주세요.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strValue)) return '올바른 이메일 형식이 아닙니다.';
    return '';
  },

  website_url: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || strValue.trim() === '') return '';
    try {
      new URL(strValue);
      return '';
    } catch {
      return '올바른 URL 형식이 아닙니다. (예: https://example.com)';
    }
  },

  phone_number: (value: string | number, formData?: CompanyProfileRequest) => {
    const strValue = String(value);
    if (!strValue || !strValue.trim()) return '전화번호를 입력해주세요.';
    if (!formData?.phone_type) return '전화번호 타입을 선택해주세요.';
    return validatePhoneType(strValue, formData.phone_type);
  },

  phone_type: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || strValue.trim() === '') return '전화번호 타입을 선택해주세요.';
    return '';
  },

  employee_count: (value: string | number) => {
    if (!value || Number(value) <= 0) return '직원 수를 입력해주세요.';
    return '';
  },

  industry_type: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || !strValue.trim()) return '업종을 입력해주세요.';
    return '';
  },

  company_type: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || !strValue.trim()) return '기업 형태를 선택해주세요.';
    return '';
  },

  address: (value: string | number) => {
    const strValue = String(value);
    if (!strValue || !strValue.trim()) return '주소를 입력해주세요.';
    return '';
  },

  establishment_date: (value: string | number) => {
    const strValue = String(value);
    if (!strValue) return '설립일을 입력해주세요.';
    const selectedDate = new Date(strValue);
    const today = new Date();
    if (selectedDate > today) return '설립일은 오늘 이전이어야 합니다.';
    return '';
  },

  country_id: (value: string | number) => {
    if (!value || Number(value) === 0) return '국가를 선택해주세요.';
    return '';
  },

  position_id: (value: string | number) => {
    if (!value || Number(value) === 0) return '직무를 선택해주세요.';
    return '';
  },
};

/**
 * Validate a single field
 *
 * @param name - Field name
 * @param value - Field value
 * @param formData - Complete form data (for cross-field validation)
 * @returns Error message or empty string if valid
 */
export const validateCompanyProfileField = (
  name: string,
  value: string | number,
  formData?: CompanyProfileRequest
): string => {
  const validator = companyProfileValidationRules[name];
  if (!validator) return '';
  return validator(value, formData);
};

/**
 * Validate entire form
 *
 * @param formData - Complete form data
 * @returns Record of field errors
 */
export const validateCompanyProfileForm = (
  formData: CompanyProfileRequest
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const fields = Object.keys(formData) as Array<keyof CompanyProfileRequest>;

  fields.forEach((field) => {
    const value = formData[field];
    // Skip validation if value is undefined
    if (value === undefined) return;

    const error = validateCompanyProfileField(field, value as string | number, formData);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

/**
 * Check if form is valid
 *
 * @param errors - Record of field errors
 * @returns True if no errors
 */
export const isCompanyProfileFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0;
};
