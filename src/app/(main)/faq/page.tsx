import { getTranslations } from 'next-intl/server';
import { FaqAccordion } from './FaqAccordion';
import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('faq');
}

export default async function FaqPage() {
  const t = await getTranslations('faq');

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-title-1 font-bold text-slate-900 mb-8">{t('pageTitle')}</h1>
      <FaqAccordion />
    </main>
  );
}
