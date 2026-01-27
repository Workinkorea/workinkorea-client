import type { NextConfig } from "next";

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
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://t1.daumcdn.net",
              // Tailwind CSS 및 인라인 스타일 허용
              "style-src 'self' 'unsafe-inline'",
              // 이미지는 자체 도메인 + data URI + HTTPS
              "img-src 'self' data: https:",
              // 폰트는 자체 도메인만
              "font-src 'self' data:",

              `connect-src 'self' https://arw.byeong98.xyz https://t1.daumcdn.net`,
              // iframe 허용 안 함 (frame-ancestors와 함께 사용)
              "frame-src 'none'",
              // 외부 리소스 프리페치 차단
              "prefetch-src 'self'",
              // 객체 임베드 차단
              "object-src 'none'",
              // 기본 URI 제한
              "base-uri 'self'",
              // 폼 제출 대상 제한
              "form-action 'self'",
              // iframe 내 포함 차단
              "frame-ancestors 'none'",
              // HTTPS로 업그레이드 (프로덕션)
              ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Clickjacking 공격 방어
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

export default nextConfig;