import Layout from '@/components/layout/Layout';

export default function BusinessSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <main className='flex justify-center'>
        <Layout.Main className="max-w-[32.5rem]">
          {children}
        </Layout.Main>
      </main>
    </Layout>
  );
}