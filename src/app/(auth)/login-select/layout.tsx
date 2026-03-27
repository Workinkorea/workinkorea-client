import { ReactNode } from 'react';

export default function LoginSelectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      {children}
    </div>
  );
}
