import { PRIVACY_POLICY } from '@/shared/constants/terms';
import { MarkdownContent } from '@/shared/ui/MarkdownContent';
import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('privacy');
}

export default function PrivacyPage() {
  return (
    <main>
      <MarkdownContent>{PRIVACY_POLICY}</MarkdownContent>
    </main>
  );
}
