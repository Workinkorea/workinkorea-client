import { ReactNode } from 'react';

interface AccessibleIconProps {
  children: ReactNode;
  label?: string;
  isDecorative?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};

export default function AccessibleIcon({
  children,
  label,
  isDecorative = false,
  className = '',
  size = 'md'
}: AccessibleIconProps) {
  const sizeClass = sizeClasses[size];

  // 장식용 아이콘인 경우
  if (isDecorative) {
    return (
      <span
        className={`inline-flex ${sizeClass} ${className}`}
        aria-hidden="true"
        role="presentation"
      >
        {children}
      </span>
    );
  }

  // 의미가 있는 아이콘인 경우
  return (
    <span
      className={`inline-flex ${sizeClass} ${className}`}
      role="img"
      aria-label={label}
      title={label}
    >
      {children}
    </span>
  );
}

// 자주 사용되는 아이콘들을 위한 유틸리티 컴포넌트
export function SearchIcon({ label = "검색", isDecorative = false, ...props }: Omit<AccessibleIconProps, 'children'>) {
  return (
    <AccessibleIcon label={label} isDecorative={isDecorative} {...props}>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </AccessibleIcon>
  );
}

export function CheckIcon({ label = "체크", isDecorative = false, ...props }: Omit<AccessibleIconProps, 'children'>) {
  return (
    <AccessibleIcon label={label} isDecorative={isDecorative} {...props}>
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </AccessibleIcon>
  );
}

export function GoogleIcon({ label = "구글", isDecorative = false, ...props }: Omit<AccessibleIconProps, 'children'>) {
  return (
    <AccessibleIcon label={label} isDecorative={isDecorative} {...props}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    </AccessibleIcon>
  );
}