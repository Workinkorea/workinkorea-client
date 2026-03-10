import { TERMS_OF_SERVICE } from '@/shared/constants/terms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | Work in Korea',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">이용약관</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {TERMS_OF_SERVICE}
      </div>
    </main>
  );
}
