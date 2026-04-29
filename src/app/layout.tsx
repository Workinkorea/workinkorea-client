import type { Metadata } from "next";
import { ReactNode } from "react";
import { pretendard, plusJakartaSans } from "@/shared/lib/fonts";
import { defaultMetadata } from "@/shared/lib/metadata";
import { WebsiteSchema, OrganizationSchema } from "@/shared/components/seo/StructuredData";
import "./globals.css";
import ReactQueryProvider from "@/shared/lib/providers/QueryProvider";
import { Toaster } from 'sonner';
import { BackToTop } from '@/shared/ui/BackToTop';
import { InstallPrompt } from '@/features/pwa/ui/InstallPrompt';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${pretendard.variable} ${plusJakartaSans.variable}`}>
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
          <div id="modal-root"></div>
          <BackToTop />
          <InstallPrompt />
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
