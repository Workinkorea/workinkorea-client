import { ReactNode } from 'react';

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {children}
    </div>
  );
}
