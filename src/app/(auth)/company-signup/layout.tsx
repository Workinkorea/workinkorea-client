import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import { ReactNode } from 'react';

export default function BusinessSignupLayout({
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