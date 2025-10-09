import { Suspense, lazy } from 'react';
import { OptimizedImageProps } from './OptimizedImage';

// 이미지 컴포넌트를 동적으로 로드
const OptimizedImage = lazy(() => import('./OptimizedImage'));

interface LazyImageProps extends OptimizedImageProps {
  showSkeleton?: boolean;
}

function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      aria-label="이미지 로딩 중"
    />
  );
}

export default function LazyImage({
  showSkeleton = true,
  className,
  ...props
}: LazyImageProps) {
  return (
    <Suspense
      fallback={showSkeleton ? <ImageSkeleton className={className} /> : null}
    >
      <OptimizedImage className={className} {...props} />
    </Suspense>
  );
}