import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createMetadata } from '@/shared/lib/metadata';
import { FaqAccordion } from './FaqAccordion';

export const metadata: Metadata = createMetadata({
  title: '자주 묻는 질문',
  description: '워크인코리아 자주 묻는 질문(FAQ)입니다. 서비스 이용 방법, 채용 절차, 비자 관련 문의를 확인하세요.',
});

export default async function FaqPage() {
  const t = await getTranslations('faq');

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-title-1 font-bold text-slate-900 mb-8">{t('pageTitle')}</h1>
      <FaqAccordion />
    </main>
  );
}
