export const formatBusinessNumber = (businessNumber: string): string => {
  const cleaned = businessNumber.replace(/[^0-9]/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 10)}`;
};

export const removeBusinessNumberHyphen = (businessNumber: string): string => {
  return businessNumber.replace(/[^0-9]/g, '');
};

export const isValidBusinessNumber = (businessNumber: string): boolean => {
  const cleaned = removeBusinessNumberHyphen(businessNumber);
  return cleaned.length === 10 && /^\d{10}$/.test(cleaned);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8 || password.length > 15) {
    return '8~15자리 영문, 숫자, 특수문자 조합하여 입력해주세요';
  }
  
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);  
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasLetter || !hasNumber || !hasSpecialChar) {
    return '8~15자리 영문, 숫자, 특수문자 조합하여 입력해주세요';
  }
  
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return null;
  if (password !== confirmPassword) {
    return '위에 입력된 비밀번호와 다르게 입력되었어요';
  }
  return null;
};

export const validateBirthDate = (birthDate: string): string | null => {
  if (!birthDate || birthDate.length !== 8) {
    return '생년월일은 YYYYMMDD 형식입니다';
  }
  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  if (cleanPhone.length !== 11) {
    return '전화번호는 010-1234-5678 형식입니다.';
  }
  
  if (!cleanPhone.startsWith('010')) {
    return '전화번호는 010-1234-5678 형식입니다.';
  }
  
  return null;
};