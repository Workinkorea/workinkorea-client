import Header from '@/shared/components/layout/Header';
import Layout from '@/shared/components/layout/Layout';
import { ReactNode } from 'react';

export default function BusinessLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type="business" />
      <main className='flex justify-center min-h-screen'>
        <Layout.Main className="max-w-[32.5rem] w-full">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}