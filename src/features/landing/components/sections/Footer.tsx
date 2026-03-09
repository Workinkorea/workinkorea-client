'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github } from 'lucide-react';

const linkVariants = {
  hover: { x: 4, transition: { duration: 0.2 } },
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* 컬럼 1: 브랜드 */}
          <div className="space-y-3">
            <div>
              <p className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-blue-400 tracking-tight">
                Work In Korea
              </p>
              <div className="mt-1 h-1 w-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px]">
              외국인 근로자를 위한 한국 취업 플랫폼. 맞춤형 채용공고, 이력서 관리, 자가진단 서비스를 제공합니다.
            </p>

            {/* 소셜 아이콘 */}
            <div className="flex gap-3 pt-2">
              {[
                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { Icon: Github, href: 'https://github.com', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 컬럼 2: 서비스 */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">서비스</h3>
            <ul className="space-y-2.5">
              {[
                { name: '채용공고 찾기', href: '/jobs' },
                { name: '자가진단', href: '/diagnosis' },
                { name: '기업 채용', href: '/company' },
                { name: '이력서 관리', href: '/user/resume' },
              ].map((link) => (
                <li key={link.href}>
                  <motion.div
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* 컬럼 3: 지원 */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">지원</h3>
            <ul className="space-y-2.5">
              {[
                { name: '이용약관', href: '/terms' },
                { name: '개인정보처리방침', href: '/privacy' },
                { name: '고객센터', href: '/support' },
                { name: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.href}>
                  <motion.div
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* 컬럼 4: 연락처 */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">연락처</h3>
            <ul className="space-y-2.5 text-[13px] text-slate-500">
              <li>
                <a href="mailto:support@workinkorea.kr" className="hover:text-slate-200 transition-colors">
                  support@workinkorea.kr
                </a>
              </li>
              <li>
                <a href="tel:+82-2-1234-5678" className="hover:text-slate-200 transition-colors">
                  +82-2-1234-5678
                </a>
              </li>
              <li className="pt-1">
                <span className="text-slate-400">평일 09:00 - 18:00</span>
              </li>
              <li>
                <span className="text-slate-400">(공휴일 제외)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/[0.06]" />

        {/* 하단 */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-600">
          <p>© 2026 Work In Korea. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              개인정보
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
