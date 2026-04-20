import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

// ─── 공통 색상 타입 ───────────────────────────────────────────────
type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

const colorMap: Record<BadgeColor, string> = {
  primary:   'bg-blue-50 text-blue-700 border-blue-200',
  secondary: 'bg-slate-100 text-slate-600 border-slate-200',
  success:   'bg-emerald-500-bg text-emerald-500 border-emerald-500-bg',
  warning:   'bg-amber-500-bg text-amber-500 border-amber-500-bg',
  danger:    'bg-red-500-bg text-red-500 border-red-500-bg',
  neutral:   'bg-slate-100 text-slate-500 border-slate-200',
};

const dotColorMap: Record<BadgeColor, string> = {
  primary:   'bg-blue-600',
  secondary: 'bg-slate-400',
  success:   'bg-emerald-500',
  warning:   'bg-amber-500',
  danger:    'bg-red-500',
  neutral:   'bg-slate-300',
};

// ─── 1. Content Badge (텍스트 + 아이콘) ──────────────────────────
export interface ContentBadgeProps {
  label: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  color?: BadgeColor;
  size?: 'sm' | 'md';
  rounded?: boolean;
  className?: string;
}

export function Badge({
  label,
  icon: Icon,
  iconPosition = 'left',
  color = 'primary',
  size = 'md',
  rounded = false,
  className,
}: ContentBadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-caption-2 gap-1',
    md: 'px-2.5 py-1 text-caption-1 gap-1.5',
  };

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium',
        rounded ? 'rounded-full' : 'rounded-md',
        sizeStyles[size],
        colorMap[color],
        className,
      )}
    >
      {Icon && iconPosition === 'left' && (
        <Icon size={iconSize} className="shrink-0" />
      )}
      <span>{label}</span>
      {Icon && iconPosition === 'right' && (
        <Icon size={iconSize} className="shrink-0" />
      )}
    </span>
  );
}

Badge.displayName = 'Badge';

// ─── 2. Numeric Badge (원형 숫자 뱃지) ───────────────────────────
export interface NumericBadgeProps {
  count: number;
  max?: number;
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NumericBadge({
  count,
  max = 99,
  color = 'danger',
  size = 'md',
  className,
}: NumericBadgeProps) {
  const display = count > max ? `${max}+` : String(count);
  const isWide = display.length > 2;

  const sizeStyles = {
    sm: cn('min-w-[16px] h-4 text-caption-3', isWide ? 'px-1 rounded-full' : 'rounded-full'),
    md: cn('min-w-[20px] h-5 text-caption-2', isWide ? 'px-1.5 rounded-full' : 'rounded-full'),
    lg: cn('min-w-[24px] h-6 text-caption-1', isWide ? 'px-2 rounded-full' : 'rounded-full'),
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-semibold border',
        sizeStyles[size],
        colorMap[color],
        className,
      )}
    >
      {display}
    </span>
  );
}

NumericBadge.displayName = 'NumericBadge';

// ─── 3. Dot Badge (상태 점 뱃지) ─────────────────────────────────
export interface DotBadgeProps {
  color?: BadgeColor;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function DotBadge({
  color = 'success',
  label,
  size = 'md',
  pulse = false,
  className,
}: DotBadgeProps) {
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="relative flex shrink-0">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColorMap[color],
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full',
            dotSize[size],
            dotColorMap[color],
          )}
        />
      </span>
      {label && (
        <span className="text-caption-1 text-slate-600 font-medium">{label}</span>
      )}
    </span>
  );
}

DotBadge.displayName = 'DotBadge';

// ─── 4. Indicator Badge (아이콘/아바타 위에 오버레이되는 뱃지) ──
export interface IndicatorBadgeProps {
  count?: number;
  dot?: boolean;
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}

export function IndicatorBadge({
  count,
  dot = false,
  color = 'danger',
  children,
  className,
}: IndicatorBadgeProps) {
  const showBadge = dot || (count !== undefined && count > 0);

  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      {showBadge && (
        dot ? (
          <span
            className={cn(
              'absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
              dotColorMap[color],
            )}
          />
        ) : (
          <NumericBadge
            count={count!}
            color={color}
            size="sm"
            className="absolute -top-1.5 -right-1.5"
          />
        )
      )}
    </span>
  );
}

IndicatorBadge.displayName = 'IndicatorBadge';
