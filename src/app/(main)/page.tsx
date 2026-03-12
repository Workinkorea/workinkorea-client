import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import HeroSection from '@/features/landing/components/sections/HeroSection';

export const metadata: Metadata = createMetadata({
  title: '워크인코리아 - 한국 취업의 모든 것',
  description: '한국에서 일하고 싶은 외국인과 외국인을 채용하고 싶은 기업을 연결하는 플랫폼입니다.',
});
import ServicesSection from '@/features/landing/components/sections/ServicesSection';
import JobCategoriesSection from '@/features/landing/components/sections/JobCategoriesSection';
import PopularJobsSection from '@/features/landing/components/sections/PopularJobsSection';
import EventBannerSection from '@/features/landing/components/sections/EventBannerSection';
import CTASection from '@/features/landing/components/sections/CTASection';
import Footer from '@/features/landing/components/sections/Footer';

export default function MainPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <JobCategoriesSection />
      <PopularJobsSection />
      <EventBannerSection />
      <CTASection />
      <Footer />
    </>
  );
}
