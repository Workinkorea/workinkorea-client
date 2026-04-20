import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/utils';

// ─── 기본 Card ────────────────────────────────────────────────────
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  asChild?: boolean;
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default:  'bg-white border border-slate-200 shadow-sm',
  elevated: 'bg-white shadow-md border border-slate-200',
  outlined: 'bg-white border-2 border-slate-200',
  ghost:    'bg-slate-50',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'hover:shadow-md hover:border-blue-200 transition-all duration-200',
        clickable && 'cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';

// ─── 서브컴포넌트 ─────────────────────────────────────────────────
export function CardHeader({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 pb-4 border-b border-slate-100', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-title-5 font-semibold text-slate-900', className)}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-caption-1 text-slate-500', className)}
      {...rest}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('pt-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center pt-4 border-t border-slate-100', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  className,
}: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('overflow-hidden -mx-6 -mt-6 mb-4 first:-mt-6', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardImage.displayName = 'CardImage';
