import { HeaderClient } from '@/shared/components/layout/HeaderClient';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
