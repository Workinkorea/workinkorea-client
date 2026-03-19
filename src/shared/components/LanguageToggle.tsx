'use client';

import { Globe } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const next = locale === 'ko' ? 'en' : 'ko';
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50',
        'transition-colors cursor-pointer focus:outline-none text-caption-1 font-semibold',
        'border border-slate-200 hover:border-blue-200',
        isPending && 'opacity-60'
      )}
      aria-label="Change language"
      title={locale === 'ko' ? 'Switch to English' : '한국어로 변경'}
    >
      <Globe size={14} className={cn(isPending && 'animate-spin')} />
      <span>{locale === 'ko' ? 'EN' : '한'}</span>
    </button>
  );
}
