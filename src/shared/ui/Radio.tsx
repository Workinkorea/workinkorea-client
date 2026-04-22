'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils/utils';

// ─── 단일 Radio ──────────────────────────────────────────────────
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
}

const sizeStyles = {
  sm: { outer: 'w-4 h-4', inner: 'w-2 h-2', label: 'text-caption-1', desc: 'text-caption-2' },
  md: { outer: 'w-5 h-5', inner: 'w-2.5 h-2.5', label: 'text-body-3', desc: 'text-caption-1' },
  lg: { outer: 'w-6 h-6', inner: 'w-3 h-3', label: 'text-body-2', desc: 'text-body-3' },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, description, size = 'md', error, disabled, checked, className, ...rest },
    ref,
  ) => {
    const { outer, inner, label: labelCls, desc: descCls } = sizeStyles[size];

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <input
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            className="sr-only"
            {...rest}
          />

          {/* 커스텀 라디오 */}
          <span
            className={cn(
              'inline-flex items-center justify-center shrink-0 rounded-full mt-0.5',
              'border-2 transition-colors duration-150',
              outer,
              checked
                ? 'border-blue-600 bg-white'
                : 'border-slate-200 bg-white hover:border-blue-400',
              error && !checked && 'border-red-500',
              disabled && 'bg-slate-100 border-slate-300',
            )}
            aria-hidden
          >
            {checked && (
              <span
                className={cn(
                  'rounded-full transition-transform duration-150',
                  inner,
                  disabled ? 'bg-slate-300' : 'bg-blue-600',
                )}
              />
            )}
          </span>

          {(label || description) && (
            <span className="flex flex-col gap-0.5">
              {label && (
                <span className={cn(labelCls, 'font-medium text-slate-800', disabled && 'text-slate-400')}>
                  {label}
                </span>
              )}
              {description && (
                <span className={cn(descCls, 'text-slate-500')}>{description}</span>
              )}
            </span>
          )}
        </label>

        {error && (
          <p role="alert" className="text-caption-2 text-red-500 pl-7">{error}</p>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';

// ─── Radio Group ─────────────────────────────────────────────────
export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: RadioProps['size'];
  layout?: 'vertical' | 'horizontal';
  error?: string;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  size = 'md',
  layout = 'vertical',
  error,
  className,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3',
        className,
      )}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          description={opt.description}
          checked={value === opt.value}
          disabled={opt.disabled}
          size={size}
          onChange={() => onChange?.(opt.value)}
        />
      ))}
      {error && (
        <p role="alert" className="text-caption-2 text-red-500">{error}</p>
      )}
    </div>
  );
}

RadioGroup.displayName = 'RadioGroup';
