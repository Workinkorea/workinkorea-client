import { cn } from '@/shared/lib/utils/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'slate';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-9 h-9 border-[3px]',
};

const colorMap = {
  blue:  'border-blue-200 border-t-primary-600',
  white: 'border-white/30 border-t-white',
  slate: 'border-slate-200 border-t-label-500',
};

export function LoadingSpinner({
  size = 'md',
  color = 'blue',
  label = '로딩 중',
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span
        className={cn(
          'animate-spin rounded-full',
          sizeMap[size],
          colorMap[color],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

LoadingSpinner.displayName = 'LoadingSpinner';
