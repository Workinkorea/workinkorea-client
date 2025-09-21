import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

export default function SignupLayout({
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