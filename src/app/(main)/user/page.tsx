import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import UserProfileClient from '@/components/pages/UserProfileClient';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `내 프로필 - WorkInKorea`,
    description: '한국 취업을 위한 개인 프로필을 확인하세요. 스킬 분석과 경력 정보를 통해 최적의 매칭을 제공합니다.',
  });
}

export default async function UserProfilePage() {
  return <UserProfileClient />;
}