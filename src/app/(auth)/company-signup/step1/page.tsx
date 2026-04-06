import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import BusinessSignupComponent from '@/features/auth/components/BusinessSignupComponent';

export const metadata: Metadata = createMetadata({
  title: '기업회원 가입 - 약관 동의',
  description: '워크인코리아 기업회원 가입 1단계: 이용약관에 동의하세요.',
  noIndex: true,
});

export default function SignupStep1Page() {
  return <BusinessSignupComponent />;
}
