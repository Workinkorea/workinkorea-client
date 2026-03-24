import { ReactNode } from 'react';

interface ResumeLayoutProps {
  children: ReactNode;
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
