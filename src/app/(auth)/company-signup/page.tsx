import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import BusinessSignupComponent from '@/features/auth/components/BusinessSignupComponent';

export const metadata: Metadata = createMetadata({
  title: '기업회원 가입',
  description: '워크인코리아 기업회원 가입 페이지입니다. 검증된 외국인 인재를 채용하세요.',
  noIndex: true,
});

export default function CompanySignupPage() {
  return <BusinessSignupComponent />;
}
