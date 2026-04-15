'use client';

import Link from 'next/link';
import { User, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

interface LoginSelectContentProps {
  callbackUrl?: string;
}

export default function LoginSelectContent({ callbackUrl }: LoginSelectContentProps) {
  const t = useTranslations('auth.loginSelect');

  const qs = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : '';
  const signupHref = callbackUrl
    ? `/signup-select?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/signup-select';

  const loginOptions = [
    {
      href: `/login${qs}`,
      icon: User,
      title: t('personalMember'),
      description: t('personalMemberDesc'),
    },
    {
      href: `/company-login${qs}`,
      icon: Building2,
      title: t('companyMember'),
      description: t('companyMemberDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 헤더 */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-14">
          <h1 className="text-title-2 sm:text-title-1 lg:text-display-2 font-black text-label-900 leading-tight tracking-tight mb-3 sm:mb-4">
            {t('memberTypeTitle')}
          </h1>
          <p className="text-body-3 sm:text-body-2 text-label-500 max-w-lg mx-auto">
            {t('memberTypeDesc')}
          </p>
        </motion.div>

        {/* 카드 그리드 */}
        <motion.div
          variants={containerVariants}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12"
        >
          {loginOptions.map(({ href, icon: Icon, title, description }) => (
            <motion.div key={href} variants={cardVariants}>
              <Link href={href}>
                <motion.div
                  className="group relative h-full border-2 border-line-400 rounded-2xl p-6 sm:p-8 bg-white cursor-pointer transition-all overflow-hidden"
                  whileHover={{
                    borderColor: '#425AD5',
                    backgroundColor: '#F3F6FF',
                    y: -4,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* 배경 그라데이션 (호버 시 표시) */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* 아이콘 */}
                    <div className="mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                        <Icon className="w-7 h-7 text-primary-600" />
                      </div>
                    </div>

                    {/* 텍스트 */}
                    <div className="flex-1 mb-6">
                      <h2 className="text-title-4 font-bold text-label-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {title}
                      </h2>
                      <p className="text-caption-1 text-label-500 group-hover:text-label-600 transition-colors">
                        {description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold text-body-3 gap-2 transition-colors">
                      <span>{t('loginButton')}</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 회원가입 링크 */}
        <motion.div variants={itemVariants} className="text-center pt-6 sm:pt-8 border-t border-line-400">
          <p className="text-body-3 text-label-600">
            {t('notMemberYet')}{' '}
            <Link href={signupHref} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              {t('signupButton')}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
