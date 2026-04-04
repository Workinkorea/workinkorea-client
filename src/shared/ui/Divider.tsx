import { cn } from '@/shared/lib/utils/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: string;
  labelAlign?: 'left' | 'center' | 'right';
  className?: string;
  thickness?: 'thin' | 'normal' | 'thick';
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  labelAlign = 'center',
  className,
  thickness = 'thin',
}: DividerProps) {
  const variantStyle = {
    solid:  'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const thicknessStyle = {
    thin:   'border-t',
    normal: 'border-t-2',
    thick:  'border-t-4',
  };

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'inline-block self-stretch border-l border-line-400',
          variantStyle[variant],
          className,
        )}
      />
    );
  }

  // 라벨 없는 기본 수평 구분선
  if (!label) {
    return (
      <hr
        role="separator"
        className={cn(
          'w-full border-0 border-line-400',
          thicknessStyle[thickness],
          variantStyle[variant],
          className,
        )}
      />
    );
  }

  // 라벨 있는 구분선
  const labelAlignStyle = {
    left:   'justify-start',
    center: 'justify-center',
    right:  'justify-end',
  };

  return (
    <div
      role="separator"
      className={cn('flex items-center gap-3', labelAlignStyle[labelAlign], className)}
    >
      {labelAlign !== 'left' && (
        <hr className={cn('flex-1 border-0 border-line-400', thicknessStyle[thickness], variantStyle[variant])} />
      )}
      <span className="text-caption-1 text-label-400 whitespace-nowrap shrink-0 px-1">
        {label}
      </span>
      {labelAlign !== 'right' && (
        <hr className={cn('flex-1 border-0 border-line-400', thicknessStyle[thickness], variantStyle[variant])} />
      )}
    </div>
  );
}

Divider.displayName = 'Divider';
