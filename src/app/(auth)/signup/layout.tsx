import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import { ReactNode } from 'react';

export default function SignupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <Header type="homepage" />
      <main className='flex'>
        {children}
      </main>
    </Layout>
  );
}