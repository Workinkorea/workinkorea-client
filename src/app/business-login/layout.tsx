import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';

export default function BusinessLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type='business' />
      <main className='flex justify-center'>
        <Layout.Main className="max-w-[32.5rem]">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}