import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
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

const Input = forwardRef<HTMLInputElement, InputProps>(
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

    const baseClasses = "w-full border rounded-lg text-caption-2 px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:border-transparent";

    const variantClasses = {
      default: "border-line-400 focus:ring-primary",
      password: "border-line-400 focus:ring-primary pr-10"
    };

    const stateClasses = cn(
      error && "border-red-500 focus:ring-red-500",
      success && "border-green-500 focus:ring-green-500"
    );

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      stateClasses,
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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

export default Input;