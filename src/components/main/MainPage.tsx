'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import HeroSection from './sections/HeroSection';
import JobCategoriesSection from './sections/JobCategoriesSection';
import PopularJobsSection from './sections/PopularJobsSection';
import ServicesSection from './sections/ServicesSection';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [headerType, setHeaderType] = useState<'homepage' | 'business'>('homepage');

  const toggleHeaderType = () => {
    setHeaderType(prev => prev === 'homepage' ? 'business' : 'homepage');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        type={headerType}
        onToggleType={toggleHeaderType}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

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