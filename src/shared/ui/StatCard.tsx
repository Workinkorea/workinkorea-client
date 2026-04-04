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
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      value: 'text-primary-700',
      border: 'border-primary-100'
    },
    secondary: {
      bg: 'bg-label-100',
      icon: 'text-label-500',
      value: 'text-label-700',
      border: 'border-line-400'
    },
    success: {
      bg: 'bg-status-correct-bg',
      icon: 'text-status-correct',
      value: 'text-status-correct',
      border: 'border-status-correct-bg'
    },
    warning: {
      bg: 'bg-status-caution-bg',
      icon: 'text-status-caution',
      value: 'text-status-caution',
      border: 'border-status-caution-bg'
    },
    danger: {
      bg: 'bg-status-error-bg',
      icon: 'text-status-error',
      value: 'text-status-error',
      border: 'border-status-error-bg'
    },
    neutral: {
      bg: 'bg-label-100',
      icon: 'text-label-400',
      value: 'text-label-600',
      border: 'border-line-400'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:border-primary-200',
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
          <h3 className="text-caption-1 text-label-500 font-medium mb-1">
            {title}
          </h3>

          {/* 값 */}
          <div className={cn('text-title-4 font-bold mb-1', scheme.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>

          {/* 부제목 */}
          {subtitle && (
            <p className="text-caption-3 text-label-500">
              {subtitle}
            </p>
          )}

          {/* 트렌드 */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-caption-3 font-medium',
                trend.isPositive ? 'text-status-correct' : 'text-status-error'
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