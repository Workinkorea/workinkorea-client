import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import koMessages from '../../../messages/ko.json';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

type Options = RenderOptions & {
  queryClient?: QueryClient;
  locale?: 'ko' | 'en';
};

export function renderWithProviders(ui: ReactElement, opts: Options = {}) {
  const client = opts.queryClient ?? createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={opts.locale ?? 'ko'} messages={koMessages}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );
  return { queryClient: client, ...render(ui, { wrapper: Wrapper, ...opts }) };
}
