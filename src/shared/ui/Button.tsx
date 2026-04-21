import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const inlineColor = variant === 'primary' || variant === 'destructive' ? '#ffffff' : undefined;
    const mergedStyle = inlineColor ? { color: inlineColor, ...style } : style;
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary'     && 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
          variant === 'secondary'   && 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100',
          variant === 'outline'     && 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
          variant === 'ghost'       && 'bg-transparent text-slate-600 hover:bg-slate-100',
          variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
          size === 'sm' && 'px-3.5 py-1.5 text-caption-1',
          size === 'md' && 'px-5 py-2.5 text-body-3',
          size === 'lg' && 'px-7 py-3.5 text-body-2',
          size === 'xl' && 'px-9 py-4 text-body-1',
          className,
        )}
        style={mergedStyle}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
