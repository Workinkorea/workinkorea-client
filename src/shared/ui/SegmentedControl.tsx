'use client';

import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/utils';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1 text-caption-1',
  md: 'px-4 py-1.5 text-body-3',
  lg: 'px-5 py-2 text-body-2',
};

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-0.5 p-1 bg-slate-100 rounded-lg',
        fullWidth && 'w-full',
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-md',
              'font-medium transition-all duration-150 cursor-pointer',
              'focus:outline-none',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              sizeStyles[size],
              fullWidth && 'flex-1',
              isActive
                ? 'bg-white text-blue-700 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50',
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
