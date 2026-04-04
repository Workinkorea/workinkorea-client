import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary'     && 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
          variant === 'secondary'   && 'bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100',
          variant === 'outline'     && 'bg-white text-label-600 border border-line-400 hover:bg-label-50',
          variant === 'ghost'       && 'bg-transparent text-label-600 hover:bg-label-100',
          variant === 'destructive' && 'bg-status-error text-white hover:bg-red-600 active:bg-red-700',
          size === 'sm' && 'px-3.5 py-1.5 text-caption-1',
          size === 'md' && 'px-5 py-2.5 text-body-3',
          size === 'lg' && 'px-7 py-3.5 text-body-2',
          size === 'xl' && 'px-9 py-4 text-body-1',
          className,
        )}
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
