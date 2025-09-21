import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header type='homepage' />
      {children}
    </>
  );
}