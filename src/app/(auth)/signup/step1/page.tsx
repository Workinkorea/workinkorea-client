import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import SignupStep1 from "@/components/signup/SignupStep1";

export const metadata: Metadata = createMetadata({
  title: '개인 회원가입 1단계',
  description: '워크인코리아 개인회원 가입을 시작하세요. 한국 취업 기회를 찾고 꿈을 이루어보세요.',
});

export default function SignupStep1Page() {
  return (
    <SignupStep1 />
  )
};