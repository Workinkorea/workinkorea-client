'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Header } from './Header';
import { cookieManager } from '@/shared/lib/utils/cookieManager';
import type { ViewType } from '@/shared/components/UserTypeToggle';

// 개인 뷰에서 접근 가능한 공개 경로 — 뷰 전환 시 현재 페이지 유지
const PUBLIC_PATHS = ['/', '/jobs', '/diagnosis', '/self-diagnosis'];

interface HeaderClientProps {
  type?: 'homepage' | 'business';
}

export function HeaderClient({ type }: HeaderClientProps = {}) {
  const { isAuthenticated, isLoading, userType, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
    // 로그인 상태에서는 토글 변경 무시 (실제 계정 타입을 따름)
    if (isAuthenticated) return;

    setViewType(next);

    // 비로그인 시 userTypeClient bridge 쿠키 갱신 → 페이지 전환 후 UI 반영
    cookieManager.setUserType(next === 'company' ? 'company' : 'user');

    if (next === 'company') {
      router.push('/company');
    } else {
      // 현재 페이지가 공개 경로면 그대로 유지, 아니면 홈으로
      const isPublicPage = PUBLIC_PATHS.some(p =>
        p === '/' ? pathname === '/' : pathname.startsWith(p)
      );
      router.push(isPublicPage ? pathname : '/');
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
      isToggleDisabled={isAuthenticated}
    />
  );
}
