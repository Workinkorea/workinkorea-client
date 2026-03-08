import type { Metadata } from "next";
import { ReactNode } from "react";
import { pretendard, plusJakartaSans } from "@/shared/lib/fonts";
import { defaultMetadata } from "@/shared/lib/metadata";
import { WebsiteSchema, OrganizationSchema } from "@/shared/components/seo/StructuredData";
import "./globals.css";
import ReactQueryProvider from "@/shared/lib/providers/QueryProvider";
import { Toaster } from 'sonner';
import Script from 'next/script';
import { BackToTop } from '@/shared/ui/BackToTop';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${plusJakartaSans.variable}`}>
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
        <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></Script>
      </head>
      <body suppressHydrationWarning={true}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <div id="modal-root"></div>
        <BackToTop />
        <Toaster
          richColors
          position='top-center'
          duration={2000}
          closeButton={true}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
      </body>
    </html>
  );
}
