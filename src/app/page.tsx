import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { getServerAuth } from '@/features/auth/lib/server';
import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import HeroSection from '@/features/landing/components/sections/HeroSection';
import Footer from '@/features/landing/components/sections/Footer';

export const metadata: Metadata = createMetadata({
  title: '워크인코리아 - 한국 취업의 모든 것',
  description: '한국에서 일하고 싶은 외국인과 외국인을 채용하고 싶은 기업을 연결하는 플랫폼입니다.',
});

export default async function Home() {
  const auth = await getServerAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderClient type={auth.userType === 'company' ? 'business' : 'homepage'} />

      <main className="flex-1">
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
}
