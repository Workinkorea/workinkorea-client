import { ReactNode } from 'react';

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {children}
    </div>
  );
}
