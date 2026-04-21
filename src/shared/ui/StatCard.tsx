'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  className = '',
  delay = 0
}: StatCardProps) {
  // 색상 스키마 (Blue Design System)
  const colorSchemes = {
    primary: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-700',
      border: 'border-blue-100'
    },
    secondary: {
      bg: 'bg-slate-100',
      icon: 'text-slate-500',
      value: 'text-slate-700',
      border: 'border-slate-200'
    },
    success: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-500',
      value: 'text-emerald-500',
      border: 'border-emerald-100'
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'text-amber-500',
      value: 'text-amber-500',
      border: 'border-amber-200'
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-500',
      value: 'text-red-500',
      border: 'border-red-200'
    },
    neutral: {
      bg: 'bg-slate-100',
      icon: 'text-slate-400',
      value: 'text-slate-600',
      border: 'border-slate-200'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:border-blue-200',
        scheme.border,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 제목 */}
          <h3 className="text-caption-1 text-slate-500 font-medium mb-1">
            {title}
          </h3>

          {/* 값 */}
          <div className={cn('text-title-4 font-bold mb-1', scheme.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>

          {/* 부제목 */}
          {subtitle && (
            <p className="text-caption-3 text-slate-500">
              {subtitle}
            </p>
          )}

          {/* 트렌드 */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-caption-3 font-medium',
                trend.isPositive ? 'text-emerald-500' : 'text-red-500'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}
                {trend.label && ` ${trend.label}`}
              </span>
            </div>
          )}
        </div>

        {/* 아이콘 */}
        {Icon && (
          <motion.div
            className={cn('p-2 rounded-lg', scheme.bg)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.1 }}
          >
            <Icon size={20} className={scheme.icon} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}