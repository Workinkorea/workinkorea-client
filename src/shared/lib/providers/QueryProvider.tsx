'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode, useState } from 'react';
import { getErrorByFetch } from '@/shared/lib/utils/getErrorByFetch';
import { FetchError } from '@/shared/api/fetchClient';

interface ReactQueryProviderProps {
  children: ReactNode;
  showDevTools?: boolean;
}

function ReactQueryProvider({
  showDevTools = false,
  children,
}: ReactQueryProviderProps) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000, 
        },
        mutations: {
          throwOnError: false,
          onError: (error) => {
            if (error instanceof FetchError) {
              const { description } = getErrorByFetch(error);
              console.error(description);
            }
          }
        },
      },
    }),
  );
  return (
    <QueryClientProvider client={client}>
      {showDevTools && <ReactQueryDevtools buttonPosition="bottom-left" />}
      {children}
    </QueryClientProvider>
  );
}


export default ReactQueryProvider;