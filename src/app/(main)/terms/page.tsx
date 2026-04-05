import { TERMS_OF_SERVICE } from '@/shared/constants/terms';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: '이용약관',
  description: '워크인코리아 이용약관입니다. 서비스 이용에 관한 권리, 의무 및 책임사항을 확인하세요.',
});

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
