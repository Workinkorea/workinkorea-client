import { Metadata } from 'next';

const siteConfig = {
  name: 'WorkInKorea',
  title: '워크인코리아 - 한국 취업의 모든 것',
  description: '한국에서 일하고 싶은 외국인과 외국인을 채용하고 싶은 기업을 연결하는 플랫폼입니다. 채용공고, 이력서 작성, 면접 준비까지 한국 취업의 모든 과정을 지원합니다.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://workinkorea.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    '한국 취업',
    '외국인 채용',
    '한국 일자리',
    '외국인 구직',
    '한국 기업',
    '채용 공고',
    '이력서',
    '면접',
    'Korea Jobs',
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