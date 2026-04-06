import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { redirect } from 'next/navigation';

export const metadata: Metadata = createMetadata({
  title: '기업회원 가입 - 정보 입력',
  description: '워크인코리아 기업회원 가입 2단계: 기업 정보를 입력하세요.',
  noIndex: true,
});

export default function SignupStep2Page() {
  redirect('/company-signup/step1');
}
