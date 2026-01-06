import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { getServerAuth } from '@/features/auth/lib/server';
import HeaderClient from '@/shared/components/layout/HeaderClient';
import HeroSection from '@/features/landing/components/sections/HeroSection';
import JobCategoriesSection from '@/features/landing/components/sections/JobCategoriesSection';
import PopularJobsSection from '@/features/landing/components/sections/PopularJobsSection';
import ServicesSection from '@/features/landing/components/sections/ServicesSection';
import CTASection from '@/features/landing/components/sections/CTASection';
import Footer from '@/features/landing/components/sections/Footer';

export const metadata: Metadata = createMetadata({
  title: '워크인코리아 - 한국 취업의 모든 것',
  description: '한국에서 일하고 싶은 외국인과 외국인을 채용하고 싶은 기업을 연결하는 플랫폼입니다. 채용공고 등록, 인재 검색, 지원자 관리까지 한국 취업의 모든 과정을 지원합니다.',
});

export default async function Home() {
  const auth = await getServerAuth();

  return (
    <div className="min-h-screen bg-white">
      <HeaderClient type={auth.userType === 'company' ? 'business' : 'homepage'} />

      <main>
        <HeroSection />
        <JobCategoriesSection />
        <PopularJobsSection />
        <ServicesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}