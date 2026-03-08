import { Header } from '@/shared/components/layout/Header';
import Layout from '@/shared/components/layout/Layout';
import { ReactNode } from 'react';

export default function BusinessSignupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type="business" />
      <main className='flex'>
        <Layout.Main>
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}