'use client';

import Link from 'next/link';
import { FileText, Target, Briefcase } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '@/shared/stores/authStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const onboardingCards = [
  {
    id: 'resume',
    title: '이력서 작성',
    description: '나만의 이력서를 작성하고 기업에게 어필하세요.',
    icon: FileText,
    href: '/user/resume/create',
    cta: '이력서 작성하기',
  },
  {
    id: 'diagnosis',
    title: '자가진단 5분',
    description: '간단한 진단으로 나에게 맞는 직무를 찾아보세요.',
    icon: Target,
    href: '/diagnosis',
    cta: '진단 시작하기',
  },
  {
    id: 'jobs',
    title: '공고 둘러보기',
    description: '지금 채용 중인 다양한 공고를 확인해 보세요.',
    icon: Briefcase,
    href: '/jobs',
    cta: '공고 보러가기',
  },
];

export function OnboardingSection() {
  const { isAuthenticated, isLoading } = useAuth();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // 로딩 중이거나 비인증 사용자는 렌더링하지 않음
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <section ref={ref} className="bg-white py-12 sm:py-16">
      <div className="page-container">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-title-3 sm:text-title-2 font-bold text-slate-900 mb-2">
            어디서부터 시작할지 고민이라면?
          </h2>
          <p className="text-body-2 text-slate-500">
            아래 3가지 중 하나를 선택해 시작해 보세요.
          </p>
        </motion.div>

        {/* CTA 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {onboardingCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <motion.div key={card.id} variants={cardVariants}>
                <Link
                  href={card.href}
                  className="group block rounded-xl bg-blue-50 border border-blue-100 p-6 transition-all duration-200 hover:shadow-md hover:border-blue-200"
                >
                  {/* 아이콘 */}
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-blue-100">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* 텍스트 */}
                  <h3 className="text-title-3 font-semibold text-slate-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-body-2 text-slate-500 mb-4">
                    {card.description}
                  </p>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-1 text-body-2 font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                    {card.cta}
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
                    >
                      &rarr;
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
