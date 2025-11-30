import type { Metadata } from "next";
import { ReactNode } from "react";
import { pretendard } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import { WebsiteSchema, OrganizationSchema } from "@/components/seo/StructuredData";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from 'sonner';
import Script from 'next/script';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></Script>
      </head>
      <body suppressHydrationWarning={true}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <div id="modal-root"></div>
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
