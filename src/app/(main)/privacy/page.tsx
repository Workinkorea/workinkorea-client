import { PRIVACY_POLICY } from '@/shared/constants/terms';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '개인정보처리방침',
  description: '워크인코리아의 개인정보처리방침입니다. 수집하는 개인정보 항목, 이용 목적 및 보유 기간을 확인하세요.',
});

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
