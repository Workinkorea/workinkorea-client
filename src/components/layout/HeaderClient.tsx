'use client';

import { useAuth } from '@/hooks/useAuth';
import Header from './Header';

interface HeaderClientProps {
  type?: 'homepage' | 'business';
}

/**
 * 클라이언트 컴포넌트 래퍼
 * useAuth 훅을 사용하여 인증 상태를 관리하고 Header 컴포넌트에 전달합니다.
 */
export default function HeaderClient({ type }: HeaderClientProps = {}) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth({ required: false });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Header
      type={type || (userType === 'company' ? 'business' : 'homepage')}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onLogout={handleLogout}
    />
  );
}
