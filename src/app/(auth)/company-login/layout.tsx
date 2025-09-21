import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

export default function BusinessLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header type='business' />
      {children}
    </>
  );
}