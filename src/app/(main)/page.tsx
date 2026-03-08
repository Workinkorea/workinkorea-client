import HeroSection from '@/features/landing/components/sections/HeroSection';
import ServicesSection from '@/features/landing/components/sections/ServicesSection';
import JobCategoriesSection from '@/features/landing/components/sections/JobCategoriesSection';
import PopularJobsSection from '@/features/landing/components/sections/PopularJobsSection';
import CTASection from '@/features/landing/components/sections/CTASection';
import Footer from '@/features/landing/components/sections/Footer';

export default function MainPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <JobCategoriesSection />
      <PopularJobsSection />
      <CTASection />
      <Footer />
    </>
  );
}
