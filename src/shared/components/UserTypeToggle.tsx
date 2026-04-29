'use client';

import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

export type ViewType = 'personal' | 'company';

interface UserTypeToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
  disabled?: boolean;
  className?: string;
}

export function UserTypeToggle({ value, onChange, disabled, className }: UserTypeToggleProps) {
  const t = useTranslations('common.nav');

  const options = [
    { value: 'personal' as ViewType, Icon: User, label: t('personal') },
    { value: 'company' as ViewType, Icon: Building2, label: t('company') },
  ];

  return (
    <div
      className={cn(
        'relative flex items-center border border-slate-200 rounded-full bg-white p-0.5 gap-0.5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={disabled ? t('toggleDisabledHint') : undefined}
    >
      {options.map(({ value: optValue, label, Icon }) => {
        const isActive = value === optValue;
        return (
          <button
            key={optValue}
            onClick={() => !disabled && onChange(optValue)}
            disabled={disabled}
            className={cn(
              'relative flex items-center gap-1 px-2.5 py-1 rounded-full text-caption-2 leading-none font-semibold transition-colors duration-200 cursor-pointer select-none z-10',
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'
            )}
            aria-label={`${label} 모드로 전환`}
          >
            {isActive && (
              <motion.span
                layoutId="user-type-bg"
                className="absolute inset-0 bg-blue-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={11} className="relative z-10 shrink-0" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
