'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleIcon } from '@/shared/ui/AccessibleIcon';
import { Divider } from '@/shared/ui/Divider';
import { API_BASE_URL } from '@/shared/api/fetchClient';
import { saveCallbackUrl } from '@/shared/lib/callbackUrl';
import { useTranslations } from 'next-intl';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

interface LoginContentProps {
  callbackUrl?: string;
  error?: string;
  signup?: string;
}

export default function LoginContent({ callbackUrl, error, signup }: LoginContentProps) {
  const t = useTranslations('auth.login');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const features = [
    t('leftFeature1'),
    t('leftFeature2'),
    t('leftFeature3'),
  ];

  const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: t('oauthFailed'),
    account_not_found: t('oauthAccountNotFound'),
    email_exists: t('oauthEmailExists'),
    suspended: t('oauthSuspended'),
    unknown: t('oauthUnknown'),
  };

  const errorMessage = error ? (OAUTH_ERROR_MESSAGES[error] ?? OAUTH_ERROR_MESSAGES.unknown) : null;

  const handleGoogleLogin = () => {
    // OAuth 외부 도메인 이동 전에 callbackUrl을 sessionStorage에 보존
    if (callbackUrl) {
      saveCallbackUrl(callbackUrl);
    }
    setIsGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/api/auth/login/google`;
  };

  const companyLoginHref = callbackUrl
    ? `/company-login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/company-login';

  const signupHref = callbackUrl
    ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '/signup';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1">
      {/* 좌측 패널 - 데스크탑만 표시 */}
      <motion.div
        className="hidden lg:flex flex-1 bg-linear-to-br from-primary-400 to-primary-600 flex-col justify-center items-center relative px-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 장식 원 */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/4 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/6 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md text-center">
          {/* 배지 */}
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/12 backdrop-blur-[10px] border border-white/15"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-caption-1 font-semibold text-primary-200">{t('leftBadge')}</span>
          </motion.div>

          {/* 타이틀 */}
          <motion.h2
            className="text-display-2 font-black text-white leading-tight mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('leftTitle').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </motion.h2>

          {/* 기능 리스트 */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-primary-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-body-3 font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>

      {/* 우측 폼 */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 sm:py-0">
        <motion.div
          className="max-w-sm w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 모바일 로고 */}
          <motion.div variants={itemVariants} className="mb-8 lg:hidden">
            <p className="font-['Plus_Jakarta_Sans'] text-title-3 font-extrabold text-primary-600">
              Work In Korea
            </p>
          </motion.div>

          {/* 타이틀 */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-title-2 sm:text-title-1 font-black text-label-900 mb-2 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-body-3 text-label-500">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* 회원가입 성공 배너 */}
          {signup === 'success' && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-2.5 px-4 py-3 mb-6 rounded-lg bg-green-50 border border-green-200 text-caption-1 font-medium text-green-700"
              role="status"
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              <span>{t('signupSuccess')}</span>
            </motion.div>
          )}

          {/* 에러 배너 */}
          {errorMessage && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-2.5 px-4 py-3 mb-6 rounded-lg bg-status-error-bg border border-status-error-bg text-caption-1 font-medium text-status-error"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Google 버튼 */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-5 border-2 border-line-400 rounded-xl font-semibold text-body-1 text-label-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ borderColor: '#7B8EF2', backgroundColor: '#F3F6FF', scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Google 계정으로 로그인"
            >
              <GoogleIcon label="Google 로고" size="md" />
              <span>{isGoogleLoading ? t('loggingInGoogle') : t('googleStart')}</span>
            </motion.button>

            {/* 구분선 */}
            <Divider label={t('divider')} className="py-2" />

            {/* 기업 로그인 */}
            <motion.a
              href={companyLoginHref}
              className="block w-full py-3.5 px-5 text-center border-2 border-line-400 text-label-700 rounded-xl font-semibold text-body-1 hover:bg-label-50 hover:border-line-400 transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('companyLoginBtn')}
            </motion.a>
          </motion.div>

          {/* 회원가입 */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-line-400">
            <p className="text-center text-body-3 text-label-600">
              {t('noAccountYet')}{' '}
              <Link href={signupHref} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors inline-flex items-center gap-1">
                {t('signupLink')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </motion.div>

          {/* 하단 텍스트 */}
          <motion.p
            variants={itemVariants}
            className="text-center text-caption-2 text-label-400 mt-6"
          >
            {t('termsAgreement')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
