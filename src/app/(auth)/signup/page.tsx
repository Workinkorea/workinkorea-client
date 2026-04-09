import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import SignupComponent from "@/features/auth/components/SignupComponent";

export const metadata: Metadata = createMetadata({
  title: '개인회원 가입',
  description: '워크인코리아 개인회원 가입 페이지입니다. 한국 취업 기회를 탐색하고 이력서를 관리하세요.',
  noIndex: true,
});

interface SignupPageProps {
  searchParams: Promise<{
    user_email?: string;
    callbackUrl?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { user_email: userEmail, callbackUrl } = await searchParams;

  return (
    <SignupComponent userEmail={userEmail} callbackUrl={callbackUrl} />
  );
}