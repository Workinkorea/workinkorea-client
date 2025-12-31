import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import { getServerAuth } from '@/lib/auth/server';
import HeaderClient from '@/components/layout/HeaderClient';
import HeroSection from '@/components/main/sections/HeroSection';
import JobCategoriesSection from '@/components/main/sections/JobCategoriesSection';
import PopularJobsSection from '@/components/main/sections/PopularJobsSection';
import ServicesSection from '@/components/main/sections/ServicesSection';
import CTASection from '@/components/main/sections/CTASection';
import Footer from '@/components/main/sections/Footer';

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