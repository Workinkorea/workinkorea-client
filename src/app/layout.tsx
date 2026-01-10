import type { Metadata } from "next";
import { ReactNode } from "react";
import { pretendard } from "@/shared/lib/fonts";
import { defaultMetadata } from "@/shared/lib/metadata";
import { WebsiteSchema, OrganizationSchema } from "@/shared/components/seo/StructuredData";
import "./globals.css";
import ReactQueryProvider from "@/shared/lib/providers/QueryProvider";
import { ThemeProvider } from "@/shared/lib/providers/ThemeProvider";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
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
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
