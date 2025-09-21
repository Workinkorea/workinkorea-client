// 이미지 alt 텍스트 생성 유틸리티

interface AltTextOptions {
  context?: 'profile' | 'company' | 'job' | 'article' | 'product' | 'icon' | 'logo';
  userName?: string;
  companyName?: string;
  jobTitle?: string;
  location?: string;
  isDecorative?: boolean;
}

/**
 * 컨텍스트와 데이터를 기반으로 의미있는 alt 텍스트를 생성합니다.
 */
export function generateAltText(
  baseDescription: string,
  options: AltTextOptions = {}
): string {
  const {
    context,
    userName,
    companyName,
    jobTitle,
    location,
    isDecorative = false
  } = options;

  // 장식용 이미지인 경우 빈 alt 텍스트 반환
  if (isDecorative) {
    return '';
  }

  // 기본 설명이 없는 경우 컨텍스트 기반 기본값 제공
  if (!baseDescription && !context) {
    return '이미지';
  }

  let altText = baseDescription;

  // 컨텍스트별 alt 텍스트 생성
  switch (context) {
    case 'profile':
      if (userName) {
        altText = `${userName}님의 프로필 사진`;
      } else {
        altText = '사용자 프로필 사진';
      }
      break;

    case 'company':
      if (companyName) {
        altText = `${companyName} 회사 로고`;
      } else {
        altText = '회사 로고';
      }
      break;

    case 'job':
      const jobParts = [];
      if (companyName) jobParts.push(companyName);
      if (jobTitle) jobParts.push(jobTitle);
      if (location) jobParts.push(location);

      if (jobParts.length > 0) {
        altText = `${jobParts.join(' ')} 채용공고 이미지`;
      } else {
        altText = '채용공고 이미지';
      }
      break;

    case 'logo':
      if (companyName) {
        altText = `${companyName} 로고`;
      } else {
        altText = baseDescription || '로고';
      }
      break;

    case 'icon':
      // 아이콘의 경우 기능 설명을 포함
      altText = baseDescription || '아이콘';
      break;

    case 'article':
      altText = baseDescription || '기사 이미지';
      break;

    case 'product':
      altText = baseDescription || '제품 이미지';
      break;

    default:
      altText = baseDescription || '이미지';
  }

  return altText.trim();
}

/**
 * 파일명에서 의미있는 alt 텍스트를 추출합니다.
 */
export function extractAltFromFilename(filename: string): string {
  if (!filename) return '';

  // 파일 확장자 제거
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  // 구분자로 단어 분리 (-, _, 숫자 등)
  const words = nameWithoutExt
    .split(/[-_\s\d]+/)
    .filter(word => word.length > 1)
    .map(word => word.toLowerCase());

  // 의미있는 단어들만 선택
  const meaningfulWords = words.filter(word => {
    // 너무 짧거나 의미없는 단어 제외
    const meaninglessPatterns = /^(img|image|pic|photo|temp|tmp|new|old|copy|final|v\d+)$/i;
    return !meaninglessPatterns.test(word);
  });

  if (meaningfulWords.length === 0) {
    return '';
  }

  return meaningfulWords.join(' ');
}

/**
 * 이미지 URL에서 컨텍스트를 추측합니다.
 */
export function inferContextFromUrl(src: string): AltTextOptions['context'] {
  const url = src.toLowerCase();

  if (url.includes('logo')) return 'logo';
  if (url.includes('profile') || url.includes('avatar')) return 'profile';
  if (url.includes('company')) return 'company';
  if (url.includes('job') || url.includes('career')) return 'job';
  if (url.includes('icon')) return 'icon';
  if (url.includes('article') || url.includes('news')) return 'article';
  if (url.includes('product')) return 'product';

  return undefined;
}

/**
 * 사용자 데이터를 기반으로 프로필 이미지 alt 텍스트를 생성합니다.
 */
export function generateProfileAlt(userData: {
  name?: string;
  position?: string;
  company?: string;
}): string {
  const { name, position, company } = userData;

  const parts = [];

  if (name) {
    parts.push(`${name}님`);
  }

  if (position) {
    parts.push(position);
  }

  if (company) {
    parts.push(`(${company})`);
  }

  if (parts.length === 0) {
    return '사용자 프로필 사진';
  }

  return `${parts.join(' ')}의 프로필 사진`;
}

/**
 * 채용공고 이미지의 alt 텍스트를 생성합니다.
 */
export function generateJobAlt(jobData: {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
}): string {
  const { title, company, location, type } = jobData;

  const parts = [];

  if (company) parts.push(company);
  if (title) parts.push(title);
  if (location) parts.push(location);
  if (type) parts.push(type);

  if (parts.length === 0) {
    return '채용공고';
  }

  return `${parts.join(' ')} 채용공고`;
}