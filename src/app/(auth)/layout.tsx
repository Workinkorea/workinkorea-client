import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Layout>
      <main className='flex justify-center min-h-screen'>
        <Layout.Main className="max-w-[32.5rem] w-full">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}