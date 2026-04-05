import { Metadata } from 'next';

const siteConfig = {
  name: 'WorkInKorea',
  title: '글로벌 인재 매칭 플랫폼 | 검증된 외국인 구직자와 한국 기업의 완벽한 연결',
  description: '워크인코리아 ICT 검증센터 모델을 기반으로, 한국 기업과 사전 검증된 우수 외국인 인재를 직접 연결하는 신뢰도 높은 채용 매칭 플랫폼입니다.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://workinkorea.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    '외국인 채용',
    '외국인 구직',
    '한국 취업',
    '검증된 외국인 인재',
    '워크인코리아',
    'ICT 검증센터',
    '글로벌 인재 매칭',
    'E-7 비자 채용',
    'IT 개발자 채용',
    'Hire foreign tech talent Korea',
    'Korea job matching',
    'verified foreign workers',
    'Work in Korea',
    'Korean Companies',
    'Job Search Korea',
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'WorkInKorea Team' }],
  creator: 'WorkInKorea',
  publisher: 'WorkInKorea',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@workinkorea',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    other: {
      'naver-site-verification': process.env.NAVER_VERIFICATION_ID || '',
    },
  },
};

export function createMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

export { siteConfig };