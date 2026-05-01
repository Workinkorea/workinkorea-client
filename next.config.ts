import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withPWA = withPWAInit({
  dest: 'public',
  // cacheOnFrontEndNav + aggressiveFrontEndNavCaching 비활성화
  // 이유: 인증 상태 변경 후 SW가 캐시된 HTML을 제공하면
  // React 하이드레이션 불일치 → 영구 skeleton 표시 버그 발생
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbacks: {
    document: '/offline',
  },
});

const nextConfig: NextConfig = {
  output: 'standalone',

  // React Compiler 활성화 (Next.js 16에서 stable)
  reactCompiler: true,

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'], // 최신 이미지 포맷 우선 사용
    minimumCacheTTL: 86400, // 24시간 캐싱 (Next.js 16 기본값: 4시간)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 번들 최적화
  compress: true, // Gzip 압축 활성화

  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js 개발 모드 및 빌드 최적화를 위해 필요
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://t1.daumcdn.net https://*.daumcdn.net https://*.kakao.com https://static.cloudflareinsights.com",
              // Tailwind CSS 및 인라인 스타일 허용
              "style-src 'self' 'unsafe-inline' https://*.daumcdn.net https://*.kakao.com",
              // 이미지는 자체 도메인 + data URI + HTTPS
              "img-src 'self' data: https:",
              // 폰트는 자체 도메인만
              "font-src 'self' data:",
              // Service Worker 허용 (PWA)
              "worker-src 'self'",

              `connect-src 'self' https://wik-dev.moon-core.com https://*.workinkorea.net https://*.daum.net https://*.daumcdn.net https://*.kakao.com https://static.cloudflareinsights.com`,
              // Daum/Kakao 우편번호 팝업 허용
              "frame-src https://*.daum.net https://*.daumcdn.net https://postcode.map.daum.net https://*.kakao.com",
              // 객체 임베드 차단
              "object-src 'none'",
              // 기본 URI 제한
              "base-uri 'self'",
              // 폼 제출 대상 제한
              "form-action 'self'",
              // 외부 사이트의 iframe에 현재 페이지 포함 차단 (clickjacking 방어)
              "frame-ancestors 'self'",
              // HTTPS로 업그레이드 (프로덕션)
              ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Clickjacking 방어 + 동일 출처 iframe 허용
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // MIME type sniffing 방지
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // 민감한 정보 노출 최소화
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on', // DNS 프리페치 활성화 (성능)
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()', // 카메라 접근 차단
              'microphone=()', // 마이크 접근 차단
              'geolocation=()', // 위치 정보 차단
              'interest-cohort=()', // FLoC 추적 차단
            ].join(', '),
          },
          // HTTPS 강제 (프로덕션 환경)
          ...(process.env.NODE_ENV === 'production'
            ? [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
              },
            ]
            : []),
        ],
      },
    ];
  },
};

export default withNextIntl(withPWA(nextConfig));