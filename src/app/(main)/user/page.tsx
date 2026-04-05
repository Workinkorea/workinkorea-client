import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { redirect } from 'next/navigation';

export const metadata: Metadata = createMetadata({
  title: '마이페이지',
  noIndex: true,
});

export default function UserPage() {
  redirect('/user/profile');
}