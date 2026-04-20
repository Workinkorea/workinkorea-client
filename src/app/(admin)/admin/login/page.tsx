import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { AdminLoginClient } from './AdminLoginClient';

export const metadata: Metadata = createMetadata({
  title: '관리자 로그인',
  description: 'WorkInKorea 관리자 전용 로그인 페이지입니다.',
});

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
