'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Settings, User, Globe, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/shared/components/layout/Layout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LanguageToggle } from '@/shared/components/LanguageToggle';

export function UserSettingsClient() {
  const t = useTranslations('settings');
  const router = useRouter();
  const { logout } = useAuth();

  const sections = [
    {
      icon: User,
      title: t('profileEdit'),
      description: t('profileEditDesc'),
      onClick: () => router.push('/user/profile/edit'),
    },
    {
      icon: Globe,
      title: t('language'),
      description: t('languageDesc'),
      customContent: true,
    },
    {
      icon: LogOut,
      title: t('logout'),
      description: t('logoutDesc'),
      onClick: () => logout(),
      destructive: true,
    },
  ];

  return (
    <Layout>
      <main className="flex-1 bg-slate-50">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-title-3 font-bold text-slate-900">{t('title')}</h1>
              <p className="text-caption-1 text-slate-500 mt-0.5">{t('subtitle')}</p>
            </div>
          </div>

          {/* 설정 섹션 */}
          <div className="space-y-3">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border border-slate-200 rounded-xl p-5 ${
                  section.onClick ? 'cursor-pointer hover:border-slate-300 transition-colors' : ''
                }`}
                onClick={section.onClick}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      section.destructive ? 'bg-red-50' : 'bg-slate-50'
                    }`}>
                      <section.icon
                        size={18}
                        className={section.destructive ? 'text-red-500' : 'text-slate-600'}
                      />
                    </div>
                    <div>
                      <h3 className={`text-body-2 font-semibold ${
                        section.destructive ? 'text-red-600' : 'text-slate-900'
                      }`}>
                        {section.title}
                      </h3>
                      <p className="text-caption-2 text-slate-500 mt-0.5">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {section.customContent && <LanguageToggle />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
