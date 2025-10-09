import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export interface OptimizedImageProps extends Omit<ImageProps, 'alt' | 'className'> {
  alt: string;
  fallbackSrc?: string;
  isDecorative?: boolean;
  context?: 'logo' | 'profile' | 'content' | 'hero' | 'icon';
  className?: string;
}

export default function OptimizedImage({
  alt,
  src,
  fallbackSrc = '/images/placeholder.jpg',
  isDecorative = false,
  context = 'content',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 컨텍스트에 따른 alt 텍스트 개선
  const getOptimizedAlt = (originalAlt: string, context: string) => {
    if (isDecorative) return '';

    const contextPrefixes = {
      logo: '로고: ',
      profile: '프로필 사진: ',
      content: '이미지: ',
      hero: '메인 이미지: ',
      icon: '아이콘: '
    };

    const prefix = contextPrefixes[context as keyof typeof contextPrefixes] || '';

    // 이미 적절한 설명이 있다면 prefix를 추가하지 않음
    if (originalAlt.length > 10 && context !== 'logo') {
      return originalAlt;
    }

    return prefix + originalAlt;
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  const optimizedAlt = getOptimizedAlt(alt, context);

  return (
    <div className={`relative ${className}`}>
      <Image
        {...props}
        src={imgSrc}
        alt={optimizedAlt}
        className={`
          ${isLoading ? 'blur-sm' : 'blur-0'}
          ${hasError ? 'opacity-75' : 'opacity-100'}
          transition-all duration-300 ease-in-out
          ${className}
        `}
        onLoad={handleLoad}
        onError={handleError}
        loading={props.priority ? undefined : 'lazy'}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          이미지 로딩 실패
        </div>
      )}
    </div>
  );
}