import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import LoginSelectContent from '@/components/auth/LoginSelectContent';

export const metadata: Metadata = createMetadata({
  title: '로그인',
  description: '워크인코리아 로그인 페이지입니다. 개인회원 또는 기업회원으로 로그인하세요.',
});

export default function LoginSelectPage() {
  return <LoginSelectContent />;
}
