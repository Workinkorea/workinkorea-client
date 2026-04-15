'use client';

import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

export type ViewType = 'personal' | 'company';

interface UserTypeToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
  className?: string;
}

export function UserTypeToggle({ value, onChange, className }: UserTypeToggleProps) {
  const t = useTranslations('common.nav');

  const options = [
    { value: 'personal' as ViewType, Icon: User, label: t('personal') },
    { value: 'company' as ViewType, Icon: Building2, label: t('company') },
  ];

  return (
    <div
      className={cn(
        'relative flex items-center border border-line-400 rounded-full bg-white p-0.5 gap-0.5',
        className
      )}
    >
      {options.map(({ value: optValue, label, Icon }) => {
        const isActive = value === optValue;
        return (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            className={cn(
              'relative flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors duration-200 cursor-pointer select-none z-10',
              isActive ? 'text-white' : 'text-label-500 hover:text-label-700'
            )}
            aria-label={`${label} 모드로 전환`}
          >
            {isActive && (
              <motion.span
                layoutId="user-type-bg"
                className="absolute inset-0 bg-primary-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={10} className="relative z-10 shrink-0" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
