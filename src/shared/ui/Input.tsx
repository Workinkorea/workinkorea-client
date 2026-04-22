'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { motion, useAnimation } from 'framer-motion';

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
    const controls = useAnimation();
    const prevError = useRef(error);

    useEffect(() => {
      if (error && !prevError.current) {
        controls.start({
          x: [0, -5, 5, -5, 5, -3, 3, 0],
          transition: { duration: 0.4, ease: 'easeInOut' },
        });
      }
      prevError.current = error;
    }, [error, controls]);

    const inputType = variant === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    const wrapperClasses = cn(
      "flex items-center border rounded-lg bg-white transition-colors",
      error && "border-red-500 focus-within:border-red-500 focus-within:ring-[3px] focus-within:ring-red-50",
      success && "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-[3px] focus-within:ring-emerald-100",
      !error && !success && "border-slate-200 focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-100",
      className
    );

    const inputClasses = "flex-1 min-w-0 px-3.5 py-2.5 text-body-3 text-slate-800 font-sans bg-transparent outline-none placeholder:text-slate-400";

    // null 값을 빈 문자열로 변환하여 controlled input 오류 방지
    const safeValue = value === null ? '' : value;

    return (
      <motion.div className={wrapperClasses} animate={controls}>
        <input
          type={inputType}
          className={inputClasses}
          ref={ref}
          value={safeValue}
          aria-invalid={error || undefined}
          {...props}
        />

        {variant === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="px-3 shrink-0 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {rightElement && variant !== 'password' && (
          <div className="px-3 shrink-0">
            {rightElement}
          </div>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";
