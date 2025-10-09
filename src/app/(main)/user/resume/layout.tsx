import React from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';

interface ResumeLayoutProps {
  children: React.ReactNode;
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  return (
    <Layout>
      <Header type="homepage" />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </Layout>
  );
}