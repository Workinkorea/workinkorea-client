'use client';

import { cn } from '@/shared/lib/utils/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

interface LanguageToggleProps {
  className?: string;
  /** light: 흰 배경 헤더용 (기본), dark: 다크 네이비 헤더용 */
  variant?: 'light' | 'dark';
}

export function LanguageToggle({ className, variant = 'light' }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (lang: 'ko' | 'en') => {
    if (lang === locale || isPending) return;
    document.cookie = `locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => { router.refresh(); });
  };

  const containerCls = variant === 'dark'
    ? 'border-slate-600 bg-transparent'
    : 'border-slate-200 bg-white';

  const activeCls = 'bg-blue-600 text-white';

  const inactiveCls = variant === 'dark'
    ? 'text-slate-400 hover:text-slate-200'
    : 'text-slate-500 hover:text-slate-700';

  return (
    <div className={cn('flex items-center rounded-full border p-0.5 gap-0.5 overflow-hidden', containerCls, className)}>
      {(['ko', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          disabled={isPending}
          aria-label={lang === 'ko' ? '한국어로 변경' : 'Switch to English'}
          className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer select-none uppercase',
            locale === lang ? activeCls : inactiveCls,
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
