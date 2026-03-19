import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import LoginSelectContent from '@/features/auth/components/LoginSelectContent';

export const metadata: Metadata = createMetadata({
  title: '로그인',
  description: '워크인코리아 로그인 페이지입니다. 개인회원 또는 기업회원으로 로그인하세요.',
});

export default async function LoginSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <LoginSelectContent callbackUrl={callbackUrl} />;
}
