import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import MainPage from '@/components/main/MainPage';

export const metadata: Metadata = createMetadata({
  title: '워크인코리아 - 한국 취업의 모든 것',
  description: '한국에서 일하고 싶은 외국인과 외국인을 채용하고 싶은 기업을 연결하는 플랫폼입니다. 채용공고 등록, 인재 검색, 지원자 관리까지 한국 취업의 모든 과정을 지원합니다.',
});

export default function Home() {
  return <MainPage />;
}