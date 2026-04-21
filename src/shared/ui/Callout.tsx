import { ReactNode } from 'react';
import { Info, AlertTriangle, XCircle, CheckCircle, X, LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

// ─── 타입 정의 ────────────────────────────────────────────────────
export type CalloutVariant = 'info' | 'warning' | 'error' | 'success';

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  icon?: LucideIcon | false;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  actions?: ReactNode;
}

// ─── 변형별 스타일 맵 ─────────────────────────────────────────────
const variantConfig: Record<
  CalloutVariant,
  {
    container: string;
    iconColor: string;
    titleColor: string;
    bodyColor: string;
    dismissColor: string;
    DefaultIcon: LucideIcon;
  }
> = {
  info: {
    container:    'bg-blue-500-bg border border-blue-200',
    iconColor:    'text-blue-500',
    titleColor:   'text-blue-800',
    bodyColor:    'text-blue-700',
    dismissColor: 'text-blue-400 hover:text-blue-600',
    DefaultIcon:  Info,
  },
  warning: {
    container:    'bg-amber-50 border border-amber-200',
    iconColor:    'text-amber-500',
    titleColor:   'text-slate-800',
    bodyColor:    'text-slate-700',
    dismissColor: 'text-slate-400 hover:text-slate-600',
    DefaultIcon:  AlertTriangle,
  },
  error: {
    container:    'bg-red-50 border border-red-200',
    iconColor:    'text-red-500',
    titleColor:   'text-slate-800',
    bodyColor:    'text-slate-700',
    dismissColor: 'text-slate-400 hover:text-slate-600',
    DefaultIcon:  XCircle,
  },
  success: {
    container:    'bg-emerald-50 border border-emerald-100',
    iconColor:    'text-emerald-500',
    titleColor:   'text-slate-800',
    bodyColor:    'text-slate-700',
    dismissColor: 'text-slate-400 hover:text-slate-600',
    DefaultIcon:  CheckCircle,
  },
};

// ─── Callout 컴포넌트 ─────────────────────────────────────────────
export function Callout({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = false,
  onDismiss,
  className,
  actions,
}: CalloutProps) {
  const config = variantConfig[variant];

  // icon prop이 false면 아이콘 미표시, undefined면 기본 아이콘 사용
  const IconComponent =
    icon === false ? null : icon ?? config.DefaultIcon;

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-lg p-4',
        config.container,
        className,
      )}
    >
      {/* 아이콘 */}
      {IconComponent && (
        <IconComponent
          size={18}
          className={cn('mt-0.5 shrink-0', config.iconColor)}
          aria-hidden
        />
      )}

      {/* 본문 영역 */}
      <div className="flex-1 min-w-0">
        {/* 제목 */}
        {title && (
          <p className={cn('text-body-3 font-semibold mb-1', config.titleColor)}>
            {title}
          </p>
        )}

        {/* 내용 */}
        <div className={cn('text-caption-1', config.bodyColor)}>
          {children}
        </div>

        {/* 액션 버튼 영역 */}
        {actions && (
          <div className="mt-3 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* 닫기 버튼 */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="닫기"
          className={cn(
            'shrink-0 mt-0.5 p-0.5 rounded transition-colors duration-150 cursor-pointer focus:outline-none',
            config.dismissColor,
          )}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

Callout.displayName = 'Callout';

// ─── 편의 variant 컴포넌트 ────────────────────────────────────────
export type CalloutBaseProps = Omit<CalloutProps, 'variant'>;

export function InfoCallout(props: CalloutBaseProps) {
  return <Callout variant="info" {...props} />;
}

export function WarningCallout(props: CalloutBaseProps) {
  return <Callout variant="warning" {...props} />;
}

export function ErrorCallout(props: CalloutBaseProps) {
  return <Callout variant="error" {...props} />;
}

export function SuccessCallout(props: CalloutBaseProps) {
  return <Callout variant="success" {...props} />;
}

InfoCallout.displayName = 'InfoCallout';
WarningCallout.displayName = 'WarningCallout';
ErrorCallout.displayName = 'ErrorCallout';
SuccessCallout.displayName = 'SuccessCallout';
