'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Header } from './Header';
import type { ViewType } from '@/shared/components/UserTypeToggle';

interface HeaderClientProps {
  type?: 'homepage' | 'business';
}

export function HeaderClient({ type }: HeaderClientProps = {}) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth();
  const router = useRouter();

  const defaultView: ViewType = type
    ? type === 'business' ? 'company' : 'personal'
    : userType === 'company' ? 'company' : 'personal';

  const [viewType, setViewType] = useState<ViewType>(defaultView);

  // auth 로드 완료 후 기업 사용자면 company로 초기화
  useEffect(() => {
    if (!isLoading && !type) {
      setViewType(userType === 'company' ? 'company' : 'personal');
    }
  }, [isLoading, userType, type]);

  function handleViewTypeChange(next: ViewType) {
    setViewType(next);
    if (next === 'company') {
      router.push('/company');
    } else {
      router.push('/');
    }
  }

  return (
    <Header
      type={viewType === 'company' ? 'business' : 'homepage'}
      viewType={viewType}
      onViewTypeChange={handleViewTypeChange}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onLogout={logout}
    />
  );
}
