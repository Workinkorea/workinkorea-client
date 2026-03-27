import { TERMS_OF_SERVICE } from '@/shared/constants/terms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | Work in Korea',
};

export default function TermsPage() {
  return (
    <main>
      <h1 className="text-title-3 font-bold text-label-900 mb-8">이용약관</h1>
      <div className="max-w-none text-body-3 text-label-700 whitespace-pre-wrap leading-relaxed">
        {TERMS_OF_SERVICE}
      </div>
    </main>
  );
}
