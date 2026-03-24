import Link from 'next/link';

const links = [
  { name: '채용 공고 찾아보기', href: '/jobs' },
  { name: '이용약관', href: '/terms' },
  { name: '개인정보처리방침', href: '/privacy' },
  { name: '고객센터', href: '/support' },
  { name: '자주 묻는 질문', href: '/faq' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="page-container flex flex-col items-center gap-3">
        {/* 링크 */}
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

        {/* 저작권 */}
        <p className="text-caption-2 text-slate-400">
          © 2026 Work In Korea. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
