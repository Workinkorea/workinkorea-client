import { ReactNode } from 'react';
import Header from '@/components/layout/Header';

export default function BusinessSignupLayout({
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