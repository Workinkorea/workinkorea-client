'use client';

import { Suspense } from 'react';
import BusinessLoginForm from '@/features/auth/components/BusinessLoginForm';

function BusinessLoginSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* 좌측 패널 스켈레톤 */}
      <div className="hidden lg:block flex-1 bg-linear-to-br from-blue-600 to-blue-900" />
      {/* 우측 폼 스켈레톤 */}
      <div className="flex flex-1 flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 bg-white">
        <div className="w-full max-w-[400px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-16 skeleton-shimmer rounded" />
            <div className="h-7 w-40 skeleton-shimmer rounded" />
            <div className="h-3 w-56 skeleton-shimmer rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 skeleton-shimmer rounded" />
            <div className="h-11 w-full skeleton-shimmer rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 skeleton-shimmer rounded" />
            <div className="h-11 w-full skeleton-shimmer rounded-lg" />
          </div>
          <div className="h-4 w-24 skeleton-shimmer rounded" />
          <div className="space-y-3">
            <div className="h-11 w-full skeleton-shimmer rounded-lg" />
            <div className="h-11 w-full skeleton-shimmer rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyLoginClient() {
  return (
    <Suspense fallback={<BusinessLoginSkeleton />}>
      <BusinessLoginForm />
    </Suspense>
  );
}
