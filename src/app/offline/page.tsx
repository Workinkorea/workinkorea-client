'use client';

import { WifiOff } from 'lucide-react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <EmptyState
          icon={WifiOff}
          title="인터넷 연결을 확인해주세요"
          description="네트워크 연결이 끊어졌습니다. 연결 상태를 확인한 후 다시 시도해주세요. / Please check your internet connection and try again."
          size="lg"
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.reload()}
            >
              다시 시도 / Retry
            </Button>
          }
        />
      </div>
    </div>
  );
}
