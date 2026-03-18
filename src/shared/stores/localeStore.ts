'use client';

import { create } from 'zustand';

type Locale = 'ko' | 'en';

function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'ko';
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  const value = match ? decodeURIComponent(match[1]) : 'ko';
  return value === 'en' ? 'en' : 'ko';
}

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'ko', // SSR 기본값 — 클라이언트에서 초기화

  setLocale: (locale: Locale) => {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    set({ locale });
    window.location.reload();
  },
}));

// 클라이언트에서 쿠키 기반으로 초기화
if (typeof window !== 'undefined') {
  const cookieLocale = getLocaleFromCookie();
  useLocaleStore.setState({ locale: cookieLocale });
}
