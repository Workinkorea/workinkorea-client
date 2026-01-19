'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import Header from './Header';

interface HeaderClientProps {
  type?: 'homepage' | 'business';
}

export default function HeaderClient({ type }: HeaderClientProps = {}) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth();

  return (
    <Header
      type={type || (userType === 'company' ? 'business' : 'homepage')}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onLogout={logout}
    />
  );
}
