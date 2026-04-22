import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

/**
 * Server Component 의 generateMetadata 에서 사용하는 i18n 메타 헬퍼.
 *
 * @example
 * ```ts
 * // app/(main)/jobs/page.tsx
 * export async function generateMetadata() {
 *   return getPageMetadata('jobs');
 * }
 * ```
 */
export async function getPageMetadata(key: string): Promise<Metadata> {
  const t = await getTranslations('meta');
  return {
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  };
}
