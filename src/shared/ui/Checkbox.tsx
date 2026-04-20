'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
}

const sizeStyles = {
  sm: { box: 'w-4 h-4 rounded', icon: 10, label: 'text-caption-1', desc: 'text-caption-2' },
  md: { box: 'w-5 h-5 rounded-md', icon: 12, label: 'text-body-3', desc: 'text-caption-1' },
  lg: { box: 'w-6 h-6 rounded-md', icon: 14, label: 'text-body-2', desc: 'text-body-3' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      indeterminate = false,
      size = 'md',
      error,
      disabled,
      checked,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const { box, icon: iconSize, label: labelCls, desc: descCls } = sizeStyles[size];
    const isChecked = checked || indeterminate;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {/* 숨겨진 실제 input */}
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : checked}
            className="sr-only"
            {...rest}
          />

          {/* 커스텀 박스 */}
          <span
            className={cn(
              'inline-flex items-center justify-center shrink-0 mt-0.5',
              'border-2 transition-colors duration-150',
              box,
              isChecked
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-slate-200 hover:border-blue-400',
              error && !isChecked && 'border-red-500',
              disabled && 'bg-slate-100 border-slate-300',
            )}
            aria-hidden
          >
            {indeterminate ? (
              <Minus size={iconSize} className="text-white" strokeWidth={3} />
            ) : checked ? (
              <Check size={iconSize} className="text-white" strokeWidth={3} />
            ) : null}
          </span>

          {/* 텍스트 */}
          {(label || description) && (
            <span className="flex flex-col gap-0.5">
              {label && (
                <span className={cn(labelCls, 'font-medium text-slate-800', disabled && 'text-slate-400')}>
                  {label}
                </span>
              )}
              {description && (
                <span className={cn(descCls, 'text-slate-500')}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && (
          <p className="text-caption-2 text-red-500 pl-7">{error}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
