import { PRIVACY_POLICY } from '@/shared/constants/terms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | Work in Korea',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">개인정보처리방침</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {PRIVACY_POLICY}
      </div>
    </main>
  );
}
