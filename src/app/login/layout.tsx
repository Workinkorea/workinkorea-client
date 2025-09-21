import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type='homepage' />
      <main className='flex justify-center'>
        <Layout.Main className="max-w-[32.5rem]">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}