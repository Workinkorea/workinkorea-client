import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password';
  error?: boolean;
  success?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    type,
    error,
    success,
    showPassword,
    onTogglePassword,
    rightElement,
    value,
    ...props
  }, ref) => {
    const inputType = variant === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    const baseClasses = "w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white font-sans transition-colors focus:outline-none";

    const variantClasses = {
      default: "border-slate-200 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100",
      password: "border-slate-200 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100 pr-10"
    };

    const stateClasses = cn(
      error && "border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-100",
      success && "border-emerald-500 focus:border-emerald-500 focus:ring-[3px] focus:ring-emerald-100"
    );

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      stateClasses,
      "placeholder:text-slate-400",
      className
    );

    // null 값을 빈 문자열로 변환하여 controlled input 오류 방지
    const safeValue = value === null ? '' : value;

    return (
      <div className="relative">
        <input
          type={inputType}
          className={inputClasses}
          ref={ref}
          value={safeValue}
          {...props}
        />

        {variant === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {rightElement && variant !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";