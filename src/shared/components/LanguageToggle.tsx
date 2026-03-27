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
    ? 'border-slate-600'
    : 'border-slate-200';

  const activeCls = variant === 'dark'
    ? 'bg-slate-50 text-slate-900'
    : 'bg-slate-800 text-slate-50';

  const inactiveCls = variant === 'dark'
    ? 'text-slate-400 hover:text-slate-200'
    : 'bg-white text-slate-400 hover:text-slate-600';

  return (
    <div className={cn('flex items-center rounded-full border overflow-hidden', containerCls, className)}>
      <button
        onClick={() => switchTo('ko')}
        disabled={isPending}
        aria-label="한국어로 변경"
        className={cn(
          'flex items-center gap-1 px-2.5 py-1 text-caption-2 font-semibold transition-colors cursor-pointer select-none',
          locale === 'ko' ? activeCls : inactiveCls,
        )}
      >
        🇰🇷 KO
      </button>
      <button
        onClick={() => switchTo('en')}
        disabled={isPending}
        aria-label="Switch to English"
        className={cn(
          'flex items-center gap-1 px-2.5 py-1 text-caption-2 font-semibold transition-colors cursor-pointer select-none',
          locale === 'en' ? activeCls : inactiveCls,
        )}
      >
        🌐 EN
      </button>
    </div>
  );
}
