import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: '../../../public/fonts/pretendard/PretendardStd-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/pretendard/PretendardStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/pretendard/PretendardStd-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/pretendard/PretendardStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
  fallback: [
    '-apple-system', 
    'BlinkMacSystemFont', 
    'system-ui', 
    'Roboto', 
    'Helvetica Neue', 
    'Segoe UI', 
    'Apple SD Gothic Neo', 
    'Noto Sans KR', 
    'Malgun Gothic', 
    'sans-serif'
  ],
});