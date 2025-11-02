import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import UserProfileClient from '@/components/pages/UserProfileClient';

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  
  return createMetadata({
    title: `사용자 프로필 - WorkInKorea`,
    description: '한국 취업을 위한 개인 프로필을 확인하세요. 스킬 분석과 경력 정보를 통해 최적의 매칭을 제공합니다.',
  });
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  
  // ID 유효성 검사
  if (!id || id.length < 1) {
    notFound();
  }

  return <UserProfileClient userId={id} />;
}