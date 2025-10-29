import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import SignupSelectContent from '@/components/auth/SignupSelectContent';

export const metadata: Metadata = createMetadata({
  title: '회원가입',
  description: '워크인코리아 회원가입 페이지입니다. 개인회원 또는 기업회원으로 가입하세요.',
});

export default function SignupSelectPage() {
  return <SignupSelectContent />;
}
