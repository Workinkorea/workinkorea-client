import type { Metadata } from "next";
import { ReactNode } from "react";
import { pretendard } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import { WebsiteSchema, OrganizationSchema } from "@/components/seo/StructuredData";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from 'sonner';

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
