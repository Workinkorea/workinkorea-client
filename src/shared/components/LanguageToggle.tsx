'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/shared/lib/utils/utils';

export function LanguageToggle() {
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50',
        'transition-colors cursor-pointer focus:outline-none text-caption-1 font-semibold',
        'border border-slate-200 hover:border-blue-200'
      )}
      aria-label="Change language"
      title={locale === 'ko' ? 'Switch to English' : '한국어로 변경'}
    >
      <Globe size={14} />
      <span>{locale === 'ko' ? 'EN' : '한'}</span>
    </button>
  );
}
