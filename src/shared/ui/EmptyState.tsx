import { ReactNode } from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { icon: 32, wrap: 'py-8 px-4', title: 'text-body-3', desc: 'text-caption-1', iconBox: 'w-12 h-12' },
  md: { icon: 40, wrap: 'py-12 px-6', title: 'text-title-5', desc: 'text-body-3', iconBox: 'w-16 h-16' },
  lg: { icon: 48, wrap: 'py-16 px-8', title: 'text-title-4', desc: 'text-body-2', iconBox: 'w-20 h-20' },
};

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const s = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        s.wrap,
        className,
      )}
    >
      {/* 아이콘 */}
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-slate-100 mb-4',
          s.iconBox,
        )}
      >
        <Icon size={s.icon} className="text-slate-400" strokeWidth={1.5} />
      </div>

      {/* 제목 */}
      <p className={cn('font-semibold text-slate-700 mb-2', s.title)}>
        {title}
      </p>

      {/* 설명 */}
      {description && (
        <p className={cn('text-slate-500 mb-6 max-w-sm', s.desc)}>
          {description}
        </p>
      )}

      {/* 액션 */}
      {action && <div>{action}</div>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
