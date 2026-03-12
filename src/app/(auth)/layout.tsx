import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
