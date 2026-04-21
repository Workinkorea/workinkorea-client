import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import UserBookmarksClient from '@/features/jobs/pages/UserBookmarksClient';

export const metadata: Metadata = createMetadata({
  title: '북마크한 채용공고 - WorkInKorea',
  description: '관심 있는 채용공고를 확인하세요.',
});

export default function UserBookmarksPage() {
  return <UserBookmarksClient />;
}
