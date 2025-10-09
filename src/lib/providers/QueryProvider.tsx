'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import React, { ReactNode, useState } from 'react';
import { getErrorByCode } from '../utils/getErrorByCode';

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
            if (error instanceof AxiosError) {
              const { description } = getErrorByCode(error);
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