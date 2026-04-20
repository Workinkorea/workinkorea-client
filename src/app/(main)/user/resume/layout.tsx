import { Metadata } from 'next';
import { createMetadata } from '@/shared/lib/metadata';
import { ReactNode } from 'react';

export const metadata: Metadata = createMetadata({
  title: '이력서 관리',
  description: '이력서를 작성하고 편집하세요.',
  noIndex: true,
});

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
