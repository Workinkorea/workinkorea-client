import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import MyProfileClient from '@/components/pages/MyProfileClient';

export const metadata: Metadata = createMetadata({
  title: '내 프로필 - WorkInKorea',
  description: '나의 스킬과 경력을 관리하고 분석하세요. 업계 평균과 비교하여 경쟁력을 향상시킬 수 있습니다.',
});

export default function MyProfilePage() {
  return <MyProfileClient />;
}