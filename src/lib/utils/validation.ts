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

  if (!/^\d{8}$/.test(birthDate)) {
    return '생년월일은 숫자만 입력해주세요.';
  }

  const year = parseInt(birthDate.substring(0, 4));
  const month = parseInt(birthDate.substring(4, 6));
  const day = parseInt(birthDate.substring(6, 8));

  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) {
    return `연도는 1900년부터 ${currentYear}년까지 입력 가능합니다.`;
  }

  if (month < 1 || month > 12) {
    return '월은 01부터 12까지 입력해주세요.';
  }

  if (day < 1 || day > 31) {
    return '일은 01부터 31까지 입력해주세요.';
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeapYear) {
    daysInMonth[1] = 29;
  }

  if (day > daysInMonth[month - 1]) {
    return `${year}년 ${month}월은 최대 ${daysInMonth[month - 1]}일까지 있습니다.`;
  }

  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    return '미래 날짜는 입력할 수 없습니다.';
  }

  const maxAge = 120;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - maxAge);

  if (inputDate < minDate) {
    return '올바른 생년월일을 입력해주세요.';
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

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return '이메일을 입력해주세요.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }

  return null;
};

export const validateEmailVerificationCode = (code: string): string | null => {
  if (!code) {
    return '인증번호를 입력해주세요.';
  }

  const cleanCode = code.replace(/[^0-9]/g, '');
  if (cleanCode.length !== 6) {
    return '인증번호는 6자리 숫자입니다.';
  }

  return null;
};