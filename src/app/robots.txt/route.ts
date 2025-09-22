import { NextResponse } from 'next/server';

export function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

# 검색엔진이 접근하지 않았으면 하는 페이지들
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# 사이트맵 위치
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://workinkorea.com'}/sitemap.xml

# 크롤링 속도 조절 (선택사항)
Crawl-delay: 1
  `.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // 24시간 캐시
    },
  });
}