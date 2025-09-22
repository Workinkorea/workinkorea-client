import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import CompanyLoginClient from '@/components/pages/CompanyLoginClient';

export const metadata: Metadata = createMetadata({
  title: '기업 로그인',
  description: '워크인코리아 기업회원 로그인 페이지입니다. 우수한 인재를 채용하고 채용공고를 관리하세요.',
});

export default function BusinessLogin() {
  return <CompanyLoginClient />;
}