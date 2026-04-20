import { PRIVACY_POLICY } from '@/shared/constants/terms';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { MarkdownContent } from '@/shared/ui/MarkdownContent';

export const metadata: Metadata = createMetadata({
  title: '개인정보처리방침',
  description: '워크인코리아 개인정보처리방침입니다. 수집하는 개인정보 항목, 이용 목적 및 보유 기간을 확인하세요.',
});

export default function PrivacyPage() {
  return (
    <main>
      <MarkdownContent>{PRIVACY_POLICY}</MarkdownContent>
    </main>
  );
}
