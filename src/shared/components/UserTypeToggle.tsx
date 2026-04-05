'use client';

import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export type ViewType = 'personal' | 'company';

interface UserTypeToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
  className?: string;
}

const OPTIONS = [
  { value: 'personal' as ViewType, label: '개인', Icon: User },
  { value: 'company' as ViewType, label: '기업', Icon: Building2 },
];

export function UserTypeToggle({ value, onChange, className }: UserTypeToggleProps) {
  return (
    <div
      className={cn(
        'relative flex items-center border border-slate-200 rounded-full bg-white p-0.5 gap-0.5',
        className
      )}
    >
      {OPTIONS.map(({ value: optValue, label, Icon }) => {
        const isActive = value === optValue;
        return (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            className={cn(
              'relative flex items-center gap-1 px-2.5 py-1 rounded-full text-caption-2 font-semibold transition-colors duration-200 cursor-pointer select-none z-10',
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
            <Icon size={12} className="relative z-10 shrink-0" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
