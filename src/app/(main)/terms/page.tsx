import { TERMS_OF_SERVICE } from '@/shared/constants/terms';
import { MarkdownContent } from '@/shared/ui/MarkdownContent';
import { getPageMetadata } from '@/shared/lib/i18n/getPageMetadata';

export async function generateMetadata() {
  return getPageMetadata('terms');
}

export default function TermsPage() {
  return (
    <main>
      <MarkdownContent>{TERMS_OF_SERVICE}</MarkdownContent>
    </main>
  );
}
