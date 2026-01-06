'use client';

import React from 'react';
import Layout from '@/shared/components/layout/Layout';
import Header from '@/shared/components/layout/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ResumeLayoutProps {
  children: React.ReactNode;
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth({ required: true });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Layout>
      <Header
        type={userType === 'company' ? 'business' : 'homepage'}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-background-alternative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </Layout>
  );
}