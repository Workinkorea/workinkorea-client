'use client';

import { useState } from 'react';
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";

export default function Home() {
  const [headerType, setHeaderType] = useState<'homepage' | 'business'>('homepage');

  const handleToggleType = () => {
    setHeaderType(prev => prev === 'homepage' ? 'business' : 'homepage');
  };

  return (
    <Layout>
      <Header type={headerType} onToggleType={handleToggleType} />
    </Layout>
  );
}
