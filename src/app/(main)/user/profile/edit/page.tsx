import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import ProfileEditClient from '@/components/pages/ProfileEditClient';

// 메타데이터
export const metadata: Metadata = createMetadata({
  title: '프로필 편집 - WorkInKorea',
  description: '개인 정보, 스킬, 경력 등을 수정하여 프로필을 최신 상태로 유지하세요.',
  noIndex: true, // 편집 페이지는 검색엔진에서 제외
});

export default function ProfileEditPage() {
  return <ProfileEditClient />;
}