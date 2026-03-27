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
    container:    'bg-status-info-bg border border-primary-200',
    iconColor:    'text-status-info',
    titleColor:   'text-primary-800',
    bodyColor:    'text-primary-700',
    dismissColor: 'text-primary-400 hover:text-primary-600',
    DefaultIcon:  Info,
  },
  warning: {
    container:    'bg-status-caution-bg border border-status-caution-bg',
    iconColor:    'text-status-caution',
    titleColor:   'text-label-800',
    bodyColor:    'text-label-700',
    dismissColor: 'text-label-400 hover:text-label-600',
    DefaultIcon:  AlertTriangle,
  },
  error: {
    container:    'bg-status-error-bg border border-status-error-bg',
    iconColor:    'text-status-error',
    titleColor:   'text-label-800',
    bodyColor:    'text-label-700',
    dismissColor: 'text-label-400 hover:text-label-600',
    DefaultIcon:  XCircle,
  },
  success: {
    container:    'bg-status-correct-bg border border-status-correct-bg',
    iconColor:    'text-status-correct',
    titleColor:   'text-label-800',
    bodyColor:    'text-label-700',
    dismissColor: 'text-label-400 hover:text-label-600',
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
