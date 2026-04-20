import { forwardRef, ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // 접근성 — aria-label 필수
  variant?: 'ghost' | 'outline' | 'filled' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
  loading?: boolean;
}

const variantStyles: Record<NonNullable<IconButtonProps['variant']>, string> = {
  ghost:       'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
  outline:     'text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-200',
  filled:      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  destructive: 'text-red-500 hover:bg-red-600-bg',
};

const sizeStyles: Record<NonNullable<IconButtonProps['size']>, { btn: string; icon: number }> = {
  sm: { btn: 'w-7 h-7',   icon: 14 },
  md: { btn: 'w-9 h-9',   icon: 16 },
  lg: { btn: 'w-11 h-11', icon: 20 },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      variant = 'ghost',
      size = 'md',
      shape = 'square',
      loading = false,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const { btn, icon: iconSize } = sizeStyles[size];

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center shrink-0',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          btn,
          variantStyles[variant],
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span
            className={cn(
              'inline-block rounded-full border-2 border-current border-t-transparent animate-spin',
              size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
            )}
          />
        ) : (
          <Icon size={iconSize} aria-hidden />
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
