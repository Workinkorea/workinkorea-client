import { cn } from '@/shared/lib/utils/utils';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
}

export function Skeleton({ className, variant = 'rect', width, height, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rect' && 'rounded-lg',
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
