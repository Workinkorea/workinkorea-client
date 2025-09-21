import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import LoginContent from "@/components/login/LoginContent";

export const metadata: Metadata = createMetadata({
  title: '개인 로그인',
  description: '워크인코리아 개인회원 로그인 페이지입니다. 한국 취업 기회를 찾고 이력서를 관리하세요.',
});

export default function Login () {
  return (
    <LoginContent />
  )
}