'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from './sections/HeroSection';
import JobCategoriesSection from './sections/JobCategoriesSection';
import PopularJobsSection from './sections/PopularJobsSection';
import ServicesSection from './sections/ServicesSection';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';

export default function MainPage() {
  const [headerType, setHeaderType] = useState<'homepage' | 'business'>('homepage');

  const toggleHeaderType = () => {
    setHeaderType(prev => prev === 'homepage' ? 'business' : 'homepage');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header type={headerType} onToggleType={toggleHeaderType} />

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