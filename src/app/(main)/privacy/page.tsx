import { PRIVACY_POLICY } from '@/shared/constants/terms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | Work in Korea',
};

export default function PrivacyPage() {
  return (
    <main>
      <h1 className="text-title-3 font-bold text-label-900 mb-8">개인정보처리방침</h1>
      <div className="max-w-none text-body-3 text-label-700 whitespace-pre-wrap leading-relaxed">
        {PRIVACY_POLICY}
      </div>
    </main>
  );
}
