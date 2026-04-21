'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common.footer');

  const links = [
    { name: t('jobsLink'), href: '/jobs' },
    { name: t('terms'), href: '/terms' },
    { name: t('privacy'), href: '/privacy' },
    { name: t('supportLink'), href: '/support' },
    { name: t('faq'), href: '/faq' },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="page-container flex flex-col items-center gap-3">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-caption-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <p className="text-caption-2 text-slate-400">
          {t('allRights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
