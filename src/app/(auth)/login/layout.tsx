import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import { ReactNode } from 'react';

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type="homepage" />
      <main className='flex justify-center min-h-screen'>
        <Layout.Main className="max-w-[32.5rem] w-full">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}