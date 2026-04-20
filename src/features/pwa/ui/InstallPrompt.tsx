'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X } from 'lucide-react';

// 작성/수정 페이지에서는 설치 프롬프트를 숨김 (ISSUE-58)
const HIDDEN_PATH_PATTERNS = [/\/create$/, /\/edit\//, /\/setup$/];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isHiddenPage = HIDDEN_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || isHiddenPage) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4 px-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md px-4 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Download size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-2 font-semibold text-slate-800">앱 설치하기</p>
          <p className="text-caption-1 text-slate-500">홈 화면에 추가하면 더 빠르게 이용할 수 있어요</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 bg-blue-600 text-white text-caption-1 font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            설치
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
