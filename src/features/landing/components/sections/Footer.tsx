'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = [
  { name: '채용공고 찾아보기', href: '/jobs' },
  { name: '이용약관', href: '/terms' },
  { name: '개인정보처리방침', href: '/privacy' },
  { name: '고객센터', href: '/support' },
  { name: '자주 묻는 질문', href: '/faq' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-4 py-6">
      {/* 링크 */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
        {footerLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="relative text-[13px] text-slate-500 hover:text-slate-800 transition-colors group"
          >
            {link.name}
            <motion.span
              className="absolute bottom-0 left-0 h-px bg-slate-500 w-full origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.22 }}
            />
          </Link>
        ))}
      </div>

      {/* 저작권 */}
      <p className="text-center text-[12px] text-slate-400">
        © 2026 Work In Korea. All rights reserved.
      </p>
    </footer>
  );
}
