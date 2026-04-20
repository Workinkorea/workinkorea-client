import { Suspense } from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import HeroSection from '@/features/landing/components/sections/HeroSection';
import { OnboardingSection } from '@/features/landing/components/sections/OnboardingSection';
import Footer from '@/features/landing/components/sections/Footer';
import { BetaPopup } from '@/shared/components/BetaPopup';
import { HeroSectionSkeleton } from '@/shared/ui/SkeletonCards';

export const metadata: Metadata = createMetadata({
  title: '글로벌 인재 매칭 플랫폼 | 검증된 외국인 채용',
  description: '워크인코리아 ICT 검증센터 모델을 기반으로, 한국 기업과 사전 검증된 우수 외국인 인재를 직접 연결하는 신뢰도 높은 채용 매칭 플랫폼입니다.',
});

export default function MainPage() {
  return (
    <>
      <BetaPopup />
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <OnboardingSection />
      <Footer />
    </>
  );
}
