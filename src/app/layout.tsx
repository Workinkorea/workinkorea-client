import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'work-in-korea',
  description: 'work-in-korea'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
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
