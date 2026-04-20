import { TERMS_OF_SERVICE } from '@/shared/constants/terms';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { MarkdownContent } from '@/shared/ui/MarkdownContent';

export const metadata: Metadata = createMetadata({
  title: '이용약관',
  description: '워크인코리아 이용약관입니다. 서비스 이용에 관한 권리, 의무 및 책임사항을 확인하세요.',
});

export default function TermsPage() {
  return (
    <main>
      <MarkdownContent>{TERMS_OF_SERVICE}</MarkdownContent>
    </main>
  );
}
